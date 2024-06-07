import { ModelValidator } from '../model/ModelValidator.js';

export class TodoService {
  constructor({ notifyObservers, persistData, currentListState, lists }) {
      this.notifyObservers = notifyObservers;
      this.persistData = persistData;
      this.currentListState = currentListState;
      this.lists = lists;
  }

  addTodo(todo) {
    const currentListId = this.currentListState.getCurrentListId();

    ModelValidator.validateAddTodo(this.lists, currentListId, todo, this.notifyObservers, () => {
      this.lists.get(this.currentListId).todos.push(todo);
      this.persistData();
    });
  }

  updateTodoName(index, text) {
    const currentListId = this.currentListState.getCurrentListId();
    
    ModelValidator.validateTodoText(this.lists, currentListId, index, text, this.notifyObservers, () => {
      const todos = this.lists.get(currentListId).todos;
      todos[index].text = text;
      this.persistData();
    });
  }

  deleteTodoItem(todoId) {
    const currentListId = this.currentListState.getCurrentListId();

    ModelValidator.validateDeleteTodo(this.lists, currentListId, this.notifyObservers, () => {
      const todos = getTodos();
      todos.splice(todoId, 1);
      this.persistData();
    });
  }

  toggleTodoItemCompleted(todoId) {
    const currentListId = this.currentListState.getCurrentListId();

    ModelValidator.validateTodoIndex(this.lists, this.currentListId, todoId, () => {
      const todos = getTodos();
      todos[todoId].completed = !todos[todoId].completed;
      this.persistData();
    });
  }

  getTodos() {
    return this.lists.get(this.currentListId)?.todos || [];
  }

  reorderItems(newOrder) {
    const currentListId = this.currentListState.getCurrentListId();

    ModelValidator.validateListExists(this.lists, this.currentListId, this.notifyObservers, () => { 
      const list = this.lists.get(this.currentListId);
      const reorderedTodos = [];

      newOrder.forEach(index => {
        const todo = list.todos[parseInt(index, 10)];
        if (todo) {
          reorderedTodos.push(todo);
        }
      });

      list.todos = reorderedTodos;
      this.persistData();
    });
  }

}