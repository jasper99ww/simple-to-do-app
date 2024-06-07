import { EventTypes } from '../utils/eventTypes.js';
import { ERROR_MESSAGES } from '../utils/errorMessages.js';

export class TodoModel {

  constructor() {
    const storedLists = localStorage.getItem("todoLists");
    this.lists = new Map(storedLists ? JSON.parse(storedLists) : []);
    this.listNames = new Set(Array.from(this.lists.values()).map(list => list.name));
    this.currentListId = this.lists.size > 0 ? this.lists.keys().next().value : null;
    this.observers = new Map();
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

  persistData() {
    localStorage.setItem("todoLists", JSON.stringify([...this.lists]));
    this.notifyObservers({ eventType: EventTypes.UPDATE_TODO });
    this.notifyObservers({ eventType: EventTypes.UPDATE_LIST });
  }

  checkListsExistence() {
    const eventType = this.lists.size === 0 ? EventTypes.LISTS_EMPTY : EventTypes.LISTS_EXIST;
    this.notifyObservers({ eventType: eventType });
  }

  addList(name) {
    if (this.listNames.has(name)) {
      this.notifyObservers({
        eventType: EventTypes.ERROR_LIST,
        message: ERROR_MESSAGES.LIST_EXISTS });
      return;
    }

    if(!name) {
      this.notifyObservers({
        eventType: EventTypes.ERROR_LIST,
        message: ERROR_MESSAGES.LIST_TEXT_EMPTY });
      return;
    }

    const listId = this.generateId();
    this.lists.set(listId, {
      id: listId,
      name: name,
      todos: [],
      completed: false
    });
    this.listNames.add(name);
    this.currentListId = listId;
    this.persistData();
    this.checkListsExistence();
  }

  generateId() {
    return crypto.randomUUID();
  }

  validateNewListName(listId, listName) {
    if (!this.lists.has(listId)) {
      return { eventType: EventTypes.ERROR_LIST, message: ERROR_MESSAGES.LIST_NOT_FOUND };
    } 
    else if (listName.length === 0) {
      return { eventType: EventTypes.ERROR_LIST, message: ERROR_MESSAGES.LIST_TEXT_EMPTY };
    } 
    else if (this.listNames.has(listName)) {
      return { eventType: EventTypes.ERROR_LIST, message: ERROR_MESSAGES.LIST_EXISTS };
    }
    return null;
  }

  updateListName(listId, newName) {

    const error = this.validateNewListName(listId, newName);
    if (error) {
      this.notifyObservers(error);
      this.notifyObservers({ eventType: EventTypes.UPDATE_LIST });
      return
    }

    const list = this.lists.get(listId);
    this.listNames.delete(list.name);
    list.name = newName;
    this.listNames.add(newName);
    this.persistData();
  }

  deleteList(listId) {
    if (this.lists.has(listId)) {
        const list = this.lists.get(listId);
        this.listNames.delete(list.name);
        this.lists.delete(listId);
        this.currentListId = this.lists.size > 0 ? this.lists.keys().next().value : null;
        this.persistData();
        this.checkListsExistence();
    } else {
      this.notifyObservers({ eventType: EventTypes.ERROR_LIST, message: ERROR_MESSAGES.LIST_NOT_FOUND });
    }
  }

  toggleTodoListCompleted(listId) {
      if (this.lists.has(listId)) {
          const list = this.lists.get(listId);
          list.completed = !list.completed;
          this.persistData();
      } else {
        this.notifyObservers({ eventType: EventTypes.ERROR_LIST, message: ERROR_MESSAGES.LIST_NOT_FOUND });
      }
  }

  changeList(newListId) {
      if (this.lists.has(newListId)) {
          this.currentListId = newListId;
          this.persistData();
      } else {
        this.notifyObservers({ eventType: EventTypes.ERROR_LIST, message: ERROR_MESSAGES.LIST_NOT_FOUND });
      }
  }

  reorderLists(newOrder) {
    const newList = new Map();
    newOrder.forEach(listId => {
      const list = this.lists.get(listId);
      if (list) {
        newList.set(listId, list);
      }
    });
    this.lists = newList;
    this.persistData();
  }

  addTodo(todo) {
    if (!this.currentListId || !this.lists.has(this.currentListId)) {
      this.notifyObservers({
          eventType: EventTypes.ERROR_TODO,
          message: ERROR_MESSAGES.TODO_NOT_FOUND
      });
      return;
    }

    if (!todo) {
        this.notifyObservers({
            eventType: EventTypes.ERROR_TODO,
            message: ERROR_MESSAGES.TODO_TEXT_EMPTY
        });
        return;
    }

    this.lists.get(this.currentListId).todos.push(todo);
    this.persistData();
  }

  validateTodoText(index, newText) {

    if (!this.lists.has(this.currentListId) || index < 0 || index >= this.lists.get(this.currentListId).todos.length) {
        return { eventType: EventTypes.ERROR_TODO, message: ERROR_MESSAGES.TODO_NOT_FOUND };
    }

    if (newText.trim().length === 0) {
        return { eventType: EventTypes.ERROR_TODO, message: ERROR_MESSAGES.TODO_TEXT_EMPTY };
    }
    
    return null;
}

  updateTodoName(index, text) {
    const error = this.validateTodoText(index, text);
    if (error) {
        this.notifyObservers(error);
        this.notifyObservers({ eventType: EventTypes.UPDATE_TODO });
        return;
    }

    const todos = this.lists.get(this.currentListId).todos;
    todos[index].text = text;
    this.persistData();
  }

  deleteTodoItem(index) {
    if (this.currentListId && this.lists.has(this.currentListId)) {
      const todos = this.lists.get(this.currentListId).todos;
      if (index >= 0 && index < todos.length) {
        todos.splice(index, 1);
        this.persistData();
      }
    } else {
      this.notifyObservers(EventDefinitions.ERROR_TODO);
    }
  }

  toggleTodoItemCompleted(index) {
    const todos = this.lists.get(this.currentListId).todos;
    if (index >= 0 && index < todos.length) {
      todos[index].completed = !todos[index].completed;
      this.persistData();
    } 
  }

  getTodos() {
    return this.lists.get(this.currentListId)?.todos || [];
  }

  reorderItems(newOrder) {
    if (this.lists.has(this.currentListId)) {
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
    }
  }
}