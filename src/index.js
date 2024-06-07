import { TodoModel } from './model/TodoModel.js';
import { TodoView } from './view/TodoView.js';
import { TodoListPanel } from './view/TodoListPanel.js';
import { ListExistenceStateManager } from './utils/ListExistenceStateManager.js';
import './style.css';
import { TooltipHandler } from './utils/TooltipHandler.js';


document.addEventListener('DOMContentLoaded', () => {
  const model = new TodoModel();
  const view = new TodoView(model);
  const listPanel = new TodoListPanel(model);
  const listExistenceStateManager = new ListExistenceStateManager(model);
  const tooltipHandler = new TooltipHandler(); 
  tooltipHandler.initializeTooltips();
});
