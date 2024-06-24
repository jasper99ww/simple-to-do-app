import { ModelValidator } from '../model/ModelValidator.js';

export class TodoService {
  constructor(storageService) {
    this.storageService = storageService;
  }

  validateAndExecute(validationMethod, operationCallback, ...args) {
    const lists = this.storageService.getLists();
    const validation = validationMethod.call(ModelValidator, lists, ...args);
    if (!validation.isValid) {
      return { success: false, error: validation.error, message: validation.message };
    }
    return operationCallback();
  }

  getTodos(listId) {
    const result = this.validateAndExecute(
      ModelValidator.validateListExists,
      () => ({ success: true, todos: this.storageService.getTodos(listId) }),
      listId
    );
    return result.success ? result.todos : [];
  }

  addTodo(todo, listId) {
    return this.validateAndExecute(
      ModelValidator.validateAddTodo,
      () => {
        this.storageService.addTodo(listId, todo);
        return { success: true };
      },
      listId,
      todo
    );
  }

  updateTodoName(todoId, listId, text) {
    return this.validateAndExecute(
      ModelValidator.validateTodoText,
      () => {
        const todos = this.getTodos(listId);
        let updatedTodo = todos[todoId];
        updatedTodo.text = text;
        this.storageService.updateTodo(listId, todoId, updatedTodo);
        return { success: true };
      },
      listId,
      todoId,
      text
    );
  }

  deleteTodoItem(todoId, listId) {
    return this.validateAndExecute(
      ModelValidator.validateDeleteTodo,
      () => {
        this.storageService.deleteTodo(listId, todoId);
        return { success: true };
      },
      listId,
      todoId
    );
  }

  toggleTodoItemCompleted(todoId, listId) {
    return this.validateAndExecute(
      ModelValidator.validateTodoIndex,
      () => {
        const todos = this.getTodos(listId);
        let updatedTodo = todos[todoId];
        updatedTodo.completed = !updatedTodo.completed;
        this.storageService.updateTodo(listId, todoId, updatedTodo);
        return { success: true };
      },
      listId,
      todoId
    );
  }

  reorderItems(newOrder, listId) {
    return this.validateAndExecute(
      ModelValidator.validateListExists,
      () => {
        const todos = this.getTodos(listId);
        const reorderedTodos = newOrder.map(index => todos[index]);
        const list = this.storageService.getList(listId);
        list.todos = reorderedTodos;
        this.storageService.updateList(listId, list);
        return { success: true };
      },
      listId
    );
  }

}