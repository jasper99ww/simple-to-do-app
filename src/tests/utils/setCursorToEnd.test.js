// Import the function to test
import { setCursorToEnd } from '../../utils/setCursorToEnd';

describe('setCursorToEnd', () => {
  let selection;
  let range;

  beforeEach(() => {
    // Create a mock for window.getSelection()
    selection = {
      removeAllRanges: jest.fn(),
      addRange: jest.fn(),
    };
    window.getSelection = jest.fn().mockReturnValue(selection);

    // Create a mock for document.createRange()
    range = {
      selectNodeContents: jest.fn(),
      collapse: jest.fn(),
    };
    document.createRange = jest.fn().mockReturnValue(range);
  });

  it('should set the cursor to the end of the element', () => {
    // Create a mock element with some content
    const element = document.createElement('div');
    element.textContent = 'Hello, world!';

    // Spy on the element's focus method
    const focusSpy = jest.spyOn(element, 'focus');

    // Call the function to test
    setCursorToEnd(element);

    // Verify that the range methods were called correctly
    expect(range.selectNodeContents).toHaveBeenCalledWith(element);
    expect(range.collapse).toHaveBeenCalledWith(false);
    expect(selection.removeAllRanges).toHaveBeenCalled();
    expect(selection.addRange).toHaveBeenCalledWith(range);
    expect(focusSpy).toHaveBeenCalled(); // Verify that the focus method was called
  });

  it('should set the cursor to the end of an empty element', () => {
    // Create a mock element with no content
    const element = document.createElement('div');

    // Spy on the element's focus method
    const focusSpy = jest.spyOn(element, 'focus');

    // Call the function to test
    setCursorToEnd(element);

    // Verify that the range methods were called correctly
    expect(range.selectNodeContents).toHaveBeenCalledWith(element);
    expect(range.collapse).toHaveBeenCalledWith(false);
    expect(selection.removeAllRanges).toHaveBeenCalled();
    expect(selection.addRange).toHaveBeenCalledWith(range);
    expect(focusSpy).toHaveBeenCalled(); // Verify that the focus method was called
  });
});
