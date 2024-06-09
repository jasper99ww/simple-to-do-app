import ModelFactory from './factory/ModelFactory.js'; 
import { TodoView } from './view/TodoView.js';
import { TodoListPanel } from './view/TodoListPanel.js';
import './style.css';
import { TooltipHandler } from './utils/TooltipHandler.js';


document.addEventListener('DOMContentLoaded', () => {
  const model = new ModelFactory.createTodoModel();
  const view = new TodoView(model);
  const listPanel = new TodoListPanel(model);
  const tooltipHandler = new TooltipHandler(); 
  tooltipHandler.initializeTooltips();
});
