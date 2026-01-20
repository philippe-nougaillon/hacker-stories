import './App.css'
import * as React from 'react';
import axios from 'axios';


import { SearchForm } from './search-form';
import { List } from './list';
import { LastSearches } from './last-searches';

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';
const extractSearchTerm = (url) => url.replace(API_ENDPOINT, '');
const getUrl = (searchTerm) => `${API_ENDPOINT}${searchTerm}`;

const getLastSearches = (urls) => 
  urls.reduce((result, url, index) => {
    const searchTerm = extractSearchTerm(url);
    if (index === 0) {
      return result.concat(searchTerm);
    }

    const previousSearchTerm = result[result.length - 1];

    if (searchTerm === previousSearchTerm) {
      return result;
    } else {
      return result.concat(searchTerm);
    }
  }, [])
  .slice(-6)
  .slice(0, -1);

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
  const [urls, setUrls] = React.useState([getUrl(searchTerm)]);

  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFetchStories = React.useCallback(async () => {
    dispatchStories({ type: 'STORIES_FETCH_INIT' });
    try {
      const lastUrl = urls[urls.length - 1];
      const result = await axios.get(lastUrl);
      dispatchStories({ type: 'STORIES_FETCH_SUCCESS', payload: result.data.hits });
    } catch (error) {
      dispatchStories({ type: 'STORIES_FETCH_FAILURE' });
    }
  }, [urls]);

  const handleRemoveStory = (item) => {
    dispatchStories({ type: 'REMOVE_STORY', payload: item });
  };

  const handleSearch = (searchTerm) => {
    const url = getUrl(searchTerm);
    setUrls(urls.concat(url));
  };

  const handleLastSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    handleSearch(searchTerm);
  };

  const searchAction = (event) => {
    handleSearch(searchTerm);
  };

  const lastSearches = getLastSearches(urls);


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

      <LastSearches
        lastSearches={lastSearches}
        onLastSearch={handleLastSearch}
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
