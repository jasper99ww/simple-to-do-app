import { EventTypes } from '../utils/eventTypes.js';

export class TodoModel {

  constructor(listService, todoService, observerManager) {
    this.listService = listService;
    this.todoService = todoService;
    this.observerManager = observerManager;
    this._currentListId = this.listService.getCurrentListId();
 }

 /* Observer methods */

  addObserver(observer, eventTypes) {
    this.observerManager.addObserver(observer, eventTypes);
  }

  notifyObservers(eventType) {
    this.observerManager.notifyObservers(eventType);
  }

  notifyUpdateListAndTodos() {
    this.notifyObservers({ eventType: EventTypes.UPDATE_TODO });
    this.notifyObservers({ eventType: EventTypes.UPDATE_LIST });
  }

 /* List methods */

  addList(name) {
    const result = this.listService.addList(name);
    if (result.success) {
        this.setCurrentListId(result.listId);
        this.notifyUpdateListAndTodos();
        //Check if lists exist to update UI for empty lists
        this.checkListsExistence();
    } else {
        this.notifyObservers({ eventType: result.error, message: result.message });
    }
  }

  getLists(query = '') {
    return this.listService.getLists(query);
  }

  getCurrentListId() {
    return this._currentListId;
  }

  setCurrentListId(listId) {
    if (this._currentListId !== listId) {
      this._currentListId = listId;
      this.listService.saveCurrentListId(listId);
      this.notifyObservers({ eventType: EventTypes.LIST_CHANGED });
    }
  }

  getCurrentList() {
    const result = this.listService.getList(this.getCurrentListId());
    if (result.success) {
        return result.list;
    } else {
        this.notifyObservers({ eventType: result.error, message: result.message });
    }
  }

  getCurrentListName() {
    const result = this.listService.getCurrentListName();
    if (result.success) {
      return result.listName;
    } else {
      this.notifyObservers({ eventType: result.error, message: result.message });
    }
  }

  updateListName(listId, newName) {
    const result = this.listService.updateListName(listId, newName);
    if(result.success){
      this.notifyObservers({ eventType: EventTypes.UPDATE_LIST });
      this.notifyObservers({ eventType: EventTypes.LIST_CHANGED });
    } else {
      this.notifyObservers({ eventType: result.error, message: result.message });
    }
  }

  deleteList(listId) {
    const result = this.listService.deleteList(listId);
    if (result.success) {
      // Update list id if the current list is deleted
      if (result.previousListId) {
          this.setCurrentListId(result.previousListId);
      }
      this.notifyUpdateListAndTodos();
      // Check if lists exist to potentially update UI for empty lists if the last list is deleted
      this.checkListsExistence();
    } else {
        this.notifyObservers({ eventType: result.error, message: result.message });
    }
  }

  toggleTodoListCompleted(listId) {
    const result = this.listService.toggleTodoListCompleted(listId);
    if (result.success) {
        this.notifyObservers({ eventType: EventTypes.UPDATE_LIST });
    } else {
        this.notifyObservers({ eventType: result.error, message: result.message });
    }
  }

  changeCurrentList(newListId) {
    const result = this.listService.getList(newListId);
    if (result.success) {
      this.setCurrentListId(newListId);
      this.notifyUpdateListAndTodos();
    } else {
        this.notifyObservers({ eventType: result.error, message: result.message });
    }
  }

  reorderLists(newOrder) {
    const result = this.listService.reorderLists(newOrder);
    if (result.success) {
        this.notifyObservers({ eventType: EventTypes.UPDATE_LIST });
    } else {
        this.notifyObservers({ eventType: result.error, message: result.message });
    }
  }

  checkListsExistence() {
    const { success, updateUI } = this.listService.checkListsExistence();
    if (updateUI) {
        if (success) {
            this.notifyObservers({ eventType: EventTypes.LISTS_EXIST });
        } else {
            this.notifyObservers({ eventType: EventTypes.LISTS_EMPTY });
        }
    }
  }

  /* TodoService methods */

  getTodos() {
    return this.todoService.getTodos(this.getCurrentListId());
  }

  addTodo(todo) {
    const result = this.todoService.addTodo(todo, this.getCurrentListId());
    if (result.success) {
        this.notifyUpdateListAndTodos();
        this.notifyObservers({ eventType: EventTypes.UPDATE_TODO, message: result.message });
    } else {
        this.notifyObservers({ eventType: result.error, message: result.message });
    }
  }

  updateTodoName(index, text) {
    const result = this.todoService.updateTodoName(index, this.getCurrentListId(), text);
    if(result.success){
      this.notifyUpdateListAndTodos();
      this.notifyObservers({ eventType: EventTypes.UPDATE_TODO });
    } else {
      this.notifyObservers({ eventType: result.error, message: result.message });
    }
  }

  deleteTodoItem(index) {
    const result = this.todoService.deleteTodoItem(index, this.getCurrentListId());
    if(result.success){
      this.notifyUpdateListAndTodos();
      this.notifyObservers({ eventType: EventTypes.UPDATE_TODO });
    } else {
      this.notifyObservers({ eventType: result.error, message: result.message });
    }
  }

  toggleTodoItemCompleted(index) {
    const result = this.todoService.toggleTodoItemCompleted(index, this.getCurrentListId());
    if(result.success){
      this.notifyUpdateListAndTodos();
      this.notifyObservers({ eventType: EventTypes.UPDATE_TODO });
    } else {
      this.notifyObservers({ eventType: result.error, message: result.message });
    }
  }

  reorderItems(newOrder) {
    const result = this.todoService.reorderItems(newOrder, this.getCurrentListId());
    if(result.success){
      this.notifyUpdateListAndTodos();
      this.notifyObservers({ eventType: EventTypes.UPDATE_TODO });
    } else {
      this.notifyObservers({ eventType: result.error, message: result.message });
    }
  }
}