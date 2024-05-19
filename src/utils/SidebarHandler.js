export class SidebarHandler {
  constructor() {
    this.sidebar = document.querySelector("#sidebar");
    this.sidebarContent = document.querySelector("#sidebar-content");
    this.mainContainer = document.querySelector("#main-container");
    this.toggleBtn = document.querySelector("#toggle-sidebar-btn");
    this.init();
  }

  init() {
    this.toggleBtn.addEventListener('click', () => {
      this.toggleSidebar();
    });
  }

  toggleSidebar() {
    const isCollapsed = this.sidebar.classList.toggle('collapsed');
    this.sidebarContent.style.visibility = isCollapsed ? 'hidden' : 'visible';
    this.toggleBtn.setAttribute('aria-expanded', !isCollapsed);

    if (!isCollapsed && window.innerWidth <= 768) {
      this.mainContainer.classList.add('active-overlay');
    } else {
      this.mainContainer.classList.remove('active-overlay');
    }
    this.updateToggleIcon(isCollapsed);
  }

  updateToggleIcon(isCollapsed) {
    if (isCollapsed) {
      this.toggleBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg>';
    } else {
      this.toggleBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>';
    }
  }
}


