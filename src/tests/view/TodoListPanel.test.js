import { TodoListPanel } from '../../view/TodoListPanel';
import { TodoListPanelController } from '../../controller/TodoListPanelController';
import { EventTypes } from '../../utils/eventTypes';
import { SortableHandler } from '../../utils/SortableHandler';
import { SidebarHandler } from '../../utils/SidebarHandler';
import { SearchHandler } from '../../utils/SearchHandler';
import { showToast } from '../../utils/toast';
import { ToastTypes } from '../../utils/toastTypes';
import { setCursorToEnd } from '../../utils/setCursorToEnd';

// Mock necessary utilities and controller to isolate tests
jest.mock('../../utils/SortableHandler');
jest.mock('../../utils/SidebarHandler');
jest.mock('../../utils/SearchHandler');
jest.mock('../../controller/TodoListPanelController');
jest.mock('../../utils/toast');
jest.mock('../../utils/setCursorToEnd');

// Setup mock for the controller with default method implementations
jest.mock('../../controller/TodoListPanelController', () => ({
  TodoListPanelController: jest.fn().mockImplementation(() => ({
    addObserver: jest.fn(),
    getLists: jest.fn().mockReturnValue([]),
    addList: jest.fn(),
    updateListName: jest.fn(),
    deleteList: jest.fn(),
    toggleListCompletion: jest.fn(),
    reorderLists: jest.fn(),
    getCurrentListId: jest.fn().mockReturnValue('1'),
    changeCurrentList: jest.fn(),
  }))
}));

// Setup the testing DOM environment before each test
function setupDocumentBody() {
  document.body.innerHTML = `
  <form id="first-list-form"></form>
  <form id="list-form"></form>
  <div id="todo-lists-container"></div>
`;
}

describe('TodoListPanel', () => {
  let view, controller;

  beforeEach(() => {
    // Setup DOM and mock instances before each test
    setupDocumentBody();
    controller = new TodoListPanelController();
    view = new TodoListPanel(controller);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test cacheDomElements method
  it('should cache DOM elements correctly', () => {
    expect(view.firstListForm).toBeInstanceOf(HTMLElement);
    expect(view.listForm).toBeInstanceOf(HTMLElement);
    expect(view.listContainer).toBeInstanceOf(HTMLElement);
  });

  // Test setupEventListeners method
  describe('Event Listeners Setup', () => {
    it('should attach submit event listeners to forms correctly', () => {
      const handleAddListSpy = jest.spyOn(view, 'handleAddList').mockImplementation(() => { });

      // Dispatch submit events to both forms
      const submitEvent1 = new Event('submit');
      view.firstListForm.dispatchEvent(submitEvent1);
      const submitEvent2 = new Event('submit');
      view.listForm.dispatchEvent(submitEvent2);

      expect(handleAddListSpy).toHaveBeenCalledTimes(2);
    });

    it('should attach click event listener to list container correctly', () => {
      const mockEvent = new MouseEvent('click');
      const handleListActionsSpy = jest.spyOn(view, 'handleListActions').mockImplementation(() => { });

      view.listContainer.dispatchEvent(mockEvent);
      expect(handleListActionsSpy).toHaveBeenCalled();
    });

    it('should attach change event listener to list container correctly', () => {
      const mockEvent = new Event('change');
      const handleListChangeSpy = jest.spyOn(view, 'handleListChange').mockImplementation(() => { });

      view.listContainer.dispatchEvent(mockEvent);
      expect(handleListChangeSpy).toHaveBeenCalled();
    });
  });

  // Test setupSortable method
  it('should setup sortable functionality', () => {
    let mockSortableHandlerCallback;
    SortableHandler.mockImplementation((container, handle, callback) => {
      mockSortableHandlerCallback = callback;
    });

    view.setupSortable();
    jest.spyOn(view, 'updateModelOrder');
    if (mockSortableHandlerCallback) {
      mockSortableHandlerCallback();
    }

    expect(SortableHandler).toHaveBeenCalledWith(
      view.listContainer, '.drag-btn', expect.any(Function)
    );
    expect(view.updateModelOrder).toHaveBeenCalled();
  });

  // Test update method
  describe('update method', () => {
    it('should call render when event type is UPDATE_LIST', () => {
      jest.spyOn(view, 'render');
      const event = { eventType: EventTypes.UPDATE_LIST };
      view.update(event);
      expect(view.render).toHaveBeenCalled();
    });

    it('should call setActiveList when event type is LIST_CHANGED', () => {
      jest.spyOn(view, 'setActiveList');
      const event = { eventType: EventTypes.LIST_CHANGED };
      view.update(event);
      expect(view.setActiveList).toHaveBeenCalled();
    });

    it('should call displayError with the correct message when event type is ERROR_LIST', () => {
      jest.spyOn(view, 'displayError');
      const message = "An error occurred";
      const event = { eventType: EventTypes.ERROR_LIST, message: message };
      view.update(event);
      expect(view.displayError).toHaveBeenCalledWith(message);
    });
  });

  // Test handleAddList method
  it('should handle add list correctly', () => {
    const preventDefault = jest.fn();
    const mockEvent = { preventDefault };
    document.body.innerHTML += `<input id="new-list-input" value="New List" />`;
    view.listForm = document.getElementById("list-form");

    view.handleAddList(mockEvent, "new-list-input");

    expect(preventDefault).toHaveBeenCalled();
    expect(controller.addList).toHaveBeenCalledWith('New List');
  });

  // Test handleListActions method
  describe('handleListActions', () => {
    let listItem, editButton, listItemLabel;

    beforeEach(() => {
      document.body.innerHTML = `
        <li data-list-id="1">
          <button class="edit-list-btn"></button>
          <button class="delete-list-btn"></button>
          <div class="todo-list-text">Old List Name</div>
        </li>
      `;
      listItem = document.querySelector('li');
      editButton = listItem.querySelector('.edit-list-btn');
      listItemLabel = listItem.querySelector('.todo-list-text');
    });

    // Test editList method
    it('should handle edit list button click and update list name on blur', () => {

      jest.spyOn(view, 'editList');
      view.handleListActions({ target: editButton });

      expect(view.editList).toHaveBeenCalledWith(editButton);

      listItemLabel.textContent = 'New List Name';
      listItemLabel.contentEditable = "true";
      listItemLabel.dispatchEvent(new FocusEvent('blur'));

      expect(controller.updateListName).toHaveBeenCalledWith('1', 'New List Name');
    });

    it('should prevent default click action on label during edit', () => {
      // Trigger the edit to set up the editable state
      const editButton = listItem.querySelector('.edit-list-btn');
      view.editList(editButton);

      const clickEvent = new MouseEvent('click', { cancelable: true });
      const preventDefaultSpy = jest.fn();
      clickEvent.preventDefault = preventDefaultSpy;

      listItemLabel.dispatchEvent(clickEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    // Test deleteList method
    it('should handle delete list button click', () => {
      const deleteButton = listItem.querySelector('.delete-list-btn');

      const deleteSpy = jest.spyOn(view, 'deleteList');
      view.handleListActions({ target: deleteButton });

      expect(deleteSpy).toHaveBeenCalledWith(deleteButton);
      expect(controller.deleteList).toHaveBeenCalledWith(listItem.dataset.listId);
    });

    // Test selectList method
    it('should handle list item label click and invoke selectList with correct element', () => {
      const listItemLabel = listItem.querySelector('.todo-list-text');
      const selectListSpy = jest.spyOn(view, 'selectList');

      view.handleListActions({ target: listItemLabel });
      expect(selectListSpy).toHaveBeenCalledWith(listItemLabel);

      const expectedListId = listItem.dataset.listId;
      expect(view.controller.changeCurrentList).toHaveBeenCalledWith(expectedListId);
    });

    it('should not perform any action if event target is not related', () => {
      jest.spyOn(view, 'editList');
      jest.spyOn(view, 'deleteList');
      jest.spyOn(view, 'selectList');

      const unrelatedEvent = { target: document.createElement('span') };
      view.handleListActions(unrelatedEvent);

      expect(view.editList).not.toHaveBeenCalled();
      expect(view.deleteList).not.toHaveBeenCalled();
      expect(view.selectList).not.toHaveBeenCalled();
    });
  });

  // Test handleListChange method
  it('should handle list change events correctly', () => {
    const listItem = document.createElement('li');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    listItem.appendChild(checkbox);
    view.listContainer.appendChild(listItem);
    checkbox.dispatchEvent(new Event('change', { bubbles: true }));

    expect(controller.toggleListCompletion).toHaveBeenCalledWith(listItem.dataset.listId);
  });

  // Test handleListChange method for non-checkbox elements
  it('should not toggle completion for non-checkbox elements', () => {
    const listItem = document.createElement('li');
    const nonCheckboxInput = document.createElement('input');
    nonCheckboxInput.type = 'text';
    listItem.appendChild(nonCheckboxInput);
    view.listContainer.appendChild(listItem);

    const changeEvent = new Event('change', { bubbles: true });
    nonCheckboxInput.dispatchEvent(changeEvent);

    expect(controller.toggleListCompletion).not.toHaveBeenCalled();
  });

  // Test updateModelOrder method
  it('should update model order after drag-and-drop operation', () => {
    document.body.innerHTML = `
    <div id="todo-lists-container">
      <div data-list-id="1"></div>
      <div data-list-id="2"></div>
      <div data-list-id="3"></div>
    </div>
  `;
    view.listContainer = document.getElementById('todo-lists-container');

    const arrayFromSpy = jest.spyOn(Array, 'from');
    view.updateModelOrder();
    expect(arrayFromSpy).toHaveBeenCalled();

    const calls = arrayFromSpy.mock.calls;
    const firstCallArgs = calls[0][0]; // Get the first call's first argument
    const mappedIds = Array.from(firstCallArgs).map(item => item.dataset.listId);

    expect(mappedIds).toEqual(['1', '2', '3']);
    expect(controller.reorderLists).toHaveBeenCalledWith(['1', '2', '3']);
  });


  // Test setActiveList method
  it('should switch active list items correctly', () => {
    const initialActiveId = '1';
    const newActiveId = '2';
    controller.getCurrentListId = jest.fn(() => newActiveId);

    const initialActiveItem = document.createElement('li');
    initialActiveItem.dataset.listId = initialActiveId;
    initialActiveItem.classList.add('active');  // Mark as initially active
    view.listContainer.appendChild(initialActiveItem);

    // New item to become active
    const newActiveItem = document.createElement('li');
    newActiveItem.dataset.listId = newActiveId;
    view.listContainer.appendChild(newActiveItem);

    // Set initial active item on the view
    view.activeListItem = initialActiveItem;

    // Call setActiveList which should update the active item
    view.setActiveList();

    // Check that the initial active item is no longer active
    expect(initialActiveItem.classList.contains('active')).toBeFalsy();
    // Check that the new item has become active
    expect(newActiveItem.classList.contains('active')).toBeTruthy();
    // Ensure the view's activeListItem reference has been updated
    expect(view.activeListItem).toBe(newActiveItem);
  });

  // Test render method
  it('render should clear and repopulate todo list and set active list', () => {
    const activeListId = '1';
    controller.getCurrentListId = jest.fn().mockReturnValue(activeListId);
    controller.getLists = jest.fn().mockReturnValue([
      { id: '1', name: 'List One' },
      { id: '2', name: 'List Two' }
    ]);

    const appendChildSpy = jest.spyOn(view.listContainer, 'appendChild');
    view.render();

    expect(controller.getLists).toHaveBeenCalled();
    expect(appendChildSpy).toHaveBeenCalledTimes(2);
    
    const addedItems = Array.from(view.listContainer.children);
    const activeItem = addedItems.find(item => item.dataset.listId === activeListId);
    expect(activeItem.classList.contains('active')).toBeTruthy();
  });

  // Test displayError method
  it('should display an error message', () => {
    const message = "Error loading lists";
    jest.spyOn(showToast, 'mockImplementation');

    view.displayError(message);

    expect(showToast).toHaveBeenCalledWith(message, ToastTypes.ERROR);
  });
});
