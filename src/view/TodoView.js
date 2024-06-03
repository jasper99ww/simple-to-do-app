import { TodoItemFactory } from '../utils/TodoItemFactory.js';
import { SortableHandler } from '../utils/SortableHandler.js';
import { DarkModeHandler } from '../utils/DarkModeHandler.js';
import { TooltipHandler } from '../utils/TooltipHandler.js';
import saveIcon from '../assets/icons/save.svg';
import { setCursorToEnd } from '../utils/SetCursorToEnd.js';

export class TodoView {

  constructor(model) {
    this.model = model;
    this.model.addObserver(this);
    this.factory = new TodoItemFactory(model);
    this.darkModeHandler = new DarkModeHandler();
    this.tooltipHandler = new TooltipHandler();


    this.todoInputForm = document.getElementById("todo-input-form");
    this.todoList = document.getElementById("todo-list");
    this.content = document.querySelector(".todo-container");
    this.emptyPrompt = document.querySelector(".prompt-container");
    this.setupEventListeners();
    this.setupSortable();
    this.update();
    
  }

  // Setup event listeners for form submission and todo list interactions
  setupEventListeners() {
      this.todoInputForm.addEventListener('submit', (e) => this.handleAddTodo(e));
      this.todoList.addEventListener('click', (e) => this.handleItemClick(e));
      this.todoList.addEventListener('change', (e) => this.handleItemChange(e));
  }

  // Setup sortable feature for todo items
  setupSortable() {
    this.sortableHandler = new SortableHandler(
      this.todoList,
      '.drag-btn',
      this.updateItemOrder.bind(this)
    );
  }

  // Update the model order after drag-and-drop operation
  updateItemOrder() {
    const newOrder = Array.from(this.todoList.children).map(item => item.dataset.index);
    this.model.reorderItems(this.model.currentListId, newOrder);
    this.model.notifyObservers();
  }

  // Handle creating a new todo item
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

  // Handle todo-related actions (edit, delete)
  handleItemClick(e) {
    if (this.handleEditButtonClick(e)) return;
    if (this.handleDeleteButtonClick(e)) return;
  }

  handleEditButtonClick(e) {
    const editButton = e.target.closest(".edit-btn");
    if (editButton) {
      console.log("Edytuj kliknięty");
      const todoItem = editButton.closest('li');
      const index = parseInt(todoItem.dataset.index, 10);
      const label = todoItem.querySelector('.todo-text');
      label.contentEditable = "true";
      setCursorToEnd(label);
      editButton.innerHTML = saveIcon;

      label.addEventListener('click', event => {
        event.preventDefault();
      });

      label.onblur = () => {
        console.log("OPUSCILO")
        label.contentEditable = "false";
        const newText = label.textContent.trim();
        this.model.updateTodoText(index, newText);
      };
    }
  }

  handleDeleteButtonClick(e) {
    const deleteButton = e.target.closest(".delete-btn");
    if (deleteButton) {
      const todoItem = deleteButton.closest('li');
      const index = parseInt(todoItem.dataset.index, 10);
      this.model.deleteTodoItem(index);
    }
  }

  // Handle changing the completed status of a todo item
  handleItemChange(e) {
    if (e.target.type === "checkbox") {
      const todoItem = e.target.closest('li');
      const index = parseInt(todoItem.dataset.index, 10);
      this.model.toggleTodoItemCompleted(index);
    }
  }

  // Render the todo list
  render() {
    this.todoList.innerHTML = '';
  
    if (this.model.currentListId && this.model.lists.has(this.model.currentListId)) {
      const todos = this.model.lists.get(this.model.currentListId).todos;
      todos.forEach((todo, index) => {
        const todoItem = this.factory.createTodoItem(todo, index);
        this.todoList.appendChild(todoItem);
      });
    } else {
      console.log("Nie znaleziono listy lub bieżąca lista jest niezdefiniowana.");
    }

    this.tooltipHandler.initializeTooltips(this.todoList);
  }

  // Update the UI
  update() {
    this.render();
    this.updateViewBasedOnCurrentList();
  }

  updateViewBasedOnCurrentList() {
    const currentListId = this.model.currentListId;

    if (currentListId) {
      const currentList = this.model.lists.get(currentListId);
      document.getElementById('current-list-name').textContent = currentList ? 
      currentList.name : 'No active list';
      this.content.style.display = 'flex';
      this.emptyPrompt.style.display = 'none';
      console.log("111");
    } else {
      document.getElementById('current-list-name').textContent = 'No active list';
      this.content.style.display = 'none';
      this.emptyPrompt.style.display = 'flex';
      console.log("222");
    }
  }
}

