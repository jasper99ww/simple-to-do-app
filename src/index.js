import ModelFactory from './factory/ModelFactory.js';
import { TodoListPanelController } from './controller/TodoListPanelController.js';
import { TodoController } from './controller/TodoController.js';
import { TodoView } from './view/TodoView.js';
import { TodoListPanel } from './view/TodoListPanel.js';
import './style.css';
import { TooltipHandler } from './utils/TooltipHandler.js';


document.addEventListener('DOMContentLoaded', () => {
  const model = new ModelFactory.createTodoModel();

  const todoListPanelController = new TodoListPanelController(model);
  const todoListPanel = new TodoListPanel(todoListPanelController);

  const todoController = new TodoController(model);
  const todoView = new TodoView(todoController);

  const tooltipHandler = new TooltipHandler(); 
  tooltipHandler.initializeTooltips();
});
