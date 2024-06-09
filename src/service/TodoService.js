import { ModelValidator } from '../model/ModelValidator.js';

export class TodoService {
  constructor(lists) {
      this.lists = lists;
  }

  addTodo(todo, listId) {
    const validation = ModelValidator.validateAddTodo(this.lists, listId, todo);
    if (!validation.isValid) {
        return { success: false, error: validation.error, message: validation.message };
    }
    const todos = this.getTodos(listId);
    todos.push(todo);
    return { success: true };
  }

  updateTodoName(index, text, listId) {
    const validation = ModelValidator.validateTodoText(this.lists, listId, index, text);
    if (!validation.isValid) {
        return { success: false, error: validation.error, message: validation.message };
    }
    
    const todos = this.getTodos(listId);
    todos[index].text = text;
    return { success: true };
  }

  deleteTodoItem(todoId, listId) {
    const validation = ModelValidator.validateDeleteTodo(this.lists, listId, todoId);
    if (!validation.isValid) {
        return { success: false, error: validation.error, message: validation.message };
    }
    const todos = this.getTodos(listId);
    todos.splice(todoId, 1);
    return { success: true };
  }

  toggleTodoItemCompleted(todoId, listId) {
    const validation = ModelValidator.validateTodoIndex(this.lists, listId, todoId);
    if (!validation.isValid) {
        return { success: false, error: validation.error, message: validation.message };
    }
    const todos = this.getTodos(listId);
    todos[todoId].completed = !todos[todoId].completed;
    return { success: true };
  }

  getTodos(listId) {
    return this.lists.get(listId)?.todos || [];
  }

  reorderItems(newOrder, listId) {
    const validation = ModelValidator.validateListExists(this.lists, listId);
    if (!validation.isValid) {
        return { success: false, error: validation.error, message: validation.message };
    }
    const list = this.lists.get(listId);
    const todosCopy = [...list.todos];

    newOrder.forEach((todoIndex, position) => {
        list.todos[position] = todosCopy[todoIndex];
    });

    return { success: true };
  }

}