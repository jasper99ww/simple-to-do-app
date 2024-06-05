import deleteIcon from '../assets/icons/delete.svg';
import doneIcon from '../assets/icons/done.svg';
import editIcon from '../assets/icons/edit.svg';
import dragIcon from '../assets/icons/drag.svg';

export class TodoItemFactory {
  
  createTodoItem(todo, index) {
    const li = document.createElement('li');
    li.dataset.index = index;
    li.className = 'todo';

    this.addCheckbox(li, todo, index);
    this.addTextLabel(li, todo, index);
    this.addIconContainer(li);
    return li;
  }

  addCheckbox(li, todo, index) {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `todo-checkbox-${index}`;
    checkbox.checked = todo.completed;
    checkbox.setAttribute('aria-label', `Mark task as ${todo.completed ? 'incomplete' : 'complete'}`);
    li.appendChild(checkbox);

    const labelForCheckbox = document.createElement('label');
    labelForCheckbox.className = 'custom-checkbox';
    labelForCheckbox.htmlFor = checkbox.id;
    labelForCheckbox.innerHTML = doneIcon;
    li.appendChild(labelForCheckbox);
  }

  addTextLabel(li, todo, index) {
    const label = document.createElement('label');
    label.className = 'todo-text';
    label.htmlFor = `todo-checkbox-${index}`;
    label.textContent = todo.text;
    li.appendChild(label);
  }

  addIconContainer(li){
    const container = document.createElement('div');
    container.className = 'icon-container';
    this.addEditButton(container);
    this.addDeleteButton(container);
    this.addDragButton(container);
    li.appendChild(container);
  }

  addEditButton(container) {
    const button = document.createElement('button');
    button.className = 'edit-btn';
    button.innerHTML = editIcon;
    button.setAttribute('aria-label', 'Edit todo');
    button.setAttribute('data-tooltip', 'Edit this task');
    container.appendChild(button);
  }

  addDeleteButton(container) {
    const button = document.createElement('button');
    button.className = 'delete-btn';
    button.innerHTML = deleteIcon;
    button.setAttribute('aria-label', 'Delete todo');
    button.setAttribute('data-tooltip', 'Delete this task');
   
    container.appendChild(button);
  }

  addDragButton(container){
    const button = document.createElement('button');
    button.className = 'drag-btn';
    button.innerHTML = dragIcon;
    button.setAttribute('aria-label', 'Drag todo');
    button.setAttribute('data-tooltip', 'Drag this task');
    container.appendChild(button);
  }
}