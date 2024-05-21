// import { deleteIcon, doneIcon, editIcon, dragIcon } from './Icons.js';
import deleteIcon from '../assets/icons/delete.svg';
import doneIcon from '../assets/icons/done.svg';
import editIcon from '../assets/icons/edit.svg';
import dragIcon from '../assets/icons/drag.svg';

export class TodoListPanelFactory {
  
  createTodoListPanel(list, listId) {
    const li = document.createElement('li');
    li.className = 'list-item';
    li.dataset.listId = listId;
    li.draggable = true;

    this.addCheckbox(li, list.completed, listId);
    this.addTextLabel(li, list.name, listId);
    this.addIconContainer(li, listId);
    return li;
  }

  addCheckbox(li, completed, listId) {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = completed;
    checkbox.id = `list-checkbox-${listId}`;
    checkbox.setAttribute('aria-label', `Mark list as ${completed ? 'incomplete' : 'complete'}`); // Adding aria-label
    li.appendChild(checkbox);

    const labelForCheckbox = document.createElement('label');
    labelForCheckbox.className = 'custom-checkbox';
    labelForCheckbox.htmlFor = checkbox.id;
    labelForCheckbox.innerHTML = doneIcon;
    li.appendChild(labelForCheckbox);
  }

  addTextLabel(li, text, listId) {
    const label = document.createElement('label');
    label.className = 'todo-list-text';
    label.textContent = text;
    li.appendChild(label);
  }

  addIconContainer(li) {
    const container = document.createElement('div');
    container.className = 'icon-container';

    this.addEditButton(container);
    this.addDeleteButton(container);
    this.addDragButton(container);

    li.appendChild(container);
  }

  addEditButton(container) {
    const button = document.createElement('button');
    button.className = 'edit-list-btn';
    button.innerHTML = editIcon;
    button.setAttribute('aria-label', 'Edit list');
    container.appendChild(button);
  }

  addDeleteButton(container) {
    const button = document.createElement('button');
    button.className = 'delete-list-btn';
    button.innerHTML = deleteIcon;
    button.setAttribute('aria-label', 'Delete list');
    container.appendChild(button);
  }

  addDragButton(container){
    const button = document.createElement('button');
    button.className = 'drag-btn';
    button.innerHTML = dragIcon;
    button.setAttribute('aria-label', 'Drag list');
    container.appendChild(button);
  }
}
