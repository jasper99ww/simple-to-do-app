import searchIcon from '../assets/icons/search.svg';
import closeIcon from '../assets/icons/close.svg';

export class SearchHandler {
  constructor(onSearch) {
      this.searchInput = document.getElementById("search-list-input");
      this.searchButton = document.getElementById("search-list-btn");
      this.onSearch = onSearch;
      this.currentIcon = null;

      if (this.searchInput && this.searchButton) {
          this.setupEventListeners();
      } else {
          console.error("SearchHandler: Required DOM elements are not available.");
      }
  }

  setupEventListeners() {
      this.searchInput.addEventListener('input', (e) => this.handleSearch(e));
      this.searchButton.addEventListener('click', (e) => this.handleReset(e));
  }

  handleSearch(e) {
    const query = this.searchInput.value.toLowerCase();
    this.onSearch(query);  
    this.updateSearchIcon();
  }

  handleReset(e) {
    e.preventDefault();
    this.searchInput.value = '';
    this.onSearch('');
    this.updateSearchIcon();
  }

  updateSearchIcon() {
    const newIcon = this.searchInput.value.length > 0 ? closeIcon : searchIcon;
    const tooltipText = this.searchInput.value.length > 0 ? 'Clear search' : 'Click to search';

    if (this.currentIcon !== newIcon) {
      this.searchButton.innerHTML = newIcon;
      this.searchButton.setAttribute('data-tooltip', tooltipText);
      this.currentIcon = newIcon;
    }
  }
}
