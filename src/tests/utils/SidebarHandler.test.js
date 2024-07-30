import { SidebarHandler } from '../../utils/SidebarHandler';

describe('SidebarHandler', () => {
  let sidebar, toggleBtn, mainContainer;

  beforeEach(() => {
    document.body.innerHTML = `
      <nav id="sidebar" class="sidebar collapsed">
        <button id="toggle-sidebar-btn" aria-expanded="false"></button>
        <div id="main-container"></div>
      </nav>
    `;

    sidebar = document.querySelector("#sidebar");
    toggleBtn = document.querySelector("#toggle-sidebar-btn");
    mainContainer = document.querySelector("#main-container");

    new SidebarHandler(); // Create an instance to setup event listeners and initial state
  });

  afterEach(() => {
    document.body.innerHTML = ''; // Clear the DOM to ensure no side effects between tests
  });

  // Test the constructor method
  it('Test constructor method - should initialize with the sidebar, toggle button, and main container', () => {
    const sidebarHandler = new SidebarHandler();
    expect(sidebarHandler.sidebar).toBe(sidebar);
    expect(sidebarHandler.toggleBtn).toBe(toggleBtn);
    expect(sidebarHandler.mainContainer).toBe(mainContainer);
  });

  // Test the init method
  it('Test init method - should attach click event listener to toggle button', () => {
    const clickSpy = jest.spyOn(SidebarHandler.prototype, 'toggleSidebar');
    toggleBtn.click(); // Simulate click
    expect(clickSpy).toHaveBeenCalled();
    clickSpy.mockRestore();
  });

  // Test the toggleSidebar method
  it('Test toggleSidebar method - should toggle the sidebar visibility and set aria-expanded attribute', () => {
    toggleBtn.click(); // First click should expand the sidebar
    expect(sidebar.classList.contains('collapsed')).toBe(false);
    expect(toggleBtn.getAttribute('aria-expanded')).toBe('true');

    toggleBtn.click(); // Second click should collapse the sidebar
    expect(sidebar.classList.contains('collapsed')).toBe(true);
    expect(toggleBtn.getAttribute('aria-expanded')).toBe('false');
  });

  // Test the updateToggleIcon method
  it('Test updateToggleIcon method - should change the icon depending on the sidebar state', () => {
    toggleBtn.click(); // Toggle to collapsed
    expect(toggleBtn.innerHTML).toContain('<svg'); // Check if SVG markup for collapsed state is present

    toggleBtn.click(); // Toggle to expanded
    expect(toggleBtn.innerHTML).toContain('<svg'); // Check if SVG markup for expanded state is present
  });

  // Test the responsiveness of the overlay
  it('should add or remove the active-overlay class based on the window width and sidebar state', () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 500 });
    toggleBtn.click(); // Expand the sidebar at a width that should trigger the overlay
    expect(mainContainer.classList.contains('active-overlay')).toBe(true);

    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 769 });
    toggleBtn.click(); // Collapse the sidebar at a width that should remove the overlay
    expect(mainContainer.classList.contains('active-overlay')).toBe(false);
  });
});