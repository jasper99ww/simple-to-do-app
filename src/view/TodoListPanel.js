import { EventTypes } from '../utils/eventTypes.js'; 
import { TodoListPanelFactory } from '../factory/TodoListPanelFactory.js';
import { SidebarHandler } from '../utils/SidebarHandler.js';
import { SearchHandler } from '../utils/SearchHandler.js';
import { SortableHandler } from '../utils/SortableHandler.js';
import saveIcon from '../assets/icons/save.svg';
import { setCursorToEnd } from '../utils/setCursorToEnd.js';
import { showToast } from '../utils/toast.js';
import { ToastTypes } from '../utils/toastTypes.js';

export class TodoListPanel {

  constructor(controller) {
    this.controller = controller;
    this.controller.addObserver(this);
    this.factory = new TodoListPanelFactory();
    this.sidebarHandler = new SidebarHandler();
    this.searchHandler = new SearchHandler(this.render.bind(this));
    this.activeListItem = null;
    this.currentQuery = '';

    this.cacheDomElements();
    this.setupEventListeners();
    this.setupSortable();
    this.render();
  }

  cacheDomElements() {
    this.firstListForm = document.getElementById("first-list-form");
    this.listForm = document.getElementById("list-form");
    this.listContainer = document.getElementById("todo-lists-container");
  }

  // Setup event listeners for form submission and list container interactions
  setupEventListeners() {
    this.firstListForm.addEventListener('submit', e => this.handleAddList(e, "first-list-input"));
    this.listForm.addEventListener('submit', e => this.handleAddList(e, "new-list-input"));
    this.listContainer.addEventListener('click', e => this.handleListActions(e));
    this.listContainer.addEventListener('change', e => this.handleListChange(e));
  }

  update(event) {
    switch (event.eventType) {
        case EventTypes.UPDATE_LIST:
          console.log("UPDATE LITS")
          this.render();
          break;
        case EventTypes.LIST_CHANGED:
          this.setActiveList();
          break;
        case EventTypes.ERROR_LIST:
          this.displayError(event.message);
          break;
    }
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
    this.controller.reorderLists(newListOrder);
  }

  // Handle creating a list
  handleAddList(e, inputId) {
    e.preventDefault();
    const newListInput = document.getElementById(inputId);
    const newListName = newListInput.value.trim();
    this.controller.addList(newListName);
    newListInput.value = "";
  }

  // Handle list-related actions (edit, delete, select)
  handleListActions(e) {
    const editButton = e.target.closest(".edit-list-btn");
    const deleteButton = e.target.closest(".delete-list-btn");
    const listItemLabel = e.target.closest(".todo-list-text");

    if (editButton) {
      this.editList(editButton);
    } else if (deleteButton) {
      this.deleteList(deleteButton);
    } else if (listItemLabel) {
      this.selectList(listItemLabel);
    }
}

  // Handle click on the edit button
  editList(button) {
    const listItem = button.closest("li");
    const listId = listItem.dataset.listId;
    const label = listItem.querySelector('.todo-list-text');
    label.contentEditable = "true";
    setCursorToEnd(label);
    button.innerHTML = saveIcon;

    label.addEventListener('click', event => event.preventDefault());

    label.onblur = () => {
      label.contentEditable = "false";
      const newListName = label.textContent.trim();
      this.controller.updateListName(listId, newListName);
    };
  }

   // Handle click on the delete button
  deleteList(button) {
    const listItem = button.closest("li");
    const listId = listItem.dataset.listId;
    this.controller.deleteList(listId);
  }

  // Handle list selection
  selectList(listItemLabel) {
    const listItem = listItemLabel.closest("li");
    const listId = listItem.dataset.listId;
    console.log("list id is " + listId)
    this.controller.changeCurrentList(listId);
}

  // Handle change events for list items
  handleListChange(e) {
    if (e.target.type === "checkbox") {
      const listItem = e.target.closest('li');
      const listId = listItem.dataset.listId;
      this.controller.toggleListCompletion(listId);
    }
  }

  // Render the list panel filtered by search query
  render(query = this.currentQuery) {
    this.currentQuery = query;
    this.listContainer.innerHTML = '';
    const lists = this.controller.getLists(query);
    lists.forEach( (list) => {
        const listItem = this.factory.createTodoListPanel(list, list.id);
        if (list.id === this.controller.getCurrentListId()) {
          listItem.classList.add('active');
        }
        this.listContainer.appendChild(listItem);
    });
  }

  setActiveList(){
    const currentListId = this.controller.getCurrentListId();
    const currentItem = this.listContainer.querySelector(`[data-list-id="${currentListId}"]`);

    if (this.activeListItem && this.activeListItem !== currentItem) {
        this.activeListItem.classList.remove('active');
    }

    if (currentItem) {
        currentItem.classList.add('active');
        this.activeListItem = currentItem; 
    }
  }

  displayError(message) {
    showToast(message, ToastTypes.ERROR);
  }
}