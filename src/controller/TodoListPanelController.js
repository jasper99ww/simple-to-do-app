import { EventTypes } from '../utils/eventTypes.js';

export class TodoListPanelController {

  constructor(model) {
    this.model = model;
  }

  addObserver(observer) {
    this.model.addObserver(observer, [
      EventTypes.UPDATE_LIST,
      EventTypes.ERROR_LIST,
      EventTypes.LIST_CHANGED
    ]);
  }

  addList(name) {
    this.model.addList(name);
  }

  getLists(query = '') {
    return this.model.getLists(query);
  }

  getCurrentListId() {
    return this.model.getCurrentListId();
  }

  updateListName(listId, newName) {
    this.model.updateListName(listId, newName);
  }

  deleteList(listId) {
    this.model.deleteList(listId);
  }

  changeCurrentList(listId) {
    this.model.changeCurrentList(listId);
  }

  toggleListCompletion(listId) {
    this.model.toggleTodoListCompleted(listId);
  }

  reorderLists(newOrder) {
    this.model.reorderLists(newOrder);
  }
}
