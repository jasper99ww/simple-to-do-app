export class TodoModel {

  constructor() {
    const storedLists = localStorage.getItem("todoLists");
    this.lists = new Map(storedLists ? JSON.parse(storedLists) : []);
    this.listNames = new Set(Array.from(this.lists.values()).map(list => list.name));
    this.currentListId = this.lists.size > 0 ? this.lists.keys().next().value : null;
    this.observers = [];
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  notifyObservers() {
    this.observers.forEach(observer => observer.update());
  }

  addList(name) {
    if (this.lists.has(name)) {
      alert('Lista o tej nazwie już istnieje.');
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
    this.saveTodos();
    this.notifyObservers();
  }

  deleteList(listId) {
    if (this.lists.has(listId)) {
      const list = this.lists.get(listId);
      this.listNames.delete(list.name);
      this.lists.delete(listId);
      this.currentListId = this.lists.size > 0 ? this.lists.keys().next().value : null;
      this.saveTodos();
      this.notifyObservers();
    }
  }

  addTodo(todo) {
    if (this.currentListId && this.lists.has(this.currentListId)) {
      this.lists.get(this.currentListId).todos.push(todo);
      this.saveTodos();
      this.notifyObservers();
    } else {
      console.error("Nie można dodać zadania, brak aktywnej listy lub lista nie istnieje.");
    }
  }

  updateTodoText(index, text) {
    if (this.currentListId && this.lists.has(this.currentListId)) {
      const todos = this.lists.get(this.currentListId).todos;

      if (text.length === 0) {
        alert("Todo item text cannot be empty. Reverting to previous text.");
        if (index >= 0 && index < todos.length) {
          const todoElement = document.querySelector(`[data-index='${index}'] .todo-text`);
          todoElement.textContent = todos[index].text;
          todoElement.blur();
        }
        return;
      }

      if (index >= 0 && index < todos.length) {
        todos[index].text = text;
        this.saveTodos();
        this.notifyObservers();
      } else {
        console.error("Invalid index: " + index);
      }
    } else {
      console.error("Current list ID is not set or does not exist in the lists map.");
    }
  }


  updateListName(listId, newName) {
    if (!this.lists.has(newName) && newName.length > 0) {
      const listDetails = this.lists.get(listId);
      this.listNames.delete(listDetails.name);
      listDetails.name = newName;
      this.listNames.add(newName);
      this.saveTodos();
      this.notifyObservers();
    } else {
      console.log("Nie można zmienić nazwy listy: Nowa nazwa jest pusta lub już istnieje.");
    }
  }

  deleteTodoItem(index) {
    if (this.currentListId && this.lists.has(this.currentListId)) {
      const todos = this.lists.get(this.currentListId).todos;
      if (index >= 0 && index < todos.length) {
        todos.splice(index, 1);
        this.saveTodos();
        this.notifyObservers();
      }
    }
  }

  toggleTodoItemCompleted(index) {
    const todos = this.lists.get(this.currentListId).todos;
    if (index >= 0 && index < todos.length) {
      todos[index].completed = !todos[index].completed;
      this.saveTodos();
      this.notifyObservers();
    }
  }

  toggleTodoListCompleted(listId) {
    if (this.lists.has(listId)) {
      const list = this.lists.get(listId);
      list.completed = !list.completed;
      this.saveTodos();
      this.notifyObservers();
    } else {
      console.error("List not found: " + listId);
    }
  }

  saveTodos() {
    localStorage.setItem("todoLists", JSON.stringify([...this.lists]));
  }

  changeList(newListId) {
    if (this.lists.has(newListId)) {
      this.currentListId = newListId;
      this.notifyObservers();
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
    this.saveTodos();
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
      this.saveTodos();
      this.notifyObservers();
    }
  }

  generateId() {
    return crypto.randomUUID();
  }

}