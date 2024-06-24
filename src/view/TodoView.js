import { EventTypes } from '../utils/eventTypes.js'; 
import { TodoItemFactory } from '../factory/TodoItemFactory.js';
import { SortableHandler } from '../utils/SortableHandler.js';
import { DarkModeHandler } from '../utils/DarkModeHandler.js';
import saveIcon from '../assets/icons/save.svg';
import { setCursorToEnd } from '../utils/setCursorToEnd.js';
import { showToast } from '../utils/toast.js';
import { ToastTypes } from '../utils/toastTypes.js';

export class TodoView {

  constructor(controller) {
    this.controller = controller;
    this.controller.addObserver(this);
    this.factory = new TodoItemFactory();
    this.darkModeHandler = new DarkModeHandler();

    this.cacheDomElements();
    this.setupEventListeners();
    this.setupSortable();
    this.controller.checkListsExistence();
    this.updateCurrentListName();
    this.render();
  }

  cacheDomElements() {
    this.todoInputForm = document.getElementById("todo-input-form");
    this.todoList = document.getElementById("todo-list");
    this.content = document.querySelector(".todo-container");
    this.emptyPrompt = document.querySelector(".prompt-container");
    this.currentListNameDisplay = document.getElementById("current-list-name");
  }

  // Setup event listeners for form submission and todo list interactions
  setupEventListeners() {
      this.todoInputForm.addEventListener('submit', e => this.handleAddTodo(e));
      this.todoList.addEventListener('click', e => this.handleTodoActions(e));
      this.todoList.addEventListener('change', e => this.handleTodoCompletionToggle(e));
  }

  update(event) {
    switch (event.eventType) {
      case EventTypes.UPDATE_TODO:
        this.render();
        break;
      case EventTypes.LISTS_EMPTY:
        console.log("LIST EMPTY signal in todoview")
        this.displayNoLists(); 
        break;
      case EventTypes.LISTS_EXIST:
        console.log("LIST EXIST signal in todoview")
          this.displayListsExist();
          break;
      case EventTypes.LIST_CHANGED:
          this.updateCurrentListName();
          break;
      case EventTypes.ERROR_TODO:
         this.displayError(event.message);
         break;
    }
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
    this.controller.reorderItems(newOrder);
  }

  // Handle creating a new todo item
  handleAddTodo(e) {
    e.preventDefault();
    const todoInput = this.todoInputForm.querySelector('input');
    const todoText = this.todoInputForm.querySelector('input').value.trim();
    this.controller.addTodo({
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
        this.controller.updateTodoName(index, newText);
      };
  }

  deleteTodoItem(button) {
    const todoItem = button.closest('li');
    const index = parseInt(todoItem.dataset.index, 10);
    this.controller.deleteTodoItem(index);
  }

  // Handle changing the completed status of a todo item
  handleTodoCompletionToggle(e) {
    if (e.target.type === "checkbox") {
      const todoItem = e.target.closest('li');
      const index = parseInt(todoItem.dataset.index, 10);
      this.controller.toggleTodoItemCompleted(index);
    }
  }

  // Render the todo list
  render() {
    this.todoList.innerHTML = '';
    const todos = this.controller.getTodos();
    todos.forEach((todo, index) => this.todoList.appendChild(this.factory.createTodoItem(todo, index)));
  }

  displayNoLists() {
    this.emptyPrompt.style.display = 'flex';
    this.content.style.display = 'none';
  }

  displayListsExist() {
    this.emptyPrompt.style.display = 'none';
    this.content.style.display = 'flex';
  }

  updateCurrentListName() {
    const currentListName = this.controller.getCurrentListName();
    this.currentListNameDisplay.textContent = currentListName ? currentListName : "No current list name";
  }

  displayError(message) {
    showToast(message, ToastTypes.ERROR);
  }
}

