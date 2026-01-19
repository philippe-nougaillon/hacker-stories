import './App.css'
import * as React from 'react';
import axios from 'axios';


import { SearchForm } from './search-form';
import { List } from './list';

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

  const [stories, dispatchStories] = React.useReducer(storiesReducer, { data: [], isLoading: false, isError: false });
  const [searchTerm, setSearchTerm] = React.useState(localStorage.getItem('search') || '');
  const [url, setUrl] = React.useState(`${API_ENDPOINT}${searchTerm}`)

  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFetchStories = React.useCallback(async () => {
    dispatchStories({ type: 'STORIES_FETCH_INIT' });
    try {
      const result = await axios.get(url);
      dispatchStories({ type: 'STORIES_FETCH_SUCCESS', payload: result.data.hits });
    } catch (error) {
      dispatchStories({ type: 'STORIES_FETCH_FAILURE' });
    }
  }, [url]);

  const handleRemoveStory = (item) => {
    dispatchStories({ type: 'REMOVE_STORY', payload: item });
  };

  const searchAction = (event) => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
    // event.preventDefault();
  };

  React.useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  React.useEffect(() => {
    localStorage.setItem('search', searchTerm);
  }, [searchTerm]);

  return (
    <>
      <h1>Hacker news</h1>
      <hr />

      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        searchAction={searchAction}
      />

      <hr />

      {stories.isError && <p>Oops... something went wrong!</p>}

      {stories.isLoading ? (
        <p>Loading...</p>
      ) : (
        <List list={stories.data} onRemoveItem={handleRemoveStory} />
      )}
    </>
  )
};

export default App
