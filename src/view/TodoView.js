import { TodoItemFactory } from '../utils/TodoItemFactory.js';

export class TodoView {
  
  constructor(model) {
      this.model = model;
      this.model.addObserver(this);
      this.factory = new TodoItemFactory(model);

      this.todoInputForm = document.getElementById("todo-input-form");
      this.todoList = document.getElementById("todo-list");

      this.setupEventListeners();
      this.render(this.model.todos);
  }

  setupEventListeners() {
        // Dodawanie pierwszej listy
      
        // Dodawanie zadania
        if (this.todoInputForm) {
            this.todoInputForm.addEventListener('submit', (e) => this.handleAddTodo(e));
        }
        // Usuwanie i zmiana statusu zadań
        if (this.todoList) {
          console.log("USTAWIONO LITENREA NA TOD LIST")
            this.todoList.addEventListener('click', (e) => this.handleItemClick(e));
            this.todoList.addEventListener('change', (e) => this.handleItemChange(e));
        }
  }

  handleAddTodo(e) {
    e.preventDefault();
    const todoInput = document.getElementById("todo-input");
    const todoText = todoInput.value.trim();
    if (todoText.length > 0) {
        this.model.addTodo({
            text: todoText,
            completed: false
        });
        todoInput.value = "";
    }
}

  handleItemClick(e) {
    console.log('kliknieto delete btn')
      if (e.target.closest(".delete-btn")) {
          const todoId = e.target.closest("li").id;
          const index = parseInt(todoId.replace("todo-", ""), 10);
          console.log('do usunieca indeks to ' + index);
          this.model.deleteTodoItem(index);
      }
  }

  handleItemChange(e) {
    console.log('kliknieto checkboxa')

      if (e.target.type === "checkbox") {
          const todoId = e.target.closest("li").id;
          const index = parseInt(todoId.replace("todo-", ""), 10);
          this.model.toggleTodoItemCompleted(index);
      }
  }

  render() {
      this.todoList.innerHTML = '';
      const todos = this.model.lists[this.model.currentList].todos;

      if (todos) {
        todos.forEach((todo, index) => {
          const todoItem = this.factory.createTodoItem(todo, index);
          this.todoList.appendChild(todoItem);
        });
      }
  }

  update() {
      this.render();
      document.getElementById('current-list-name').textContent = this.model.currentList;
  }
}
