import { UPDATE_TODO, UPDATE_LIST, ERROR_TODO, ERROR_LIST, ERROR_TEXT_EMPTY_TODO, ERROR_TEXT_EMPTY_LIST } from '../utils/eventTypes.js';

export class TodoModel {

  constructor() {
    const storedLists = localStorage.getItem("todoLists");
    this.lists = new Map(storedLists ? JSON.parse(storedLists) : []);
    this.listNames = new Set(Array.from(this.lists.values()).map(list => list.name));
    this.currentListId = this.lists.size > 0 ? this.lists.keys().next().value : null;
    this.observers = [];
  }

  addObserver(observer, events) {
    this.observers.set(observer, new Set(events));
  }

  notifyObservers(eventType = 'update', data = null) {
    this.observers.forEach(observer => observer.update(eventType, data));
  }

  persistData() {
    localStorage.setItem("todoLists", JSON.stringify([...this.lists]));
    this.notifyObservers();
  }

  addList(name) {
    if (this.listNames.has(name)) {
      this.notifyObservers('error', 'A list with this name already exists');
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
  }

  updateListName(listId, newName) {
    if (!this.lists.has(listId)) {
      this.notifyObservers('error', `List not found: ${listId}`);
      return;
    }
  
    if (newName.length === 0) {
      this.notifyObservers('error-text-empty', listId);
      return;
    }
  
    if (this.listNames.has(newName)) {
      this.notifyObservers('error', "A list with this name already exists.");
      return;
    }
  
    const listDetails = this.lists.get(listId);
    this.listNames.delete(listDetails.name);
    listDetails.name = newName;
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
    } else {
      this.notifyObservers('error', "List not found: " + listId);
    }
  }

  toggleTodoListCompleted(listId) {
    if (this.lists.has(listId)) {
      const list = this.lists.get(listId);
      list.completed = !list.completed;
      this.persistData();
    } else {
      this.notifyObservers('error', "List not found: " + listId);
    }
  }

  changeList(newListId) {
    if (this.lists.has(newListId)) {
      this.currentListId = newListId;
      this.persistData();
    } else {
      this.notifyObservers('error', "List not found: " + newListId);
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
    if (this.currentListId && this.lists.has(this.currentListId)) {
      this.lists.get(this.currentListId).todos.push(todo);
      this.persistData();
    } else {
      this.notifyObservers('error', "Cannot add task, no active list or list does not exist.");
    }
  }

  updateTodoName(index, text) {
    if (!this.currentListId || !this.lists.has(this.currentListId)) {
      this.notifyObservers('error', "Current list ID is not set or does not exist.");
      return;
    }
  
    const todos = this.lists.get(this.currentListId).todos;
    if (index < 0 || index >= todos.length) {
      this.notifyObservers('error', "Invalid index: " + index);
      return;
    }
  
    if (text.length === 0) {
      this.notifyObservers('error-text-empty', index);
      return;
    }
  
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
      this.notifyObservers('error', "Current list ID is not set or does not exist.");
    }
  }

  toggleTodoItemCompleted(index) {
    const todos = this.lists.get(this.currentListId).todos;
    if (index >= 0 && index < todos.length) {
      todos[index].completed = !todos[index].completed;
      this.persistData();
    } 
  }

  reorderItems(listId, newOrder) {
    if (this.lists.has(listId)) {
      const list = this.lists.get(listId);
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

  generateId() {
    return crypto.randomUUID();
  }
}