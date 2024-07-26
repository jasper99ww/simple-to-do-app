import { TodoItemFactory } from '../../factory/TodoItemFactory';
import deleteIcon from '../../assets/icons/delete.svg';
import doneIcon from '../../assets/icons/done.svg';
import editIcon from '../../assets/icons/edit.svg';
import dragIcon from '../../assets/icons/drag.svg';

describe('TodoItemFactory', () => {
  let factory;

  beforeEach(() => {
    factory = new TodoItemFactory();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test createTodoItem method
  describe('createTodoItem', () => {
    it('should create and return a complete todo item', () => {
      const todo = { text: 'Learn Jest', completed: true };
      const index = 0;
      const item = factory.createTodoItem(todo, index);

      expect(item).toBeInstanceOf(HTMLElement);
      expect(item.classList.contains('todo')).toBe(true);
      expect(item.dataset.index).toBe(String(index));
      expect(item.childNodes.length).toBeGreaterThan(0);
    });
  });

  // Test addCheckbox method
  describe('addCheckbox', () => {
    it('should add a checkbox input and a label to the list item', () => {
      const li = document.createElement('li');
      const todo = { completed: false, text: 'Test Todo' };
      const index = 0;

      factory.addCheckbox(li, todo, index);

      const checkbox = li.querySelector('input[type="checkbox"]');
      const label = li.querySelector('label.custom-checkbox');

      expect(checkbox).not.toBeNull();
      expect(checkbox.checked).toBe(false);
      expect(checkbox.id).toBe(`todo-checkbox-${index}`);
      expect(label).not.toBeNull();
      expect(label.innerHTML).toContain(doneIcon);
    });
  });

  // Test addTextLabel method
  describe('addTextLabel', () => {
    it('should add a text label to the list item', () => {
      const li = document.createElement('li');
      const todo = { text: 'Test Todo' };
      const index = 0;

      factory.addTextLabel(li, todo, index);

      const label = li.querySelector('label.todo-text');
      expect(label).not.toBeNull();
      expect(label.textContent).toBe(todo.text);
      expect(label.htmlFor).toBe(`todo-checkbox-${index}`);
    });
  });

  // Test addIconContainer method
  describe('addIconContainer', () => {
    it('should add a container with edit, delete, and drag buttons to the list item', () => {
      const li = document.createElement('li');

      factory.addIconContainer(li);

      const container = li.querySelector('.icon-container');
      expect(container).not.toBeNull();
      expect(container.querySelectorAll('button').length).toBe(3);
    });
  });

  // Test addEditButton method
  describe('addEditButton', () => {
    it('should add an edit button to the container', () => {
      const container = document.createElement('div');
      
      factory.addEditButton(container);

      const button = container.querySelector('.edit-btn');
      expect(button).not.toBeNull();
      expect(button.innerHTML).toContain(editIcon);
    });
  });

  // Test addDeleteButton method
  describe('addDeleteButton', () => {
    it('should add a delete button to the container', () => {
      const container = document.createElement('div');
      
      factory.addDeleteButton(container);

      const button = container.querySelector('.delete-btn');
      expect(button).not.toBeNull();
      expect(button.innerHTML).toContain(deleteIcon);
    });
  });

  // Test addDragButton method
  describe('addDragButton', () => {
    it('should add a drag button to the container', () => {
      const container = document.createElement('div');
      
      factory.addDragButton(container);

      const button = container.querySelector('.drag-btn');
      expect(button).not.toBeNull();
      expect(button.innerHTML).toContain(dragIcon);
    });
  });
});
