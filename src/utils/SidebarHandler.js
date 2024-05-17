// export class SidebarHandler {
//   constructor() {
//     this.sidebar = document.querySelector("#sidebar");
//     this.toggleBtn = document.querySelector("#toggle-sidebar-btn");
//     this.body = document.body;
//     this.init();
//   }

//   init() {
//     this.toggleBtn.addEventListener('click', () => {
//       sidebar.classList.toggle('active');
  
//       if (this.sidebar.classList.contains('active')) {
//         this.toggleBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>';
//       } else {
//         this.toggleBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg>';
//       }
//     });
//   }
// }
export class SidebarHandler {
  constructor() {
    this.sidebar = document.querySelector("#sidebar");
    this.mainContainer = document.querySelector("#main-container"); // Referencja do głównego kontenera
    this.toggleBtn = document.querySelector("#toggle-sidebar-btn");
    this.init();
  }

  init() {
    this.toggleBtn.addEventListener('click', () => {
      this.toggleSidebar();
    });
  }

  toggleSidebar() {
    this.sidebar.classList.toggle('collapsed');
    if (!this.sidebar.classList.contains('collapsed') && window.innerWidth <= 768) {
      // Dodanie efektu przyciemnienia tylko w trybie mobilnym
      this.mainContainer.classList.add('active-overlay');
    } else {
      // Usunięcie efektu przyciemnienia
      this.mainContainer.classList.remove('active-overlay');
    }
    this.updateToggleIcon();
  }

  updateToggleIcon() {
    // Zaktualizuj ikonę w zależności od stanu sidebara
    if (this.sidebar.classList.contains('collapsed')) {
      this.toggleBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg>';
    } else {
      this.toggleBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>';
    }
  }
}
