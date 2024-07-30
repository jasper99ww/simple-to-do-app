import { SearchHandler } from "../../utils/SearchHandler";
import searchIcon from '../../assets/icons/search.svg';
import closeIcon from '../../assets/icons/close.svg';

describe('SearchHandler', () => {
  let mockInput, mockButton, onSearchMock, instance;

  beforeEach(() => {
    // Create mocks for DOM elements
    mockInput = document.createElement('input');
    mockInput.id = 'search-list-input';
    document.body.appendChild(mockInput);

    mockButton = document.createElement('button');
    mockButton.id = 'search-list-btn';
    document.body.appendChild(mockButton);

    // Create a mock for the onSearch callback function
    onSearchMock = jest.fn();

    // Initialize SearchHandler
    instance = new SearchHandler(onSearchMock);
  });

  afterEach(() => {
    // Clean up DOM after each test
    document.body.innerHTML = '';
  });

  // Test Constructor method
  it('Test constructor method - should initialize with no errors', () => {
    expect(instance.searchInput).toBe(mockInput);
    expect(instance.searchButton).toBe(mockButton);
    expect(onSearchMock).not.toHaveBeenCalled();
  });

  // Test for console.error if DOM elements are missing
  it('should log an error if required DOM elements are not available', () => {
    document.body.removeChild(mockInput);
    document.body.removeChild(mockButton);

    jest.spyOn(console, 'error');

    // Initialize SearchHandler when elements are missing
    instance = new SearchHandler(onSearchMock);

    expect(console.error).toHaveBeenCalledWith("SearchHandler: Required DOM elements are not available.");

    console.error.mockRestore();
  });


  // Test handleSearch method
  it('Test handleSearch method - should call onSearch with input value on input event', () => {
    // Simulate typing text
    mockInput.value = 'test query';
    mockInput.dispatchEvent(new Event('input'));

    expect(onSearchMock).toHaveBeenCalledWith('test query');
  });

  // Test handleReset method
  it('Test handleReset method - should clear input and call onSearch with empty string on button click', () => {
    // Set value and simulate button click
    mockInput.value = 'test query';
    mockButton.dispatchEvent(new Event('click'));

    expect(mockInput.value).toBe('');
    expect(onSearchMock).toHaveBeenCalledWith('');
  });

  // Test updateSearchIcon method
  it('Test updateSearchIcon method - should update icon and tooltip on input', () => {
    // Simulate typing text
    mockInput.value = 'test';
    mockInput.dispatchEvent(new Event('input'));

    expect(mockButton.innerHTML).toBe(closeIcon);
    expect(mockButton.getAttribute('data-tooltip')).toBe('Clear search');

    // Clear the input and simulate input event again to trigger tooltip update
    mockInput.value = '';
    mockInput.dispatchEvent(new Event('input'));

    setTimeout(() => {
      expect(mockButton.innerHTML).toBe(searchIcon);
      expect(mockButton.getAttribute('data-tooltip')).toBe('Click to search');
      done();
    }, 0);
  });
});
