import { trashIcon, doneIcon } from './icons.js';

export class TodoItemFactory {
  
  constructor(model) {
    this.model = model
  }

  createTodoItem(todo, index) {
    const li = document.createElement('li');
    li.id = index;
    li.className = 'todo';
    this.addCheckbox(li, todo, index);
    this.addTextLabel(li, todo, index);
    this.addDeleteButton(li, index);
    return li;
  }

  addCheckbox(li, todo, index) {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `todo-${index}`;
    checkbox.checked = todo.completed;
    li.appendChild(checkbox);

    // Tworzenie niestandardowej etykiety dla checkboxa wraz z SVG
    const labelForCheckbox = document.createElement('label');
    labelForCheckbox.className = 'custom-checkbox';
    labelForCheckbox.htmlFor = checkbox.id;
    labelForCheckbox.innerHTML = doneIcon;
    li.appendChild(labelForCheckbox);
  }

  addTextLabel(li, todo, index) {
    const label = document.createElement('label');
    label.className = 'todo-text';
    label.htmlFor = `todo-${index}`;
    label.textContent = todo.text;
    li.appendChild(label);
  }

  addDeleteButton(li, index) {
    const button = document.createElement('button');
    button.className = 'delete-button';
    button.innerHTML = trashIcon;
    li.appendChild(button);
  }
}