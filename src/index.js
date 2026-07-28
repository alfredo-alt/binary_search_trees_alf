// index.js
// Orchestrator: the only file that knows about BOTH apiService and
// domController. Neither of those two knows about the other.

import './styles/style.css';
import { fetchRandomGif, searchGifs } from './modules/apiService.js';
import { render, showLoading, showGif, showGifGrid, showError } from './modules/domController.js';

const callbacks = {
  onFetchRandom() {
    showLoading();
    fetchRandomGif()
      .then((data) => showGif(data.data))
      .catch((error) => {
        // This .catch() covers: real network failures (offline, DNS
        // failure, invalid URL) AND our own manually-thrown Error from
        // apiService.js when response.ok is false (e.g. 404).
        console.error(error);
        showError('Could not load a GIF. Please try again.');
      });
  },

  onSearch(query) {
    showLoading();
    searchGifs(query)
      .then((data) => showGifGrid(data.data))
      .catch((error) => {
        console.error(error);
        showError(`Something went wrong searching for "${query}". Please try again.`);
      });
  },
};

function init() {
  render(callbacks);
  callbacks.onFetchRandom(); // load one GIF right away on page load
}

init();
