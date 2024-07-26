import { TodoListPanelController } from '../../controller/TodoListPanelController';
import { TodoAppModel } from '../../model/TodoAppModel';
import { EventTypes } from '../../utils/eventTypes';

jest.mock('../../model/TodoAppModel.js');

describe('TodoListPanelController', () => {
  let controller;
  let modelMock;

  beforeEach(() => {
    modelMock = new TodoAppModel();
    controller = new TodoListPanelController(modelMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test addObserver method
  describe('addObserver', () => {
    it('should call model.addObserver with specific event types', () => {
      const observer = { update: jest.fn() };
      controller.addObserver(observer);
      expect(modelMock.addObserver).toHaveBeenCalledWith(observer, [
        EventTypes.UPDATE_LIST,
        EventTypes.ERROR_LIST,
        EventTypes.LIST_CHANGED
      ]);
    });
  });

  // Test addList method
  describe('addList', () => {
    it('should call model.addList with the provided name', () => {
      const name = "New List";
      controller.addList(name);
      expect(modelMock.addList).toHaveBeenCalledWith(name);
    });
  });

  // Test getLists method
  describe('getLists', () => {
    it('should call model.getLists with optional query', () => {
      const query = "test";
      controller.getLists(query);
      expect(modelMock.getLists).toHaveBeenCalledWith(query);
    });

    it('should call model.getLists without query when not provided', () => {
      controller.getLists();
      expect(modelMock.getLists).toHaveBeenCalledWith('');
    });
  });

  // Test getCurrentListId method
  describe('getCurrentListId', () => {
    it('should return the current list ID from the model', () => {
      modelMock.getCurrentListId.mockReturnValue('123');
      expect(controller.getCurrentListId()).toBe('123');
      expect(modelMock.getCurrentListId).toHaveBeenCalled();
    });
  });

// Test updateListName method
describe('updateListName', () => {
  it('should call model.updateListName with the provided list ID and new name', () => {
    const listId = "123";
    const newName = "Updated Name";
    controller.updateListName(listId, newName);
    expect(modelMock.updateListName).toHaveBeenCalledWith(listId, newName);
  });
});

  // Test deleteList method
  describe('deleteList', () => {
    it('should call model.deleteList with the provided list ID', () => {
      const listId = "123";
      controller.deleteList(listId);
      expect(modelMock.deleteList).toHaveBeenCalledWith(listId);
    });
  });
  
  // Test changeCurrentList method
  describe('changeCurrentList', () => {
    it('should call model.changeCurrentList with the provided list ID', () => {
      const listId = "123";
      controller.changeCurrentList(listId);
      expect(modelMock.changeCurrentList).toHaveBeenCalledWith(listId);
    });
  });

  // Test toggleListCompletion method
  describe('toggleListCompletion', () => {
    it('should call model.toggleTodoListCompleted with the provided list ID', () => {
      const listId = "123";
      controller.toggleListCompletion(listId);
      expect(modelMock.toggleTodoListCompleted).toHaveBeenCalledWith(listId);
    });
  });

  // Test reorderLists method
  describe('reorderLists', () => {
    it('should call model.reorderLists with the new order', () => {
      const newOrder = ["123", "456"];
      controller.reorderLists(newOrder);
      expect(modelMock.reorderLists).toHaveBeenCalledWith(newOrder);
    });
  });
});
