export class SearchHandler {
  constructor(onSearch) {
      this.searchInput = document.getElementById("search-list-input");
      this.searchButton = document.getElementById("search-list-btn");
      this.onSearch = onSearch;

      if (this.searchInput && this.searchButton) {
          this.setupEventListeners();
      } else {
          console.error("SearchHandler: Required DOM elements are not available.");
      }
  }

  setupEventListeners() {
      this.searchButton.addEventListener('click', (e) => this.handleSearch(e));
      this.searchInput.addEventListener('input', () => this.handleSearch());
  }

  handleSearch(e) {
      if (e) e.preventDefault();
      const query = this.searchInput.value.toLowerCase();
      this.onSearch(query);
  }
}
