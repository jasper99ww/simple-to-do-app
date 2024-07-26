import { DarkModeHandler } from '../../utils/DarkModeHandler';

describe('DarkModeHandler', () => {
  let darkModeHandler;
  let matchMediaMock;

  beforeEach(() => {
    // Setup the HTML structure for the test
    document.body.innerHTML = `<input type="checkbox" id="darkmode-checkbox">`;
    // Mock window.matchMedia to simulate system preference for dark mode
    matchMediaMock = jest.fn().mockImplementation(query => ({
      matches: query.includes('dark')
    }));
    window.matchMedia = matchMediaMock;

    // Mock local storage to initially return no user preference
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn().mockReturnValue(null),
        setItem: jest.fn()
      },
      configurable: true
    });

    // Instantiate DarkModeHandler to be tested
    darkModeHandler = new DarkModeHandler();
  });

  afterEach(() => {
    // Restore all mocks to clean state for other tests
    jest.restoreAllMocks();
  });

  // Test the checkSystemPreference method for handling system preferences
  it('should check system preference and set dark mode accordingly', () => {
    expect(window.matchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
    expect(darkModeHandler.darkModeCheckbox.checked).toBe(true);
  });

  // Test the checkSystemPreference method for using stored user preferences
  it('should use user preference if available', () => {
    // Mock returning user preference for dark mode as false
    window.localStorage.getItem.mockReturnValue("false");

    // Re-instantiate handler to use the new mock value
    darkModeHandler = new DarkModeHandler();

    expect(darkModeHandler.darkModeCheckbox.checked).toBe(false);
    expect(darkModeHandler.loadPreference()).toBe(false);
  });

  // Test the toggleDarkMode and savePreference methods when the checkbox is changed
  it('should toggle dark mode and save preference when checkbox changes', () => {
    // Setup spies to observe methods being called
    const spyToggleDarkMode = jest.spyOn(darkModeHandler, 'toggleDarkMode');
    const spySavePreference = jest.spyOn(darkModeHandler, 'savePreference');

    // Simulate user changing the checkbox state
    darkModeHandler.darkModeCheckbox.checked = true;
    darkModeHandler.darkModeCheckbox.dispatchEvent(new Event('change'));

    // Verify methods were called with correct parameters
    expect(spyToggleDarkMode).toHaveBeenCalledWith(true);
    expect(spySavePreference).toHaveBeenCalled();
    expect(localStorage.setItem).toHaveBeenCalledWith('darkMode', true);
  });

  // Test the toggleDarkMode method for UI updates based on checkbox status
  it('should update the dark mode based on the checkbox status', () => {
    // Force a change and test the toggle functionality
    darkModeHandler.darkModeCheckbox.checked = false;
    darkModeHandler.darkModeCheckbox.dispatchEvent(new Event('change'));

    // Verify changes to the UI and local storage
    expect(document.body.classList.contains('dark')).toBe(false);
    expect(localStorage.setItem).toHaveBeenCalledWith('darkMode', false);
  });

  // Test the initialization process with conflicting system and user preferences
  it('should properly initialize based on stored user preferences overriding system preferences', () => {
    // Set up system and user preferences that contradict each other
    window.localStorage.getItem.mockReturnValue("true");
    matchMediaMock.mockImplementation(() => ({ matches: false }));

    // Re-initialize the handler to pick up the new mock settings
    darkModeHandler = new DarkModeHandler();

    // Check that the user preference took precedence
    expect(darkModeHandler.darkModeCheckbox.checked).toBe(true);
    expect(document.body.classList.contains('dark')).toBe(true);
  });
});
