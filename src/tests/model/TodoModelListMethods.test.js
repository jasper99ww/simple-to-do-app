import { TodoModel } from '../../model/TodoModel.js';
import { ListService } from '../../service/ListService.js';
import { ObserverManager } from '../../service/ObserverManager.js';
import { EventTypes } from '../../utils/eventTypes.js';

jest.mock('../../service/ListService.js');
jest.mock('../../service/ObserverManager.js');

describe('TodoModel - List Methods', () => {
  let model;
  let listServiceMock;
  let observerManagerMock;

  beforeEach(() => {
    listServiceMock = new ListService();
    observerManagerMock = new ObserverManager();
    jest.clearAllMocks();
    model = new TodoModel(listServiceMock, {}, observerManagerMock);
    jest.spyOn(model, 'setCurrentListId');
    jest.spyOn(model, 'checkListsExistence');
  });
  // Test addList functionality
  test('addList should notify and update UI when successful', () => {
    const newListId = '123';
    listServiceMock.addList.mockReturnValue({ success: true, listId: newListId });
    listServiceMock.checkListsExistence.mockReturnValue({ success: true, updateUI: true })

    model.addList("New List");

    expect(listServiceMock.addList).toHaveBeenCalledWith("New List");
    expect(model.setCurrentListId).toHaveBeenCalledWith(newListId);

    expect(observerManagerMock.notifyObservers).toHaveBeenNthCalledWith(1, { eventType: EventTypes.LIST_CHANGED });
    expect(observerManagerMock.notifyObservers).toHaveBeenNthCalledWith(2, { eventType: EventTypes.UPDATE_TODO });
    expect(observerManagerMock.notifyObservers).toHaveBeenNthCalledWith(3, { eventType: EventTypes.UPDATE_LIST });
    expect(observerManagerMock.notifyObservers).toHaveBeenNthCalledWith(4, { eventType: EventTypes.LISTS_EXIST });
    expect(model.checkListsExistence).toHaveBeenCalled();
  });

  test('addList should handle failure and notify error', () => {
    listServiceMock.addList.mockReturnValue({ success: false, error: EventTypes.ERROR_LIST, message: "Failed to add list" });
    model.addList("New List");
    expect(observerManagerMock.notifyObservers).toHaveBeenCalledWith({ eventType: EventTypes.ERROR_LIST, message: "Failed to add list" });
  });

  // Test getLists method
  test('getLists should retrieve lists correctly', () => {
    listServiceMock.getLists.mockReturnValue([{
      id: 1,
      name: "Test List",
      todos: [],
      completed: false
    }]);
    const lists = model.getLists();
    expect(lists).toEqual([{
      id: 1,
      name: "Test List",
      todos: [],
      completed: false
    }]);
  });

  test('getLists should handle an empty list correctly', () => {
    listServiceMock.getLists.mockReturnValue([]);
    const lists = model.getLists();
    expect(lists).toEqual([]);
  });

  test('getLists should filter lists by name correctly', () => {
    const filteredLists = [
      { id: 1, name: 'Test List', todos: [], completed: false }
    ];
    listServiceMock.getLists.mockReturnValue(filteredLists);

    const lists = model.getLists('Test');
    expect(listServiceMock.getLists).toHaveBeenCalledWith('Test');
    expect(lists).toEqual(filteredLists);
  });

  // Test setCurrentListId method
  test('setCurrentListId should not update listId if the current listId is the same', () => {
    model._currentListId = '123';

    model.setCurrentListId('123');

    expect(listServiceMock.saveCurrentListId).not.toHaveBeenCalled();
    expect(observerManagerMock.notifyObservers).not.toHaveBeenCalled();
  });

  // Test getCurrentList method
  test('getCurrentList should return the list when successful', () => {
    const list = { id: 1, name: 'Test List', todos: [], completed: false };
    listServiceMock.getList.mockReturnValue({ success: true, list });

    const result = model.getCurrentList();
    expect(result).toEqual(list);
    expect(listServiceMock.getList).toHaveBeenCalledWith(model.getCurrentListId());
  });

  test('getCurrentList should notify observers on error', () => {
    listServiceMock.getList.mockReturnValue({ success: false, error: EventTypes.ERROR_LIST, message: 'Error fetching list' });

    const result = model.getCurrentList();
    expect(result).toBeUndefined();
    expect(observerManagerMock.notifyObservers).toHaveBeenCalledWith({ eventType: EventTypes.ERROR_LIST, message: 'Error fetching list' });
  });

  // Test getCurrentListName method
  test('getCurrentListName should return the list name when successful', () => {
    const listName = 'Test List';
    listServiceMock.getCurrentListName.mockReturnValue({ success: true, listName });

    const result = model.getCurrentListName();
    expect(result).toEqual(listName);
    expect(listServiceMock.getCurrentListName).toHaveBeenCalled();
  });

  test('getCurrentListName should notify observers on error', () => {
    listServiceMock.getCurrentListName.mockReturnValue({ success: false, error: EventTypes.ERROR_LIST, message: 'Error fetching list name' });

    const result = model.getCurrentListName();
    expect(result).toBeUndefined();
    expect(observerManagerMock.notifyObservers).toHaveBeenCalledWith({ eventType: EventTypes.ERROR_LIST, message: 'Error fetching list name' });
  });

  // Test updateListName method
  test('updateListName should notify on success', () => {
    listServiceMock.updateListName.mockReturnValue({ success: true });
    model.updateListName('123', 'Updated Name');
    expect(observerManagerMock.notifyObservers).toHaveBeenCalledWith({ eventType: EventTypes.UPDATE_LIST });
    expect(observerManagerMock.notifyObservers).toHaveBeenCalledWith({ eventType: EventTypes.LIST_CHANGED });
  });

  test('updateListName should notify error on failure', () => {
    listServiceMock.updateListName.mockReturnValue({ success: false, error: EventTypes.ERROR_LIST, message: "Error updating name" });
    model.updateListName('123', 'Updated Name');
    expect(observerManagerMock.notifyObservers).toHaveBeenCalledWith({ eventType: EventTypes.ERROR_LIST, message: "Error updating name" });
  });

  // Test deleteList method
  test('deleteList should handle deletion and update previous list id when successful', () => {
    listServiceMock.deleteList.mockReturnValue({ success: true, previousListId: '122' });
    listServiceMock.checkListsExistence.mockReturnValue({ success: true, updateUI: true });

    model.deleteList('123');

    expect(listServiceMock.deleteList).toHaveBeenCalledWith('123');
    expect(model.setCurrentListId).toHaveBeenCalledWith('122');
    expect(observerManagerMock.notifyObservers).toHaveBeenCalledWith({ eventType: EventTypes.UPDATE_LIST });
    expect(observerManagerMock.notifyObservers).toHaveBeenCalledWith({ eventType: EventTypes.UPDATE_TODO });
    expect(observerManagerMock.notifyObservers).toHaveBeenCalledWith({ eventType: EventTypes.LISTS_EXIST });
    expect(model.checkListsExistence).toHaveBeenCalled();
  });

  test('deleteList should handle deletion without updating previous list id when successful', () => {
    listServiceMock.deleteList.mockReturnValue({ success: true, previousListId: null });
    listServiceMock.checkListsExistence.mockReturnValue({ success: true, updateUI: true });

    model.deleteList('123');

    expect(listServiceMock.deleteList).toHaveBeenCalledWith('123');
    expect(model.setCurrentListId).not.toHaveBeenCalled();
    expect(observerManagerMock.notifyObservers).toHaveBeenCalledWith({ eventType: EventTypes.UPDATE_LIST });
    expect(observerManagerMock.notifyObservers).toHaveBeenCalledWith({ eventType: EventTypes.UPDATE_TODO });
    expect(observerManagerMock.notifyObservers).toHaveBeenCalledWith({ eventType: EventTypes.LISTS_EXIST });
    expect(model.checkListsExistence).toHaveBeenCalled();
  });

  test('deleteList should notify observers on error', () => {
    listServiceMock.deleteList.mockReturnValue({ success: false, error: EventTypes.ERROR_LIST, message: "Failed to delete list" });

    model.deleteList('123');

    expect(listServiceMock.deleteList).toHaveBeenCalledWith('123');
    expect(observerManagerMock.notifyObservers).toHaveBeenCalledWith({ eventType: EventTypes.ERROR_LIST, message: "Failed to delete list" });
    expect(model.setCurrentListId).not.toHaveBeenCalled();
  });

  // Test toggleTodoListCompleted method
  test('toggleTodoListCompleted should toggle completion and notify', () => {
    listServiceMock.toggleTodoListCompleted.mockReturnValue({ success: true });
    model.toggleTodoListCompleted('123');
    expect(observerManagerMock.notifyObservers).toHaveBeenCalledWith({ eventType: EventTypes.UPDATE_LIST });
  });

  test('toggleTodoListCompleted should handle failure and notify', () => {
    listServiceMock.toggleTodoListCompleted.mockReturnValue({ success: false, error: EventTypes.ERROR_LIST, message: "Could not toggle completion" });
    model.toggleTodoListCompleted('123');
    expect(observerManagerMock.notifyObservers).toHaveBeenCalledWith({ eventType: EventTypes.ERROR_LIST, message: "Could not toggle completion" });
  });

  test('changeCurrentList should change current list and notify', () => {
    listServiceMock.getList.mockReturnValue({ success: true });
    model.changeCurrentList('124');
    expect(observerManagerMock.notifyObservers).toHaveBeenCalledWith({ eventType: EventTypes.UPDATE_LIST });
    expect(observerManagerMock.notifyObservers).toHaveBeenCalledWith({ eventType: EventTypes.UPDATE_TODO });
  });

  test('changeCurrentList should handle failure and notify', () => {
    listServiceMock.getList.mockReturnValue({ success: false, error: EventTypes.ERROR_LIST, message: "List not found" });
    model.changeCurrentList('124');
    expect(observerManagerMock.notifyObservers).toHaveBeenCalledWith({ eventType: EventTypes.ERROR_LIST, message: "List not found" });
  });

  // Test reorderLists method
  test('reorderLists should reorder and notify', () => {
    listServiceMock.reorderLists.mockReturnValue({ success: true });
    model.reorderLists(['123', '124']);
    expect(observerManagerMock.notifyObservers).toHaveBeenCalledWith({ eventType: EventTypes.UPDATE_LIST });
  });

  test('reorderLists should handle failure and notify', () => {
    listServiceMock.reorderLists.mockReturnValue({ success: false, error: EventTypes.ERROR_LIST, message: "Reordering failed" });
    model.reorderLists(['123', '124']);
    expect(observerManagerMock.notifyObservers).toHaveBeenCalledWith({ eventType: EventTypes.ERROR_LIST, message: "Reordering failed" });
  });

  // Test checkListsExistence method
  test('should notify LISTS_EXIST when there are multiple lists', () => {
    listServiceMock.checkListsExistence.mockReturnValue({ success: true, updateUI: true });
    model.checkListsExistence();

    expect(listServiceMock.checkListsExistence).toHaveBeenCalled();
    expect(observerManagerMock.notifyObservers).toHaveBeenCalledWith({ eventType: EventTypes.LISTS_EXIST });
  });

  test('should notify LISTS_EMPTY when there are no lists', () => {
    listServiceMock.checkListsExistence.mockReturnValue({ success: false, updateUI: true });
    model.checkListsExistence();

    expect(listServiceMock.checkListsExistence).toHaveBeenCalled();
    expect(observerManagerMock.notifyObservers).toHaveBeenCalledWith({ eventType: EventTypes.LISTS_EMPTY });
  });

  test('should not update UI when not required', () => {
    listServiceMock.checkListsExistence.mockReturnValue({ success: true, updateUI: false });
    model.checkListsExistence();

    expect(listServiceMock.checkListsExistence).toHaveBeenCalled();
    expect(observerManagerMock.notifyObservers).not.toHaveBeenCalled();
  });

});