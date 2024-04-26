import { TodoItemFactory } from '../utils/TodoItemFactory.js';

export class TodoView {
  
  constructor(model) {
      this.model = model;
      this.model.addObserver(this);
      this.factory = new TodoItemFactory(model);
      this.todoList = document.getElementById("todo-list");
      this.addTodoForm = document.querySelector("form");
      this.setupEventListeners();
      this.render(this.model.todos);
  }

  setupEventListeners() {
      this.addTodoForm.addEventListener('submit', (e) => this.handleAdd(e));
      this.todoList.addEventListener('click', (e) => this.handleItemClick(e));
      this.todoList.addEventListener('change', (e) => this.handleItemChange(e));
  }

  handleAdd(e) {
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
      if (e.target.closest(".delete-button")) {
          const todoId = e.target.closest("li").id;
          const index = parseInt(todoId.replace("todo-", ""), 10);
          console.log('do usunieca indeks to ' + index);
          this.model.deleteTodoItem(index);
      }
  }

  handleItemChange(e) {
      if (e.target.type === "checkbox") {
          const todoId = e.target.closest("li").id;
          const index = parseInt(todoId.replace("todo-", ""), 10);
          this.model.toggleTodoItemCompleted(index);
      }
  }

  render(todos) {
      this.todoList.innerHTML = '';
      todos.forEach((todo, index) => {
          const todoItem = this.factory.createTodoItem(todo, index);
          this.todoList.appendChild(todoItem);
      });
  }

  update() {
      this.render(this.model.todos);
  }
}
