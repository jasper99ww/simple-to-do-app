import { TodoModel } from './model/TodoModel.js';
import { TodoView } from './view/TodoView.js';

document.addEventListener('DOMContentLoaded', () => {
  const model = new TodoModel();
  const view = new TodoView(model);
});
