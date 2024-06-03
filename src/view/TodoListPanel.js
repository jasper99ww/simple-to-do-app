import { TodoListPanelFactory } from '../utils/TodoListPanelFactory.js';
import { SidebarHandler } from '../utils/SidebarHandler.js';
import { SearchHandler } from '../utils/SearchHandler.js';
import { TooltipHandler } from '../utils/TooltipHandler.js';
import { SortableHandler } from '../utils/SortableHandler.js';
// import { saveIcon } from '../utils/Icons.js';
import saveIcon from '../assets/icons/save.svg';
import { setCursorToEnd } from '../utils/SetCursorToEnd.js';

export class TodoListPanel {

  constructor(model) {
    this.model = model;
    this.model.addObserver(this);
    this.factory = new TodoListPanelFactory(this.model);
    this.sidebarHandler = new SidebarHandler();
    this.searchHandler = new SearchHandler(this.render.bind(this));
    this.tooltipHandler = new TooltipHandler();

    // Cache DOM elements
    this.firstListForm = document.getElementById("first-list-form");
    this.listForm = document.getElementById("list-form");
    this.listContainer = document.getElementById("todo-lists-container");

    this.setupEventListeners();
    this.setupSortable();
    this.render();
  }

  // Setup event listeners for form submission and list container interactions
  setupEventListeners() {
    this.firstListForm.addEventListener('submit', this.handleCreateFirstList.bind(this));
    this.listForm.addEventListener('submit', this.handleCreateList.bind(this));
    this.listContainer.addEventListener('click', this.handleListClick.bind(this));
    this.listContainer.addEventListener('change', this.handleListChange.bind(this));
  }

  // Setup sortable feature for list items
  setupSortable() {
    this.sortableHandler = new SortableHandler(
      this.listContainer,
      '.drag-btn',
      this.updateModelOrder.bind(this)
    );
  }

  // Update the model order after drag-and-drop operation
  updateModelOrder() {
    const newListOrder = Array.from(this.listContainer.children).map(item => item.dataset.listId);
    this.model.reorderLists(newListOrder);
    this.model.notifyObservers();
  }

  // Handle creating the first list
  handleCreateFirstList(e) {
    e.preventDefault();
    const newListInput = document.getElementById("first-list-input");
    const newListName = newListInput.value.trim();
    console.log('dodawanie pierwszej listy' + newListName)
    if (newListName.length > 0) {
      this.model.addList(newListName);
      newListInput.value = "";
    }
  }

  // Handle creating a new list
  handleCreateList(e) {
    e.preventDefault();
    const newListInput = document.getElementById("new-list-input");
    const newListName = newListInput.value.trim();

    if (newListName.length > 0) {
      this.model.addList(newListName);
      newListInput.value = "";
      this.update();
    };
  }

  // Handle list-related actions (edit, delete, select)
  handleListClick(e) {
    if (this.handleEditButtonClick(e)) return;
    if (this.handleDeleteButtonClick(e)) return;
    this.handleListSelection(e);
  }

  // Handle click on the edit button
  handleEditButtonClick(e) {
    const editButton = e.target.closest(".edit-list-btn");
    if (editButton) {
      const listItem = editButton.closest("li");
      const listId = listItem.dataset.listId;
      const label = listItem.querySelector('.todo-list-text');
      label.contentEditable = "true";
      setCursorToEnd(label);
      editButton.innerHTML = saveIcon;

      label.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
      });

      label.onblur = () => {
        label.contentEditable = "false";
        const newListName = label.textContent.trim();
        this.model.updateListName(listId, newListName);
      };
      return true;
    }
    return false;
  }

   // Handle click on the delete button
   handleDeleteButtonClick(e) {
    const deleteButton = e.target.closest(".delete-list-btn");
    if (deleteButton) {
      const listItem = deleteButton.closest("li");
      const listId = listItem.dataset.listId;
      this.model.deleteList(listId);
      return true;
    }
    return false;
  }

  // Handle list selection
  handleListSelection(e) {
    const listItemLabel = e.target.closest(".todo-list-text");
    if (listItemLabel) {
      const listItem = listItemLabel.closest("li");
      const listId = listItem.dataset.listId;
      this.model.changeList(listId);
      this.update();
    }
  }

  // Handle change events for list items
  handleListChange(e) {
    if (e.target.type === "checkbox") {
      const listItem = e.target.closest('li');
      const listId = listItem.dataset.listId;
      this.model.toggleTodoListCompleted(listId);
    }
  }

  // Render the list panel filtered by search query
  render(query = '') {
    this.listContainer.innerHTML = '';

    this.model.lists.forEach((list, id) => {
      if (list.name.toLowerCase().includes(query)) {
        const listItem = this.factory.createTodoListPanel(list, id);
        listItem.dataset.listId = id;
        if (id === this.model.currentListId) {
          listItem.classList.add('active');
        }
        this.listContainer.appendChild(listItem);
      }
    });
  }

  // Update the UI
  update() {
    this.render();
    this.tooltipHandler.initializeTooltips(this.listContainer);
  }
}
