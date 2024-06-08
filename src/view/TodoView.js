import { EventTypes } from '../utils/eventTypes.js'; 
import { TodoItemFactory } from '../utils/TodoItemFactory.js';
import { SortableHandler } from '../utils/SortableHandler.js';
import { DarkModeHandler } from '../utils/DarkModeHandler.js';
import saveIcon from '../assets/icons/save.svg';
import { setCursorToEnd } from '../utils/setCursorToEnd.js';
import { showToast } from '../utils/toast.js';
import { ToastTypes } from '../utils/toastTypes.js';

export class TodoView {

  constructor(model) {
    this.model = model;
    this.model.addObserver(this, [
      EventTypes.UPDATE_TODO,
      EventTypes.ERROR_TODO
    ]);
    this.factory = new TodoItemFactory(model);
    this.darkModeHandler = new DarkModeHandler();

    this.cacheDomElements();
    this.setupEventListeners();
    this.setupSortable();
    this.render();
  }

  cacheDomElements() {
    this.todoInputForm = document.getElementById("todo-input-form");
    this.todoList = document.getElementById("todo-list");
  }

  // Setup event listeners for form submission and todo list interactions
  setupEventListeners() {
      this.todoInputForm.addEventListener('submit', e => this.handleAddTodo(e));
      this.todoList.addEventListener('click', e => this.handleTodoActions(e));
      this.todoList.addEventListener('change', e => this.handleTodoCompletionToggle(e));
  }

  // Setup sortable feature for todo items
  setupSortable() {
    this.sortableHandler = new SortableHandler(
      this.todoList,
      '.drag-btn',
      () => this.updateItemOrder()
    );
  }

  // Update the model order after drag-and-drop operation
  updateItemOrder() {
    const newOrder = Array.from(this.todoList.children).map(item => item.dataset.index);
    this.model.reorderItems(newOrder);
  }

  // Handle creating a new todo item
  handleAddTodo(e) {
    e.preventDefault();
    const todoInput = this.todoInputForm.querySelector('input');
    const todoText = this.todoInputForm.querySelector('input').value.trim();
    this.model.addTodo({
        text: todoText,
        completed: false
    });
    todoInput.value = "";
  }

  // Handle todo-related actions (edit, delete)
  handleTodoActions(e) {
    const editButton = e.target.closest(".edit-btn");
    const deleteButton = e.target.closest(".delete-btn");

    if (editButton) {
      this.editTodoItem(editButton);
    } else if (deleteButton) {
      this.deleteTodoItem(deleteButton);
    }
  }

  editTodoItem(button) {
      const todoItem = button.closest('li');
      const index = parseInt(todoItem.dataset.index, 10);
      const label = todoItem.querySelector('.todo-text');
      label.contentEditable = "true";
      setCursorToEnd(label);
      button.innerHTML = saveIcon;

      label.addEventListener('click', event => event.preventDefault());

      label.onblur = () => {
        label.contentEditable = "false";
        const newText = label.textContent.trim();
        this.model.updateTodoName(index, newText);
      };
  }

  deleteTodoItem(button) {
    const todoItem = button.closest('li');
    const index = parseInt(todoItem.dataset.index, 10);
    this.model.deleteTodoItem(index);
  }

  // Handle changing the completed status of a todo item
  handleTodoCompletionToggle(e) {
    if (e.target.type === "checkbox") {
      const todoItem = e.target.closest('li');
      const index = parseInt(todoItem.dataset.index, 10);
      this.model.toggleTodoItemCompleted(index);
    }
  }

  // Render the todo list
  render() {
    this.todoList.innerHTML = '';
    const todos = this.model.getTodos();
    todos.forEach((todo, index) => this.todoList.appendChild(this.factory.createTodoItem(todo, index)));
  }

  // Update the UI
  update(event) {
    console.log("DOSTANO UPDATE - TodoView");
    switch (event.eventType) {
      case EventTypes.UPDATE_TODO:
        this.render();
        break;
      case EventTypes.ERROR_TODO:
        showToast(event.message, ToastTypes.ERROR);
        break;
      default:
        this.render();
        break;
    }
  }

}

