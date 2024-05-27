export class DarkModeHandler {
  constructor() {
    this.darkModeCheckbox = document.getElementById('darkmode-checkbox');
    this.init();
  }

  init() {
    this.checkSystemPreference();
    this.darkModeCheckbox.addEventListener('change', () => {
      this.toggleDarkMode(this.darkModeCheckbox.checked);
      this.savePreference();
    });
  }

  checkSystemPreference() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const userPreference = this.loadPreference();
    const isDarkMode = userPreference === null ? prefersDark : userPreference;
    this.setDarkMode(isDarkMode);
  }

  setDarkMode(isDark) {
    this.darkModeCheckbox.checked = isDark;
    this.toggleDarkMode(isDark);
  }

  savePreference() {
    localStorage.setItem('darkMode', this.darkModeCheckbox.checked);
  }

  loadPreference() {
    return JSON.parse(localStorage.getItem('darkMode'));
  }

  toggleDarkMode(shouldAddDark) {
    document.body.classList.toggle('dark', shouldAddDark);
  }
}
