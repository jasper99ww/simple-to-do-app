import { TodoModel } from './model/TodoModel.js';
import { TodoView } from './view/TodoView.js';
import { TodoListPanel } from './view/TodoListPanel.js';

document.addEventListener('DOMContentLoaded', () => {

  const lists = JSON.parse(localStorage.getItem('todoLists') || '{}');
  const content = document.querySelector('.flex-container');
  const emptyPrompt = document.querySelector('.flex-container-prompt');

  // Sprawdzenie, czy obiekt 'lists' jest pusty
  if (Object.keys(lists).length === 0) {
    console.log("No lists: " + JSON.stringify(lists));
    content.style.display = 'none';
    emptyPrompt.style.display = 'flex'; // Pokaż jako flex, aby aktywować Flexbox
  } else {
    console.log("Lists exist");
    content.style.display = 'flex'; // Pokaż content
    emptyPrompt.style.display = 'none';
  }



  const model = new TodoModel();
  const view = new TodoView(model);
  const listPanel = new TodoListPanel(model);

 
  
});
