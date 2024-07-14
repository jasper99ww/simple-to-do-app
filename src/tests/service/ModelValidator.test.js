import { ModelValidator  } from '../../service/ModelValidator';
import { EventTypes } from '../../utils/eventTypes.js'; 
import { ERROR_MESSAGES } from '../../utils/errorMessages.js';

describe('ModelValidator', () => {
  let lists;
  let listNames;

  beforeEach(() => {
    lists = new Map();
    listNames = new Set();
  });

  describe('validateListExists', () => {
    it('should validate that a list does not exist', () => {
      const result = ModelValidator.validateListExists(lists, 'nonexistent');
      expect(result).toEqual({
        isValid: false,
        error: EventTypes.ERROR_LIST,
        message: ERROR_MESSAGES.LIST_NOT_FOUND
      });
    });

    it('should validate that a list does exist', () => {
      lists.set('existing', {});
      const result = ModelValidator.validateListExists(lists, 'existing');
      expect(result).toEqual({ isValid: true });
    });
  });

  describe('validateListName', () => {
    it('should fail if list name already exists', () => {
      listNames.add('Test');
      const result = ModelValidator.validateListName(listNames, 'Test');
      expect(result).toEqual({
        isValid: false,
        error: EventTypes.ERROR_LIST,
        message: ERROR_MESSAGES.LIST_EXISTS
      });
    });

    it('should fail if list name is empty', () => {
      const result = ModelValidator.validateListName(listNames, '');
      expect(result).toEqual({
        isValid: false,
        error: EventTypes.ERROR_LIST,
        message: ERROR_MESSAGES.LIST_TEXT_EMPTY
      });
    });

    it('should succeed if list name is valid and new', () => {
      const result = ModelValidator.validateListName(listNames, 'New List');
      expect(result).toEqual({ isValid: true });
    });
  });

  describe('validateUpdatedListName', () => {
    it('should validate against existing list and new name conditions', () => {
      lists.set('listId', {});
      const result = ModelValidator.validateUpdatedListName(lists, listNames, 'listId', 'New Name');
      expect(result).toEqual({ isValid: true });
    });

    it('should fail if the list does not exist', () => {
      const result = ModelValidator.validateUpdatedListName(lists, listNames, 'nonexistent', 'New Name');
      expect(result).toEqual({
        isValid: false,
        error: EventTypes.ERROR_LIST,
        message: ERROR_MESSAGES.LIST_NOT_FOUND
      });
    });
  });

  describe('validateTodoIndex', () => {
    beforeEach(() => {
      lists.set('listId', { todos: [{ id: 'todo1' }, { id: 'todo2' }] });
    });

    it('should fail if list does not exist', () => {
      const result = ModelValidator.validateTodoIndex(lists, 'nonexistent', 0);
      expect(result).toEqual({
        isValid: false,
        error: EventTypes.ERROR_TODO,
        message: ERROR_MESSAGES.INVALID_INDEX
      });
    });

    it('should fail if todo index is out of range', () => {
      const result = ModelValidator.validateTodoIndex(lists, 'listId', 5);
      expect(result).toEqual({
        isValid: false,
        error: EventTypes.ERROR_TODO,
        message: ERROR_MESSAGES.INVALID_INDEX
      });
    });

    it('should succeed if todo index is within range', () => {
      const result = ModelValidator.validateTodoIndex(lists, 'listId', 1);
      expect(result).toEqual({ isValid: true });
    });
  });

  describe('validateTodoText', () => {
    beforeEach(() => {
      lists.set('listId', { todos: [{ id: 'todo1', text: 'Some text' }] });
    });

    it('should fail if new todo text is empty', () => {
      const result = ModelValidator.validateTodoText(lists, 'listId', 0, '');
      expect(result).toEqual({
        isValid: false,
        error: EventTypes.ERROR_TODO,
        message: ERROR_MESSAGES.TODO_TEXT_EMPTY
      });
    });

    it('should validate against todo index and text conditions', () => {
      const result = ModelValidator.validateTodoText(lists, 'listId', 0, 'New text');
      expect(result).toEqual({ isValid: true });
    });
  });

  describe('validateAddTodo', () => {
    it('should fail if list does not exist', () => {
      const todo = { text: 'Do something' };
      const result = ModelValidator.validateAddTodo(lists, 'nonexistent', todo);
      expect(result).toEqual({
        isValid: false,
        error: EventTypes.ERROR_LIST,
        message: ERROR_MESSAGES.LIST_NOT_FOUND
      });
    });

    it('should fail if todo text is empty', () => {
      lists.set('listId', {});
      const todo = { text: '' };
      const result = ModelValidator.validateAddTodo(lists, 'listId', todo);
      expect(result).toEqual({
        isValid: false,
        error: EventTypes.ERROR_TODO,
        message: ERROR_MESSAGES.TODO_TEXT_EMPTY
      });
    });

    it('should succeed if list exists and todo text is valid', () => {
      lists.set('listId', {});
      const todo = { text: 'Do something' };
      const result = ModelValidator.validateAddTodo(lists, 'listId', todo);
      expect(result).toEqual({ isValid: true });
    });
  });

  describe('validateDeleteTodo', () => {
    beforeEach(() => {
      lists.set('listId', { todos: [{ id: 'todo1' }, { id: 'todo2' }] });
    });

    it('should fail if list does not exist', () => {
      const result = ModelValidator.validateDeleteTodo(lists, 'nonexistent', 0);
      expect(result).toEqual({
        isValid: false,
        error: EventTypes.ERROR_LIST,
        message: ERROR_MESSAGES.LIST_NOT_FOUND
      });
    });

    it('should fail if todo index is out of range', () => {
      const result = ModelValidator.validateDeleteTodo(lists, 'listId', 5);
      expect(result).toEqual({
        isValid: false,
        error: EventTypes.ERROR_TODO,
        message: ERROR_MESSAGES.INVALID_INDEX
      });
    });

    it('should succeed if todo index is within range', () => {
      const result = ModelValidator.validateDeleteTodo(lists, 'listId', 1);
      expect(result).toEqual({ isValid: true });
    });
  });
});