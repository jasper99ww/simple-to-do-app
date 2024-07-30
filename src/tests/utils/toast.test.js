import { showToast } from '../../utils/toast'; 

describe('showToast', () => {
  let toast;

  beforeEach(() => {
    // Set up a mock toast element
    toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);

    // Clear all mocks and timers before each test
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  afterEach(() => {
    // Clean up the toast element from the DOM
    document.body.removeChild(toast);
  });

  it('should display a toast with the correct message and type', () => {
    // Call the function to test
    showToast('Test message', 'success');

    // Check if the toast element's class and innerText are updated correctly
    expect(toast.className).toBe('show success');
    expect(toast.innerText).toBe('Test message');
  });

  it('should remove the "show" class after 3 seconds', () => {
    jest.useFakeTimers();
    showToast('Test message', 'success');
  
    // Check the initial state
    expect(toast.className).toBe('show success');
  
    // Fast-forward until all timers have been executed
    jest.advanceTimersByTime(3000);
  
    // Check if the "show" class is removed after 3 seconds
    expect(toast.className).toBe('success');
  
    jest.useRealTimers();
  });
});
