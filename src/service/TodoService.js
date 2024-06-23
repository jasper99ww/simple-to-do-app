import { ModelValidator } from '../model/ModelValidator.js';

export class TodoService {
  constructor(storageService) {
    this.storageService = storageService;
  }

  getTodos(currentListId) {
    return this.storageService.getList(currentListId).todos || [];
  }

  addTodo(todo, listId) {
    const lists = this.storageService.getLists();
    const validation = ModelValidator.validateAddTodo(lists, listId, todo);
    if (!validation.isValid) {
        return { success: false, error: validation.error, message: validation.message };
    }
    this.storageService.addTodo(todo, listId);
    return { success: true };
  }

  updateTodoName(todoIndex, listId, text) {
    const lists = this.storageService.getLists();
    const validation = ModelValidator.validateTodoText(lists, listId, todoIndex, text);
    if (!validation.isValid) {
        return { success: false, error: validation.error, message: validation.message };
    }
    
    this.storageService.updateTodoName(todoIndex, listId, text);
    return { success: true };
  }

  deleteTodoItem(todoId, listId) {
    const lists = this.storageService.getLists();
    const validation = ModelValidator.validateDeleteTodo(lists, listId, todoId);
    if (!validation.isValid) {
        return { success: false, error: validation.error, message: validation.message };
    }
    this.storageService.deleteTodoItem(todoId, listId);
    return { success: true };
  }

  toggleTodoItemCompleted(todoId, listId) {
    const lists = this.storageService.getLists();
    const validation = ModelValidator.validateTodoIndex(lists, listId, todoId);
    if (!validation.isValid) {
        return { success: false, error: validation.error, message: validation.message };
    }
    this.storageService.toggleTodoCompleted(todoId, listId);
    return { success: true };
  }

  reorderItems(newOrder, listId) {
    const lists = this.storageService.getLists();
    const validation = ModelValidator.validateListExists(lists, listId);
    if (!validation.isValid) {
        return { success: false, error: validation.error, message: validation.message };
    }
    this.storageService.reorderTodos(listId, newOrder);
    return { success: true };
  }

}