import { TodoModel } from './model/TodoModel.js';
import { TodoView } from './view/TodoView.js';
import { TodoListPanel } from './view/TodoListPanel.js';
import './style.css';
import { TooltipHandler } from './utils/TooltipHandler.js';

document.addEventListener('DOMContentLoaded', () => {

  const lists = JSON.parse(localStorage.getItem('todoLists') || '{}');
  const content = document.querySelector('.flex-container');
  const emptyPrompt = document.querySelector('.flex-container-prompt');
  
  const model = new TodoModel();
  const view = new TodoView(model);
  const listPanel = new TodoListPanel(model);
  const tooltipHandler = new TooltipHandler(); 
  tooltipHandler.initializeTooltips(document);
});
