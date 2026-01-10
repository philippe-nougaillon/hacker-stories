import './App.css'
import * as React from 'react';

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

const App = () => {

  // const initialStories = [
  //   {
  //     title: 'React',
  //     url: 'https://react.dev/',
  //     author: 'Jordan Wake',
  //     num_comments: 3,
  //     points: 4,
  //     objectID: 0,
  //   },
  //   {
  //     title: 'Redux',
  //     url: 'https://redux.js.org/',
  //     author: 'Dan Abramov',
  //     num_comments: 2,
  //     points: 5,
  //     objectID: 1,
  //   }
  // ];

  /*
  const getAsyncStories = () =>
    new Promise((resolve) => 
      setTimeout(() => resolve({ data: { stories: initialStories } }), 2000)
  );
  */

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

  React.useEffect(() => {
    if (!searchTerm) return;

    dispatchStories({ type: 'STORIES_FETCH_INIT' });

    fetch(`${ API_ENDPOINT }${searchTerm}`)
      .then((response) => response.json())
      .then(result => { 
        dispatchStories({type: 'STORIES_FETCH_SUCCESS', payload: result.hits});
      })
      .catch(()=> { 
        dispatchStories({ type: 'STORIES_FETCH_FAILURE' });
      });
  }, [searchTerm]);

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

  const Search = ({search, onSearch}) => (
    <>
      <InputWithLabel
        id='search'
        value={searchTerm}
        onInputChange={handleSearch}>
          <strong>Search :</strong>
      </InputWithLabel>
      <p>
        Searching for <strong>{search}</strong>
      </p>
    </>
  );

  const searchedStories = stories.data.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <h1>Hacker news</h1>      
      <hr />
      <Search search={searchTerm} onSearch={handleSearch} />
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
