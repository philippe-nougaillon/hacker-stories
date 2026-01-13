import './App.css'
import * as React from 'react';
import axios from 'axios';

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

const App = () => {

  const storiesReducer = (state, action) => {
    switch (action.type) {
      case 'STORIES_FETCH_INIT':
        return {
          ...state,
          isLoading: true,
          isError: false,
        };
      case 'STORIES_FETCH_SUCCESS': 
        return {
          ...state,
          isLoading: false,
          isError: false,
          data: action.payload,
        };
      case 'STORIES_FETCH_FAILURE': 
        return {
          ...state,
          isLoading: false,
          isError: true,
        };  
      case 'REMOVE_STORY':
        return {
          ...state,
          data: state.data.filter((story) => action.payload.objectID !== story.objectID),
        };
      default:
        throw new Error();
    }
  };

  const [stories, dispatchStories] = React.useReducer(storiesReducer, { data: [], isLoading: false, isError: false});

  const [searchTerm, setSearchTerm] = React.useState(
    localStorage.getItem('search') || ''
  );

  const [url, setUrl] = React.useState(`${API_ENDPOINT}${searchTerm}`)

  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value);
  }

  const handleSearchSubmit = (event) => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
    event.preventDefault();
  }

  const handleFetchStories = React.useCallback(async () => {
    dispatchStories({ type: 'STORIES_FETCH_INIT' });
    try {
      const result = await axios.get(url);
      dispatchStories({type: 'STORIES_FETCH_SUCCESS', payload: result.data.hits});
    } catch (error) {
      dispatchStories({ type: 'STORIES_FETCH_FAILURE' });
    }
  }, [url]);

  React.useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  const handleRemoveStory = (item) => {
    dispatchStories({type: 'REMOVE_STORY', payload: item });
  };

  React.useEffect(() => {
    localStorage.setItem('search', searchTerm);
    }, [searchTerm] 
  );

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  }; 

  const List = ({ list, onRemoveItem }) =>
    <ul>
      {list.map((item) => (
        <Item 
          key={item.objectID} 
          item={item}
          onRemoveItem={onRemoveItem}
        />
      ))}
    </ul>
    
  const Item = ({ item, onRemoveItem }) =>
    <>
      <li>
        <span>
          <a href={item.url}>{item.title}</a>
        </span>
        <br></br>
        <span>{item.author}</span>
        <span>
          <button type='button' onClick={() => onRemoveItem(item) }>
            Dismiss
          </button>
        </span>
        <br></br>
        <br></br>
      </li>
    </>  

  const InputWithLabel = ({ id, label, value, type = 'text', onInputChange, children }) => (
    <>
      <label htmlFor={id}>{children}</label>
      <br/>
      <input 
        id={id}
        type={type}
        value={value}
        onChange={onInputChange}
      />
    </>
  );

  const SearchForm = ({
    searchTerm, 
    onSearchInput,
    onSearchSubmit,
  }) => (
    <form onSubmit={handleSearchSubmit}>
      <InputWithLabel
        id='search'
        value={searchTerm}
        isFocused
        onInputChange={onSearchInput}>
          <strong>Search :</strong>
      </InputWithLabel>

      <button type='submit' disabled={!searchTerm}>
        Submit
      </button>
    </form>
  );

  const searchedStories = stories.data.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <h1>Hacker news</h1>      
      <hr />
      
      <SearchForm 
        searchTerm={searchTerm} 
        onSearchInput={handleSearchInput} 
        onSearchSubmit={handleSearchSubmit}
      />
      
      <hr />
      
      { stories.isError && <p>Oops... something went wrong!</p> }

      { stories.isLoading ? ( 
        <p>Loading...</p>
      ) : ( 
        <List list={stories.data} onRemoveItem={handleRemoveStory} /> 
      )}
    </>
  )
}

export default App
