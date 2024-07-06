import { TodoService } from '../../service/TodoService.js';
import { StorageService } from '../../service/StorageService.js';
import { ModelValidator } from '../../service/ModelValidator.js';

jest.mock('../../service/StorageService.js');
jest.mock('../../service/ModelValidator.js');

describe('TodoService', () => {
  let todoService;
  let storageServiceMock;

  beforeEach(() => {
    jest.clearAllMocks();
    storageServiceMock = new StorageService();
    todoService = new TodoService(storageServiceMock);
  });

  // Test getTodos method
  describe('getTodos', () => {
    it('should return todos for a valid list ID', () => {
      const mockTodos = [{ id: 'todo1', text: 'Test Todo', completed: false }];
      storageServiceMock.getTodos.mockReturnValue(mockTodos);
      ModelValidator.validateListExists.mockReturnValue({ isValid: true });

      const todos = todoService.getTodos('list1');

      expect(todos).toEqual(mockTodos);
      expect(storageServiceMock.getTodos).toHaveBeenCalledWith('list1');
    });

    it('should return an empty array if the list ID is invalid', () => {
      ModelValidator.validateListExists.mockReturnValue({ isValid: false, error: 'List not found' });
      const todos = todoService.getTodos('invalidListId');

      expect(todos).toEqual([]);
    });
  });

  // Test addTodo method
  describe('addTodo', () => {
    it('should add a todo item to the list when validated', () => {
      const todo = { text: 'New Task', completed: false };
      ModelValidator.validateAddTodo.mockReturnValue({ isValid: true });

      const result = todoService.addTodo(todo, 'list1');

      expect(result.success).toBe(true);
      expect(storageServiceMock.addTodo).toHaveBeenCalledWith('list1', todo);
    });

    it('should not add a todo item when validation fails', () => {
      const todo = { text: '', completed: false };
      ModelValidator.validateAddTodo.mockReturnValue({ isValid: false, error: 'Invalid data' });

      const result = todoService.addTodo(todo, 'list1');

      expect(result.success).toBe(false);
      expect(storageServiceMock.addTodo).not.toHaveBeenCalled();
    });
  });

  // Test updateTodoName method
  describe('updateTodoName', () => {
    it('should update the text of an existing todo', () => {
      const todos = [{ id: '1', text: 'Old Name', completed: false }];
      storageServiceMock.getTodos.mockReturnValue(todos);
      ModelValidator.validateTodoText.mockReturnValue({ isValid: true });
  
      const result = todoService.updateTodoName('1', 'list1', 'New Name');
  
      expect(result.success).toBe(true);
      expect(storageServiceMock.updateTodo).toHaveBeenCalledWith('list1', '1', { ...todos[0], text: 'New Name' });
    });
  
    it('should not update the todo text if the new text is empty', () => {
      const todos = [{ id: '1', text: 'Old Name', completed: false }];
      storageServiceMock.getTodos.mockReturnValue(todos);
      ModelValidator.validateTodoText.mockReturnValue({ isValid: false, error: 'ERROR_TODO', message: 'Todo text cannot be empty' });
  
      const result = todoService.updateTodoName('1', 'list1', '');
  
      expect(result.success).toBe(false);
      expect(result.error).toBe('ERROR_TODO');
      expect(result.message).toBe('Todo text cannot be empty');
      expect(storageServiceMock.updateTodo).not.toHaveBeenCalled();
    });
  });
  

  // Test deleteTodoItem method
  describe('deleteTodoItem', () => {
    it('should delete a todo item', () => {
      ModelValidator.validateDeleteTodo.mockReturnValue({ isValid: true });

      const result = todoService.deleteTodoItem('1', 'list1');

      expect(result.success).toBe(true);
      expect(storageServiceMock.deleteTodo).toHaveBeenCalledWith('list1', '1');
    });
  });

  // Test toggleTodoItemCompleted method
  describe('toggleTodoItemCompleted', () => {
    it('should toggle the completion status of a todo item', () => {
      const todos = [{ id: '1', text: 'Test Todo', completed: false }];
      storageServiceMock.getTodos.mockReturnValue(todos);
      ModelValidator.validateTodoIndex.mockReturnValue({ isValid: true });
  
      const result = todoService.toggleTodoItemCompleted('1', 'list1');
  
      expect(result.success).toBe(true);
      expect(storageServiceMock.updateTodo).toHaveBeenCalledWith('list1', '1', { ...todos[0], completed: true });
    });
  
    it('should return an error if the todo item index is invalid', () => {
      storageServiceMock.getTodos.mockReturnValue([]);
      ModelValidator.validateTodoIndex.mockReturnValue({ isValid: false, error: 'ERROR_TODO', message: 'Invalid todo index' });
  
      const result = todoService.toggleTodoItemCompleted('1', 'list1');
  
      expect(result.success).toBe(false);
      expect(result.error).toBe('ERROR_TODO');
      expect(result.message).toBe('Invalid todo index');
      expect(storageServiceMock.updateTodo).not.toHaveBeenCalled();
    });
  });
  
  describe('reorderItems', () => {
    it('should reorder the todo items correctly and return success', () => {
      const listId = 'list1';
      const initialTodos = [
        { id: 'todo1', text: 'First todo', completed: false },
        { id: 'todo2', text: 'Second todo', completed: true }
      ];
      const newOrder = [1, 0]; // New order will place 'Second todo' before 'First todo'
  
      storageServiceMock.getTodos.mockReturnValue(initialTodos);
      storageServiceMock.getList.mockReturnValue({ id: listId, todos: initialTodos });
      ModelValidator.validateListExists.mockReturnValue({ isValid: true });
  
      const result = todoService.reorderItems(newOrder, listId);
  
      expect(result.success).toBe(true);
      expect(storageServiceMock.updateList).toHaveBeenCalledWith(listId, {
        id: listId,
        todos: [
          { id: 'todo2', text: 'Second todo', completed: true },
          { id: 'todo1', text: 'First todo', completed: false }
        ]
      });
    });
  
    it('should return an error when the list does not exist', () => {
      const listId = 'list2';
      const newOrder = [1, 0];
      
      storageServiceMock.getTodos.mockReturnValue([]);
      storageServiceMock.getList.mockReturnValue(undefined); // No list found
      ModelValidator.validateListExists.mockReturnValue({ isValid: false, error: 'ERROR_LIST', message: 'List not found' });
  
      const result = todoService.reorderItems(newOrder, listId);
  
      expect(result.success).toBe(false);
      expect(result.error).toBe('ERROR_LIST');
      expect(result.message).toBe('List not found');
      expect(storageServiceMock.updateList).not.toHaveBeenCalled();
    });
  });
  


});