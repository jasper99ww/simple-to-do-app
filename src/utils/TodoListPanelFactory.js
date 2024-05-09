import { trashIcon, doneIcon, editIcon, dragIcon } from './Icons.js';

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
    container.appendChild(button);
  }

  addDeleteButton(container) {
    const button = document.createElement('button');
    button.className = 'delete-list-btn';
    button.innerHTML = trashIcon;
    container.appendChild(button);
  }

  addDragButton(container){
    const button = document.createElement('button');
    button.className = 'drag-btn';
    button.innerHTML = dragIcon;
    container.appendChild(button);
  }
}
