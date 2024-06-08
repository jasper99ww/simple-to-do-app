import { ModelValidator } from '../model/ModelValidator.js';

export class TodoService {
  constructor({ getCurrentListId, lists }) {
      this.getCurrentListId = getCurrentListId
      this.lists = lists;
  }

  addTodo(todo) {
    const currentListId = this.getCurrentListId();
    const validation = ModelValidator.validateAddTodo(this.lists, currentListId, todo);
    if (!validation.isValid) {
        return { success: false, error: validation.error, message: validation.message };
    }
    const todos = this.getTodos(currentListId);
    todos.push(todo);
    return { success: true };
  }

  updateTodoName(index, text) {
    const currentListId = this.getCurrentListId();

    const validation = ModelValidator.validateTodoText(this.lists, currentListId, index, text);

    if (!validation.isValid) {
        return { success: false, error: validation.error, message: validation.message };
    }
    
    const todos = this.getTodos(currentListId);
    todos[index].text = text;
    return { success: true };
  }

  deleteTodoItem(todoId) {
    const currentListId = this.getCurrentListId();
    const validation = ModelValidator.validateDeleteTodo(this.lists, currentListId, todoId);
    if (!validation.isValid) {
        return { success: false, error: validation.error, message: validation.message };
    }
    const todos = this.getTodos(currentListId);
    todos.splice(todoId, 1);
    return { success: true };
  }

  toggleTodoItemCompleted(todoId) {
    const currentListId = this.getCurrentListId();
    const validation = ModelValidator.validateTodoIndex(this.lists, currentListId, todoId);
    if (!validation.isValid) {
        return { success: false, error: validation.error, message: validation.message };
    }
    const todos = this.getTodos(currentListId);
    todos[todoId].completed = !todos[todoId].completed;
    return { success: true };
  }

  getTodos(listId) {
    return this.lists.get(listId)?.todos || [];
  }

  reorderItems(newOrder) {
    const currentListId = this.getCurrentListId();
    const validation = ModelValidator.validateListExists(this.lists, currentListId);
    if (!validation.isValid) {
        return { success: false, error: validation.error, message: validation.message };
    }
    const list = this.lists.get(currentListId);
    const todosCopy = [...list.todos];

    newOrder.forEach((todoIndex, position) => {
        list.todos[position] = todosCopy[todoIndex];
    });

    return { success: true };
  }

}