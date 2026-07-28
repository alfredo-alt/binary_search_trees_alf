// domController.js
// Single Responsibility (S in SOLID): ONLY knows how to build/update DOM
// elements. It never imports apiService — it receives data and callback
// functions from the orchestrator (index.js). Same Dependency Inversion
// pattern as the todo-list project: this module could be swapped out
// without apiService ever knowing.

const appRoot = document.getElementById('app');

function render(callbacks) {
  appRoot.innerHTML = '';

  const container = document.createElement('div');
  container.className = 'app-container';

  const heading = document.createElement('h1');
  heading.textContent = 'GIF Search';
  container.appendChild(heading);

  container.appendChild(renderSearchBox(callbacks));

  const fetchBtn = document.createElement('button');
  fetchBtn.textContent = 'Random GIF';
  fetchBtn.className = 'btn btn--secondary';
  fetchBtn.addEventListener('click', () => callbacks.onFetchRandom());
  container.appendChild(fetchBtn);

  const imageArea = document.createElement('div');
  imageArea.className = 'image-area';
  imageArea.id = 'image-area';
  container.appendChild(imageArea);

  appRoot.appendChild(container);
}

function renderSearchBox(callbacks) {
  const form = document.createElement('form');
  form.className = 'search-form';

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Search GIFs...';
  input.className = 'search-form__input';
  input.name = 'query';

  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.textContent = 'Search';
  submitBtn.className = 'btn btn--primary';

  form.appendChild(input);
  form.appendChild(submitBtn);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = input.value.trim();
    if (!query) return;
    callbacks.onSearch(query);
  });

  return form;
}

function showLoading() {
  const imageArea = document.getElementById('image-area');
  imageArea.innerHTML = '<p class="status-text">Loading...</p>';
}

function showGif(gifData) {
  const imageArea = document.getElementById('image-area');
  imageArea.innerHTML = '';

  const img = document.createElement('img');
  img.src = gifData.images.original.url;
  img.alt = gifData.title || 'GIF';
  img.className = 'gif-image';

  imageArea.appendChild(img);
}

function showGifGrid(gifDataArray) {
  const imageArea = document.getElementById('image-area');
  imageArea.innerHTML = '';

  if (gifDataArray.length === 0) {
    imageArea.innerHTML = '<p class="status-text">No results found. Try another search.</p>';
    return;
  }

  const grid = document.createElement('div');
  grid.className = 'gif-grid';

  gifDataArray.forEach((gifData) => {
    const img = document.createElement('img');
    img.src = gifData.images.fixed_width.url;
    img.alt = gifData.title || 'GIF';
    img.className = 'gif-grid__image';
    grid.appendChild(img);
  });

  imageArea.appendChild(grid);
}

function showError(message) {
  const imageArea = document.getElementById('image-area');
  imageArea.innerHTML = `<p class="status-text status-text--error">${message}</p>`;
}

export { render, showLoading, showGif, showGifGrid, showError };
