import { TodoService } from '../service/TodoService.js';
import { ListService } from '../service/ListService.js';
import { CurrentListState } from '../service/CurrentListState.js';
import { EventTypes } from '../utils/eventTypes.js';

export class TodoModel {

  constructor() {
    this.lists = new Map();
    this.listNames = new Set();
    this.observers = new Map();
    this._currentListId = null;
    this.loadInitialData();

    this.listService = new ListService({
      getCurrentListId: this.getCurrentListId.bind(this),
      setCurrentListId: this.setCurrentListId.bind(this),
      lists: this.lists,
      listNames: this.listNames
    });

    this.todoService = new TodoService({
      getCurrentListId: this.getCurrentListId.bind(this),
      lists: this.lists,
    });
  }

  loadInitialData() {
    const storedLists = localStorage.getItem("todoLists");
    const savedCurrentListId = localStorage.getItem('currentListId');
    if (storedLists) {
      const parsedLists = JSON.parse(storedLists);
      this.lists = new Map(parsedLists);
      this.listNames = new Set(parsedLists.map(list => list.name));
      if (this.lists.size > 0) {
        const firstListId = this.lists.keys().next().value;
        this.setCurrentListId(firstListId);
        // this.currentListState.setCurrentListId(firstListId);
      }
    }
  }

  getCurrentListId() {
    return this._currentListId;
  }

  setCurrentListId(listId) {
      this._currentListId = listId;
      localStorage.setItem('currentListId', listId);
  }

  addObserver(observer, events) {
    this.observers.set(observer, new Set(events));
  }

  notifyObservers(event) {
    this.observers.forEach((events, observer) => {
        if (events.has(event.eventType)) {
            observer.update(event);
        }
    });
  }

  setLocalStorage() {
    localStorage.setItem("todoLists", JSON.stringify([...this.lists]));
  }

  persistData() {
    this.setLocalStorage();
    this.notifyObservers({ eventType: EventTypes.UPDATE_TODO });
    this.notifyObservers({ eventType: EventTypes.UPDATE_LIST });
  }

  /* ListService methods */

  checkListsExistence() {
    const result = this.listService.checkListsExistence();
    if (result.success) {
        this.notifyObservers({ eventType: EventTypes.LISTS_EXIST });
    } else {
        this.notifyObservers({ eventType: EventTypes.LISTS_EMPTY });
    }
  }

  addList(name) {
    const result = this.listService.addList(name);
    if (result.success) {
        this.persistData();
    } else {
        this.notifyObservers({ eventType: result.error, message: result.message });
    }
  }

  updateListName(listId, newName) {
    const result = this.listService.updateListName(listId, newName);
    if(result.success){
      this.setLocalStorage();
      this.notifyObservers({ eventType: EventTypes.UPDATE_LIST });
    } else {
      this.notifyObservers({ eventType: result.error, message: result.message });
    }
  }

  deleteList(listId) {
    const result = this.listService.deleteList(listId);
    if (result.success) {
        this.persistData();
    } else {
        this.notifyObservers({ eventType: result.error, message: result.message });
    }
  }

  toggleTodoListCompleted(listId) {
    const result = this.listService.toggleTodoListCompleted(listId);
    if (result.success) {
        this.setLocalStorage();
        this.notifyObservers({ eventType: EventTypes.UPDATE_LIST });
    } else {
        this.notifyObservers({ eventType: result.error, message: result.message });
    }
  }

  changeCurrentList(newListId) {
    const result = this.listService.changeCurrentList(newListId);
    if (result.success) {
      this.persistData();
    } else {
        this.notifyObservers({ eventType: result.error, message: result.message });
    }
  }

  reorderLists(newOrder) {
    const result = this.listService.reorderLists(newOrder);
    if (result.success) {
        this.setLocalStorage();
        this.notifyObservers({ eventType: EventTypes.UPDATE_LIST });
    } else {
        this.notifyObservers({ eventType: result.error, message: result.message });
    }
  }

  /* TodoService methods */

  getTodos() {
    return this.todoService.getTodos(this.getCurrentListId());
  }

  addTodo(todo) {
    const result = this.todoService.addTodo(todo);
    if (result.success) {
        this.persistData();
        this.notifyObservers({ eventType: EventTypes.UPDATE_TODO, message: result.message });
    } else {
        this.notifyObservers({ eventType: result.error, message: result.message });
    }
  }

  updateTodoName(index, text) {
    const result = this.todoService.updateTodoName(index, text);
    if(result.success){
      this.setLocalStorage();
      this.notifyObservers({ eventType: EventTypes.UPDATE_TODO });
    } else {
      this.notifyObservers({ eventType: result.error, message: result.message });
    }
  }

  deleteTodoItem(index) {
    const result = this.todoService.deleteTodoItem(index);
    if(result.success){
      this.setLocalStorage();
      this.notifyObservers({ eventType: EventTypes.UPDATE_TODO });
    } else {
      this.notifyObservers({ eventType: result.error, message: result.message });
    }
  }

  toggleTodoItemCompleted(index) {
    const result = this.todoService.toggleTodoItemCompleted(index);
    if(result.success){
      this.setLocalStorage();
      this.notifyObservers({ eventType: EventTypes.UPDATE_TODO });
    } else {
      this.notifyObservers({ eventType: result.error, message: result.message });
    }
  }

  reorderItems(newOrder) {
    const result = this.todoService.reorderItems(newOrder);
    if(result.success){
      this.setLocalStorage();
      this.notifyObservers({ eventType: EventTypes.UPDATE_TODO });
    } else {
      this.notifyObservers({ eventType: result.error, message: result.message });
    }
  }
}