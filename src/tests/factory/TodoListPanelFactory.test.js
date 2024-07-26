import { TodoListPanelFactory } from '../../factory/TodoListPanelFactory';
import deleteIcon from '../../assets/icons/delete.svg';
import doneIcon from '../../assets/icons/done.svg';
import editIcon from '../../assets/icons/edit.svg';
import dragIcon from '../../assets/icons/drag.svg';

describe('TodoListPanelFactory', () => {
  let factory;

  beforeEach(() => {
    factory = new TodoListPanelFactory();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test createTodoListPanel method
  describe('createTodoListPanel', () => {
    it('should create a list item with checkbox, text label, and icon container', () => {
      const list = { name: 'Test List', completed: false };
      const listId = '1';
      const li = factory.createTodoListPanel(list, listId);

      expect(li.className).toBe('list-item');
      expect(li.dataset.listId).toBe(listId);
      expect(li.children.length).toBeGreaterThan(0);
    });
  });

  // Test addCheckbox method
  describe('addCheckbox', () => {
    it('should add an unchecked checkbox input to the list item when completed is false', () => {
      const li = document.createElement('li');
      factory.addCheckbox(li, false, '1');
  
      const checkbox = li.querySelector('input[type="checkbox"]');
      expect(checkbox).not.toBeNull();
      expect(checkbox.checked).toBe(false);
      expect(checkbox.id).toBe(`list-checkbox-1`);
      expect(checkbox.getAttribute('aria-label')).toBe('Mark list as complete');
    });
  
    it('should add a checked checkbox input to the list item when completed is true', () => {
      const li = document.createElement('li');
      factory.addCheckbox(li, true, '1');
  
      const checkbox = li.querySelector('input[type="checkbox"]');
      expect(checkbox).not.toBeNull();
      expect(checkbox.checked).toBe(true);
      expect(checkbox.id).toBe(`list-checkbox-1`);
      expect(checkbox.getAttribute('aria-label')).toBe('Mark list as incomplete');
    });
  
    it('should append a custom checkbox label with the done icon', () => {
      const li = document.createElement('li');
      factory.addCheckbox(li, false, '1');
  
      const label = li.querySelector('label.custom-checkbox');
      expect(label).not.toBeNull();
      expect(label.htmlFor).toBe('list-checkbox-1');
      expect(label.innerHTML).toContain(doneIcon);
    });
  });

  // Test addTextLabel method
  describe('addTextLabel', () => {
    it('should add a text label to the list item', () => {
      const li = document.createElement('li');
      factory.addTextLabel(li, 'Test List', '1');

      const label = li.querySelector('.todo-list-text');
      expect(label).not.toBeNull();
      expect(label.textContent).toBe('Test List');
    });
  });

  // Test addIconContainer method
  describe('addIconContainer', () => {
    it('should add an icon container with edit, delete, and drag buttons', () => {
      const li = document.createElement('li');
      factory.addIconContainer(li);

      const container = li.querySelector('.icon-container');
      expect(container).not.toBeNull();
      expect(container.children.length).toBe(3);
    });
  });

  // Test button functions method
  describe('addEditButton', () => {
    it('should add an edit button with the correct attributes and icon', () => {
      const container = document.createElement('div');
      factory.addEditButton(container);

      const editBtn = container.querySelector('.edit-list-btn');
      expect(editBtn).not.toBeNull();
      expect(editBtn.className).toContain('edit-list-btn');
      expect(editBtn.getAttribute('aria-label')).toBe('Edit list');
      expect(editBtn.getAttribute('data-tooltip')).toBe('Edit this list');
      expect(editBtn.innerHTML).toContain(editIcon);
    });
  });

  // Test addDeleteButton method
  describe('addDeleteButton', () => {
    it('should add a delete button with the correct attributes and icon', () => {
      const container = document.createElement('div');
      factory.addDeleteButton(container);

      const deleteBtn = container.querySelector('.delete-list-btn');
      expect(deleteBtn).not.toBeNull();
      expect(deleteBtn.className).toContain('delete-list-btn');
      expect(deleteBtn.getAttribute('aria-label')).toBe('Delete list');
      expect(deleteBtn.getAttribute('data-tooltip')).toBe('Delete this list');
      expect(deleteBtn.innerHTML).toContain(deleteIcon);
    });
  });

  // Test addDragButton method
  describe('addDragButton', () => {
    it('should add a drag button with the correct attributes and icon', () => {
      const container = document.createElement('div');
      factory.addDragButton(container);

      const dragBtn = container.querySelector('.drag-btn');
      expect(dragBtn).not.toBeNull();
      expect(dragBtn.className).toContain('drag-btn');
      expect(dragBtn.getAttribute('aria-label')).toBe('Drag list');
      expect(dragBtn.getAttribute('data-tooltip')).toBe('Drag this list');
      expect(dragBtn.innerHTML).toContain(dragIcon);
    });
  });

});
