import { TodoModel } from '../../model/TodoModel.js';
import { TodoService } from '../../service/TodoService.js';
import { ObserverManager } from '../../service/ObserverManager.js';
import { EventTypes } from '../../utils/eventTypes.js';

jest.mock('../../service/TodoService.js');
jest.mock('../../service/ObserverManager.js');

describe('TodoModel - Todo Methods', () => {
  let model;
  let listServiceMock;
  let todoServiceMock;
  let observerManagerMock;

  beforeEach(() => {

    listServiceMock = {
      getCurrentListId: jest.fn().mockReturnValue('default-list-id'),
    };

    todoServiceMock = new TodoService();
    observerManagerMock = new ObserverManager();
    jest.clearAllMocks();
    model = new TodoModel(listServiceMock, todoServiceMock, observerManagerMock);
  });

  // Test getTodos method
  test('getTodos should retrieve todos correctly', () => {
    const todos = [{ id: 1, text: 'Test Todo', completed: false }];
    todoServiceMock.getTodos.mockReturnValue(todos);

    const result = model.getTodos();
    expect(todoServiceMock.getTodos).toHaveBeenCalled();
    expect(result).toEqual(todos);
  });

  // Test addTodo method
  test('addTodo should notify and update UI when successful', () => {
    const todo = { text: 'New Todo', completed: false };
    todoServiceMock.addTodo.mockReturnValue({ success: true, message: 'Todo added' });
    model.addTodo(todo);

    expect(todoServiceMock.addTodo).toHaveBeenCalledWith(todo, model.getCurrentListId());
    expect(observerManagerMock.notifyObservers).toHaveBeenCalledWith({ eventType: EventTypes.UPDATE_TODO, message: 'Todo added' });
    expect(observerManagerMock.notifyObservers).toHaveBeenCalledWith({ eventType: EventTypes.UPDATE_LIST });
  });

  test('addTodo should notify error on failure', () => {
    const todo = { text: 'New Todo', completed: false };
    todoServiceMock.addTodo.mockReturnValue({ success: false, error: EventTypes.ERROR_TODO, message: 'Failed to add todo' });
    model.addTodo(todo);

    expect(todoServiceMock.addTodo).toHaveBeenCalledWith(todo, model.getCurrentListId());
    expect(observerManagerMock.notifyObservers).toHaveBeenCalledWith({ eventType: EventTypes.ERROR_TODO, message: 'Failed to add todo' });
  });

  // Test updateTodoName method
  test('updateTodoName should notify on success', () => {
    todoServiceMock.updateTodoName.mockReturnValue({ success: true });
    model.updateTodoName(1, 'Updated Todo');

    expect(todoServiceMock.updateTodoName).toHaveBeenCalledWith(1, model.getCurrentListId(), 'Updated Todo');
    expect(observerManagerMock.notifyObservers).toHaveBeenCalledWith({ eventType: EventTypes.UPDATE_TODO });
    expect(observerManagerMock.notifyObservers).toHaveBeenCalledWith({ eventType: EventTypes.UPDATE_LIST });
  });

  test('updateTodoName should notify error on failure', () => {
    todoServiceMock.updateTodoName.mockReturnValue({ success: false, error: EventTypes.ERROR_TODO, message: 'Error updating todo' });
    model.updateTodoName(1, 'Updated Todo');

    expect(todoServiceMock.updateTodoName).toHaveBeenCalledWith(1, model.getCurrentListId(), 'Updated Todo');
    expect(observerManagerMock.notifyObservers).toHaveBeenCalledWith({ eventType: EventTypes.ERROR_TODO, message: 'Error updating todo' });
  });

  // Test deleteTodoItem method
  test('deleteTodoItem should notify and update UI when successful', () => {
    todoServiceMock.deleteTodoItem.mockReturnValue({ success: true });
    model.deleteTodoItem(1);

    expect(todoServiceMock.deleteTodoItem).toHaveBeenCalledWith(1, model.getCurrentListId());
    expect(observerManagerMock.notifyObservers).toHaveBeenCalledWith({ eventType: EventTypes.UPDATE_TODO });
    expect(observerManagerMock.notifyObservers).toHaveBeenCalledWith({ eventType: EventTypes.UPDATE_LIST });
    expect(observerManagerMock.notifyObservers).toHaveBeenCalledWith({ eventType: EventTypes.UPDATE_TODO });
  });

  test('deleteTodoItem should notify error on failure', () => {
    todoServiceMock.deleteTodoItem.mockReturnValue({ success: false, error: EventTypes.ERROR_TODO, message: 'Failed to delete todo' });
    model.deleteTodoItem(1);

    expect(todoServiceMock.deleteTodoItem).toHaveBeenCalledWith(1, model.getCurrentListId());
    expect(observerManagerMock.notifyObservers).toHaveBeenCalledWith({ eventType: EventTypes.ERROR_TODO, message: 'Failed to delete todo' });
  });

  // Test toggleTodoItemCompleted method
  test('toggleTodoItemCompleted should notify and update UI when successful', () => {
    todoServiceMock.toggleTodoItemCompleted.mockReturnValue({ success: true });
    model.toggleTodoItemCompleted(1);

    expect(todoServiceMock.toggleTodoItemCompleted).toHaveBeenCalledWith(1, model.getCurrentListId());
    expect(observerManagerMock.notifyObservers).toHaveBeenCalledWith({ eventType: EventTypes.UPDATE_TODO });
    expect(observerManagerMock.notifyObservers).toHaveBeenCalledWith({ eventType: EventTypes.UPDATE_LIST });
  });

  test('toggleTodoItemCompleted should notify error on failure', () => {
    todoServiceMock.toggleTodoItemCompleted.mockReturnValue({ success: false, error: EventTypes.ERROR_TODO, message: "Failed to toggle todo" });
    model.toggleTodoItemCompleted(1);

    expect(todoServiceMock.toggleTodoItemCompleted).toHaveBeenCalledWith(1, model.getCurrentListId());
    expect(observerManagerMock.notifyObservers).toHaveBeenCalledWith({ eventType: EventTypes.ERROR_TODO, message: "Failed to toggle todo" });
  });

  // Test reorderItems method
  test('reorderItems should notify and update UI when successful', () => {
    const newOrder = [2, 1];
    todoServiceMock.reorderItems.mockReturnValue({ success: true });
    model.reorderItems(newOrder);

    expect(todoServiceMock.reorderItems).toHaveBeenCalledWith(newOrder, model.getCurrentListId());
    expect(observerManagerMock.notifyObservers).toHaveBeenCalledWith({ eventType: EventTypes.UPDATE_TODO });
    expect(observerManagerMock.notifyObservers).toHaveBeenCalledWith({ eventType: EventTypes.UPDATE_LIST });
  });

  test('reorderItems should notify error on failure', () => {
    const newOrder = [2, 1];
    todoServiceMock.reorderItems.mockReturnValue({ success: false, error: EventTypes.ERROR_TODO, message: "Failed to reorder todos" });
    model.reorderItems(newOrder);

    expect(todoServiceMock.reorderItems).toHaveBeenCalledWith(newOrder, model.getCurrentListId());
    expect(observerManagerMock.notifyObservers).toHaveBeenCalledWith({ eventType: EventTypes.ERROR_TODO, message: "Failed to reorder todos" });
  });

});