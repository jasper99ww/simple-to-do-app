import { TodoItemFactory } from '../utils/TodoItemFactory.js';
import { SortableHandler } from '../utils/SortableHandler.js';
import { DarkModeHandler } from '../utils/DarkModeHandler.js';
import saveIcon from '../assets/icons/save.svg';
import { setCursorToEnd } from '../utils/setCursorToEnd.js';
import { showToast } from '../utils/toast.js';

export class TodoView {

  constructor(model) {
    this.model = model;
    this.model.addObserver(this);
    this.factory = new TodoItemFactory(model);
    this.darkModeHandler = new DarkModeHandler();

    this.cacheDomElements();
    this.setupEventListeners();
    this.setupSortable();
    this.update('update');
  }

  cacheDomElements() {
    this.todoInputForm = document.getElementById("todo-input-form");
    this.todoList = document.getElementById("todo-list");
    this.content = document.querySelector(".todo-container");
    this.emptyPrompt = document.querySelector(".prompt-container");
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
    this.model.reorderItems(this.model.currentListId, newOrder);
  }

  // Handle creating a new todo item
  handleAddTodo(e) {
    e.preventDefault();
    const todoText = this.todoInputForm.querySelector('input').value.trim();
    if (todoText.length > 0) {
      this.model.addTodo({
        text: todoText,
        completed: false
      });
      this.todoInputForm.querySelector('input').value = "";
    }
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
    const todos = this.model.lists.get(this.model.currentListId)?.todos || [];
    todos.forEach((todo, index) => this.todoList.appendChild(this.factory.createTodoItem(todo, index)));
  }

  // Update the UI
  update(eventType, data) {

    console.log("DOSTANO UPDATE - TodoView")
    switch (eventType) {
      case 'update':
        this.render();
        this.updateViewBasedOnCurrentList();
        break;
      case 'error':
        showToast(data, 'error');
        break;
      case 'error-text-empty':
        this.restoreTodoText(data);
        showToast("Todo name cannot be empty.", "error");
        break;
      default:
        this.render();
        break;
    }
}

  // Restore previous todo text if the new text is empty 
  restoreTodoText(index) {
    const todoElement = document.querySelector(`[data-index='${index}'] .todo-text`);
    if (todoElement && this.model.lists.has(this.model.currentListId)) {
        const todo = this.model.lists.get(this.model.currentListId).todos[index];
        todoElement.textContent = todo.text;  // Restore previous text
    }
  }

  updateViewBasedOnCurrentList() {
    const currentListId = this.model.currentListId;
    if (currentListId) {
      const currentList = this.model.lists.get(currentListId);
      document.getElementById('current-list-name').textContent = currentList ? 
      currentList.name : 'No active list';
      this.content.style.display = 'flex';
      this.emptyPrompt.style.display = 'none';
    } else {
      document.getElementById('current-list-name').textContent = 'No active list';
      this.content.style.display = 'none';
      this.emptyPrompt.style.display = 'flex';
    }
  }
}

