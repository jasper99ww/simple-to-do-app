export class DarkModeHandler {
  constructor() {
    this.darkModeCheckbox = document.getElementById('darkmode-checkbox');
    this.init();
  }

  init() {
    this.darkModeCheckbox.addEventListener('change', () => {
      this.toggleDarkMode();
    });
  }

 toggleDarkMode() {
    // Pomocnicza funkcja do dodawania/usuwanie klasy 'dark'
    const toggleClass = (selector, className) => {
      document.querySelectorAll(selector).forEach(element => {
        element.classList.toggle(className);
      });
    };

    // Zmiana klas dla głównych komponentów
    toggleClass('body, #main-container, #sidebar', 'dark');

    // Dodatkowo zmienia klasę dla wszystkich elementów listy
    toggleClass('.list-item, .todo', 'dark');
  }
}
