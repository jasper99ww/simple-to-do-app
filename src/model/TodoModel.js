export class TodoModel {

  constructor() {
    this.todos = JSON.parse(localStorage.getItem("todos")) || [];
    this.observers = [];
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  notifyObservers() {
    this.observers.forEach(observer => observer.update());
  }

  addTodo(todo) {
    this.todos.push(todo);
    this.saveTodos();
    this.notifyObservers();
  }

  deleteTodoItem(index) {
    this.todos = this.todos.filter((_, i) => i !== index);
    this.saveTodos();
    this.notifyObservers();
  }

  toggleTodoItemCompleted(index) {
    this.todos[index].completed = !this.todos[index].completed;
    this.saveTodos();
    this.notifyObservers();
  }

  saveTodos() {
    localStorage.setItem("todos", JSON.stringify(this.todos));
  }
}