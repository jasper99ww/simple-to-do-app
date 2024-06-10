import { EventTypes } from '../utils/eventTypes.js';

export class TodoModel {

  constructor(listService, todoService, lists) {
    this.listService = listService;
    this.todoService = todoService;
    this.lists = lists;
    this._currentListId = null; 
    this.observers = new Map(); 
    this.loadInitialData();
}

  loadInitialData() {
    const storedLists = localStorage.getItem("todoLists");
    if (storedLists) {
      const parsedLists = JSON.parse(storedLists);
      parsedLists.forEach(([key, value]) => {
        this.lists.set(key, value);
      });
    }

    const savedCurrentListId = localStorage.getItem("currentListId");
    if (savedCurrentListId && this.lists.has(savedCurrentListId)) {
        this.setCurrentListId(savedCurrentListId);
    } else if (this.lists.size > 0) {
        const firstListId = this.lists.keys().next().value;
        this.setCurrentListId(firstListId);
    }
  }

  getLists(query = '') {
    return this.listService.getLists(query);
  }

  getCurrentListId() {
    return this._currentListId;
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
    const result = this.listService.getList(this.getCurrentListId());
    const listName = result.list.name;
    // console.log("list is " + list.name)

    return listName
  }

  setCurrentListId(listId) {
    if (this._currentListId !== listId) {
      console.log("34343")
      this._currentListId = listId;
      this.notifyObservers({ eventType: EventTypes.LIST_CHANGED });
    }
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
    const { success, updateUI } = this.listService.checkListsExistence();
    if (updateUI) {
        if (success) {
            this.notifyObservers({ eventType: EventTypes.LISTS_EXIST });
        } else {
            this.notifyObservers({ eventType: EventTypes.LISTS_EMPTY });
        }
    }
  }

  addList(name) {
    const result = this.listService.addList(name);
    if (result.success) {
        this.setCurrentListId(result.listId);
        this.persistData();
        this.checkListsExistence();
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
      // Update list id if the current list is deleted
      if (result.previousListId) {
          this.setCurrentListId(result.previousListId);
      } else {
          // this.setCurrentListId(null);
      }
        this.persistData();
        this.checkListsExistence();
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
      this.setCurrentListId(result.newListId);
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
    return this.lists.get(this._currentListId)?.todos || [];
  }

  addTodo(todo) {
    const result = this.todoService.addTodo(todo, this.getCurrentListId());
    if (result.success) {
        this.persistData();
        this.notifyObservers({ eventType: EventTypes.UPDATE_TODO, message: result.message });
    } else {
        this.notifyObservers({ eventType: result.error, message: result.message });
    }
  }

  updateTodoName(index, text) {
    const result = this.todoService.updateTodoName(index, text, this.getCurrentListId());
    if(result.success){
      this.setLocalStorage();
      this.notifyObservers({ eventType: EventTypes.UPDATE_TODO });
    } else {
      this.notifyObservers({ eventType: result.error, message: result.message });
    }
  }

  deleteTodoItem(index) {
    const result = this.todoService.deleteTodoItem(index, this.getCurrentListId());
    if(result.success){
      this.setLocalStorage();
      this.notifyObservers({ eventType: EventTypes.UPDATE_TODO });
    } else {
      this.notifyObservers({ eventType: result.error, message: result.message });
    }
  }

  toggleTodoItemCompleted(index) {
    const result = this.todoService.toggleTodoItemCompleted(index, this.getCurrentListId());
    if(result.success){
      this.setLocalStorage();
      this.notifyObservers({ eventType: EventTypes.UPDATE_TODO });
    } else {
      this.notifyObservers({ eventType: result.error, message: result.message });
    }
  }

  reorderItems(newOrder) {
    const result = this.todoService.reorderItems(newOrder, this.getCurrentListId());
    if(result.success){
      this.setLocalStorage();
      this.notifyObservers({ eventType: EventTypes.UPDATE_TODO });
    } else {
      this.notifyObservers({ eventType: result.error, message: result.message });
    }
  }
}