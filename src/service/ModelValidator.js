import { EventTypes } from '../utils/eventTypes.js';
import { ERROR_MESSAGES } from '../utils/errorMessages.js';

export class ModelValidator {

  static validateListExists(lists, listId) {
    if (!lists.has(listId)) {
      return { isValid: false, error: EventTypes.ERROR_LIST, message: ERROR_MESSAGES.LIST_NOT_FOUND };
    }
    return { isValid: true };
  }

  static validateListName(listNames, listName) {
    if (listNames.has(listName)) {
      return { isValid: false, error: EventTypes.ERROR_LIST, message: ERROR_MESSAGES.LIST_EXISTS };
    }
    if (listName.length === 0) {
      return { isValid: false, error: EventTypes.ERROR_LIST, message: ERROR_MESSAGES.LIST_TEXT_EMPTY };
    }
    return { isValid: true };
  }

  static validateUpdatedListName(lists, listNames, listId, listName) {
    const listExists = this.validateListExists(lists, listId);
    if (!listExists.isValid) {
      return listExists;
    }
    return this.validateListName(listNames, listName);
  }

  static validateTodoIndex(lists, listId, todoId) {
    if (!lists.has(listId) || todoId < 0 || todoId >= lists.get(listId).todos.length) {
      return { isValid: false, error: EventTypes.ERROR_TODO, message: ERROR_MESSAGES.INVALID_INDEX };
    }
    return { isValid: true };
  }

  static validateTodoText(lists, listId, index, newText) {
    if (newText.length === 0) {
      return { isValid: false, error: EventTypes.ERROR_TODO, message: ERROR_MESSAGES.TODO_TEXT_EMPTY };
    }
    return this.validateTodoIndex(lists, listId, index);
  }

  static validateAddTodo(lists, listId, todo) {
    const listExists = this.validateListExists(lists, listId);
    if (!listExists.isValid) {
      return listExists;
    }
    if (todo.text.length === 0) {
      return { isValid: false, error: EventTypes.ERROR_TODO, message: ERROR_MESSAGES.TODO_TEXT_EMPTY };
    }
    return { isValid: true };
  }

  static validateDeleteTodo(lists, listId, todoId) {
    const listExists = this.validateListExists(lists, listId);
    if (!listExists.isValid) {
      return listExists;
    }
    return this.validateTodoIndex(lists, listId, todoId);
  }
}
