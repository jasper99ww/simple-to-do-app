import { trashIcon, doneIcon } from './icons.js';

export class TodoListPanelFactory {
  
  createTodoListPanel(list, index) {
    const li = document.createElement('li');
    li.className = 'list-item';

    console.log('list to  ' + list)

    this.addCheckbox(li, list.completed, index);
    this.addTextLabel(li, list.name, index);
    this.addDeleteButton(li, index);

    return li;
  }

  addCheckbox(li, completed, index) {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = completed;
    li.appendChild(checkbox);

    // Tworzenie niestandardowej etykiety dla checkboxa wraz z SVG
    const labelForCheckbox = document.createElement('label');
    labelForCheckbox.className = 'custom-checkbox';
    labelForCheckbox.htmlFor = checkbox.id;
    labelForCheckbox.innerHTML = doneIcon;
    li.appendChild(labelForCheckbox);
  }

  addTextLabel(li, text, index) {
    const label = document.createElement('label');
    label.className = 'todo-list-text';
    label.htmlFor = `todo-list-${index}`;
    console.log("A LABEL TO " + text)
    label.textContent = text;
    li.appendChild(label);
  }

  addDeleteButton(li, index) {
    const button = document.createElement('button');
    button.className = 'todo-list-delete-btn';
    button.innerHTML = trashIcon;
    li.appendChild(button);
  }
}
