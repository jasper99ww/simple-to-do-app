import { EventTypes } from '../utils/eventTypes.js';

export class TodoController {

  constructor(model) {
    this.model = model;
  }

  getListCount() {
    return this.model.getLists().length;
  }

  checkListsExistence() {
    this.model.checkListsExistence();
  }

  addObserver(observer) {
    this.model.addObserver(observer, [
      EventTypes.UPDATE_TODO,
      EventTypes.LISTS_EMPTY,
      EventTypes.LISTS_EXIST,
      EventTypes.LIST_CHANGED,
      EventTypes.ERROR_TODO
    ]);
  }

  getTodos() {
    return this.model.getTodos();
  }

  addTodo(todo) {
    this.model.addTodo(todo);
  }

  updateTodoName(index, text) {
    this.model.updateTodoName(index, text);
  }

  deleteTodoItem(index) {
    this.model.deleteTodoItem(index);
  }

  toggleTodoItemCompleted(index) {
    this.model.toggleTodoItemCompleted(index);
  }

  reorderItems(newOrder) {
    this.model.reorderItems(newOrder);
  }

  getCurrentListName() {
    return this.model.getCurrentListName();
  }
}
