import './App.css'
import * as React from 'react';
import axios from 'axios';
import { SearchForm } from './components/search-form';
import { List } from './components/list';
import { LastSearches } from './components/last-searches';
import { storiesReducer} from './reducers/stories';

const API_BASE      = 'https://hn.algolia.com/api/v1';
const API_SEARCH    = '/search';
const PARAM_SEARCH  = 'query=';
const PARAM_PAGE    = 'page=';

const getUrl = (searchTerm, page) => `${API_BASE}${API_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}`;

const extractSearchTerm = (url) =>
  url
    .substring(url.lastIndexOf('?') + 1, url.lastIndexOf('&'))
    .replace(PARAM_SEARCH, '');

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

  const [stories, dispatchStories] = React.useReducer(storiesReducer, { data: [], page: 0, isLoading: false, isError: false });
  const [searchTerm, setSearchTerm] = React.useState(localStorage.getItem('search') || '');
  const [urls, setUrls] = React.useState([getUrl(searchTerm, 0)]);

  const handleFetchStories = React.useCallback(async () => {
    dispatchStories({ type: 'STORIES_FETCH_INIT' });
    try {
      const lastUrl = urls[urls.length - 1];
      const result = await axios.get(lastUrl);
      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: {
          list: result.data.hits,
          page: result.data.page,
        }
      });
    } catch (error) {
      dispatchStories({ type: 'STORIES_FETCH_FAILURE' });
    }
  }, [urls]);

  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value);
  };

  const searchAction = () => {
    handleSearch(searchTerm, 0);
  };

  const handleSearch = (searchTerm, page) => {
    const url = getUrl(searchTerm, page);
    setUrls(urls.concat(url));
  };

  const lastSearches = getLastSearches(urls);

  const handleLastSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    handleSearch(searchTerm, 0);
  };

  const handleMore = () => {
    const lastUrl = urls[urls.length - 1];
    const searchTerm = extractSearchTerm(lastUrl);
    handleSearch(searchTerm, stories.page + 1);
  };

  const handleRemoveStory = (item) => {
    dispatchStories({ type: 'REMOVE_STORY', payload: item });
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

      <LastSearches
        lastSearches={lastSearches}
        onLastSearch={handleLastSearch}
      />

      <hr />

      {stories.isError && <p>Oops... something went wrong!</p>}

      <List list={stories.data} onRemoveItem={handleRemoveStory} />

      {stories.isLoading ? (
        <p>Loading...</p>
      ) : (
        <button type='button' onClick={handleMore}>
          More
        </button>
      )}
    </>
  )
};

export default App
