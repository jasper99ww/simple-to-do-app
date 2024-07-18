import { TodoController } from '../../controller/TodoController';
import { TodoModel } from '../../model/TodoModel';
import { EventTypes } from '../../utils/eventTypes';

jest.mock('../../model/TodoModel');

describe('TodoController', () => {
  let controller;
  let modelMock;

  beforeEach(() => {
    modelMock = new TodoModel();
    controller = new TodoController(modelMock);
  });

  // Test getListCount method
  describe('getListCount', () => {
    it('should return the number of lists', () => {
      modelMock.getLists = jest.fn().mockReturnValue([{}, {}, {}]);
      const count = controller.getListCount();
      expect(count).toBe(3);
      expect(modelMock.getLists).toHaveBeenCalled();
    });
  });

  // Test checkListsExistence method
  describe('checkListsExistence', () => {
    it('should check lists existence', () => {
      jest.spyOn(controller.model, 'checkListsExistence').mockImplementation(() => {});
      controller.checkListsExistence();
      expect(controller.model.checkListsExistence).toHaveBeenCalled();
    });
  });

  // Test addObserver method
  describe('addObserver', () => {
    it('should add observer with specific events', () => {
      const observerMock = jest.fn();
      jest.spyOn(controller.model, 'addObserver').mockImplementation(() => {});

      controller.addObserver(observerMock);
      
      expect(controller.model.addObserver).toHaveBeenCalledWith(observerMock, [
        EventTypes.UPDATE_TODO,
        EventTypes.LISTS_EMPTY,
        EventTypes.LISTS_EXIST,
        EventTypes.LIST_CHANGED,
        EventTypes.ERROR_TODO
      ]);
    });
  });

  // Test getTodos method
  describe('getTodos', () => {
    it('should retrieve todos from model', () => {
      jest.spyOn(modelMock, 'getTodos').mockReturnValue([]);
      expect(controller.getTodos()).toEqual([]);
      expect(modelMock.getTodos).toHaveBeenCalled();
    });
  });

  // Test addTodo method
  describe('addTodo', () => {
    it('should add a todo through model', () => {
      const todo = { text: 'New Todo', completed: false };
      jest.spyOn(modelMock, 'addTodo').mockImplementation(() => {});
      controller.addTodo(todo);
      expect(modelMock.addTodo).toHaveBeenCalledWith(todo);
    });
  });

  // Test updateTodoName method
  describe('updateTodoName', () => {
    it('should update todo name through model', () => {
      const index = 0;
      const text = 'Updated Todo';
      jest.spyOn(modelMock, 'updateTodoName').mockImplementation(() => {});
      controller.updateTodoName(index, text);
      expect(modelMock.updateTodoName).toHaveBeenCalledWith(index, text);
    });
  });

  // Test deleteTodoItem method
  describe('deleteTodoItem', () => {
    it('should delete a todo item through model', () => {
      const index = 1;
      jest.spyOn(modelMock, 'deleteTodoItem').mockImplementation(() => {});
      controller.deleteTodoItem(index);
      expect(modelMock.deleteTodoItem).toHaveBeenCalledWith(index);
    });
  });

  // Test toggleTodoItemCompleted method
  describe('toggleTodoItemCompleted', () => {
    it('should toggle todo item completed status through model', () => {
      const index = 1;
      jest.spyOn(modelMock, 'toggleTodoItemCompleted').mockImplementation(() => {});
      controller.toggleTodoItemCompleted(index);
      expect(modelMock.toggleTodoItemCompleted).toHaveBeenCalledWith(index);
    });
  });

  // Test reorderItems method
  describe('reorderItems', () => {
    it('should reorder items through model', () => {
      const newOrder = [1, 2, 0];
      jest.spyOn(modelMock, 'reorderItems').mockImplementation(() => {});
      controller.reorderItems(newOrder);
      expect(modelMock.reorderItems).toHaveBeenCalledWith(newOrder);
    });
  });

  // Test getCurrentListName method
  describe('getCurrentListName', () => {
    it('should get the current list name from model', () => {
      jest.spyOn(modelMock, 'getCurrentListName').mockReturnValue('Current List');
      const listName = controller.getCurrentListName();
      expect(listName).toBe('Current List');
      expect(modelMock.getCurrentListName).toHaveBeenCalled();
    });
  });
});
