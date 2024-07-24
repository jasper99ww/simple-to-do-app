import { TodoView } from '../../view/TodoView';
import { TodoAppModel } from '../../model/TodoAppModel';
import { TodoController } from '../../controller/TodoController';
import { EventTypes } from '../../utils/eventTypes';
import { SortableHandler } from '../../utils/SortableHandler';
import { DarkModeHandler } from '../../utils/DarkModeHandler';
import { TodoItemFactory } from '../../factory/TodoItemFactory';

jest.mock('../../utils/DarkModeHandler');
jest.mock('../../utils/setCursorToEnd');
jest.mock('../../utils/toast');
jest.mock('../../factory/TodoItemFactory');
jest.mock('../../utils/SortableHandler');

jest.mock('../../model/TodoAppModel', () => {
  return {
    TodoAppModel: jest.fn().mockImplementation(() => {
      return {
        observerManager: {
          addObserver: jest.fn(),
          notifyObservers: jest.fn()
        },
        getTodos: jest.fn().mockReturnValue([]),
        addTodo: jest.fn(),
        getCurrentListName: jest.fn().mockReturnValue('Default List'),
      };
    })
  };
});

jest.mock('../../controller/TodoController', () => {
  return {
    TodoController: jest.fn().mockImplementation((model) => {
      return {
        addObserver: jest.fn(),
        getTodos: model.getTodos,
        addTodo: model.addTodo,
        deleteTodoItem: jest.fn(),
        updateTodoName: jest.fn(),
        toggleTodoItemCompleted: jest.fn(),
        reorderItems: jest.fn(),
        getCurrentListName: model.getCurrentListName,
        checkListsExistence: jest.fn()
      };
    })
  };
});

function setupDocumentBody() {
  document.body.innerHTML = `
    <div id="main-container">
      <form id="todo-input-form">
        <input type="text" id="todo-input" />
        <button type="submit" id="add-todo-btn">Add</button>
      </form>
      <ul id="todo-list"></ul>
      <div class="todo-container"></div>
      <div class="prompt-container" style="display: none;"></div>
      <p id="current-list-name"></p>
    </div>
  `;
}

describe('TodoView', () => {
  let model, controller, view;

  beforeEach(() => {
    setupDocumentBody();
    model = new TodoAppModel();
    controller = new TodoController(model);
    view = new TodoView(controller);

    model.observerManager = {
      addObserver: jest.fn(),
      notifyObservers: jest.fn()
    };
  });

  describe('Initialization', () => {
    test('should cache DOM elements', () => {
      expect(view.todoInputForm).toBeInstanceOf(HTMLElement);
      expect(view.todoList).toBeInstanceOf(HTMLElement);
      expect(view.currentListNameDisplay).toBeInstanceOf(HTMLElement);
    });

    test('should attach submit event listener to form', () => {
      const mockEvent = new Event('submit');
      const spy = jest.spyOn(view, 'handleAddTodo');
      view.todoInputForm.dispatchEvent(mockEvent);
      expect(spy).toHaveBeenCalled();
    });
    
    test('should attach click event listener to todo list', () => {
      const mockEvent = new MouseEvent('click');
      const spy = jest.spyOn(view, 'handleTodoActions');
      view.todoList.dispatchEvent(mockEvent);
      expect(spy).toHaveBeenCalled();
    });
    
    test('should attach change event listener to todo list', () => {
      const mockEvent = new Event('change');
      const spy = jest.spyOn(view, 'handleTodoCompletionToggle');
      view.todoList.dispatchEvent(mockEvent);
      expect(spy).toHaveBeenCalled();
    });

    test('should setup sortable functionality', () => {
      
      SortableHandler.mockImplementation((container, handle, callback) => {
        mockSortableHandlerCallback = callback;
      });
  
      view.setupSortable();
  
      jest.spyOn(view, 'updateItemOrder');
  
      if (mockSortableHandlerCallback) {
        mockSortableHandlerCallback();
      }
  
      expect(SortableHandler).toHaveBeenCalledWith(
        view.todoList, '.drag-btn', expect.any(Function)
      );
  
      expect(view.updateItemOrder).toHaveBeenCalled();
    });
  });
    

  describe('Event Handlers', () => {
    test('handleAddTodo should prevent default and add todo', () => {
      const preventDefault = jest.fn();
      const mockEvent = { preventDefault };
      view.todoInputForm.querySelector('input').value = 'New Todo';
      view.handleAddTodo(mockEvent);
      expect(preventDefault).toHaveBeenCalled();
      expect(model.addTodo).toHaveBeenCalled();
    });

    test('should handle label events correctly when editing', () => {

      const todoItem = document.createElement('li');
      todoItem.setAttribute('data-index', '1');
      document.body.appendChild(todoItem);
    
      const todoText = document.createElement('div');
      todoText.className = 'todo-text';
      todoItem.appendChild(todoText);
    
      const editButton = document.createElement('button');
      editButton.className = 'edit-btn';
      todoItem.appendChild(editButton);
    
      jest.spyOn(view, 'editTodoItem');
      view.handleTodoActions({ target: editButton });
    
      const clickEvent = new MouseEvent('click');
      todoText.dispatchEvent(clickEvent);
      expect(todoText.contentEditable).toBe("true");
    
      todoText.textContent = " New text ";
      const blurEvent = new FocusEvent('blur');
      todoText.dispatchEvent(blurEvent);
    
      expect(todoText.contentEditable).toBe("false");
      expect(view.controller.updateTodoName).toHaveBeenCalledWith(parseInt(todoItem.dataset.index, 10), "New text".trim());
    });
    
  
    test('should call deleteTodoItem when delete button is clicked', () => {
      const todoItem = document.createElement('li');
      todoItem.setAttribute('data-index', '2');
  
      document.body.appendChild(todoItem);
  
      const deleteButton = document.createElement('button');
      deleteButton.className = 'delete-btn';
      todoItem.appendChild(deleteButton);
  
      const mockEvent = { target: deleteButton };
      jest.spyOn(view, 'deleteTodoItem');
      view.handleTodoActions(mockEvent);
      expect(view.deleteTodoItem).toHaveBeenCalledWith(deleteButton);
    });


    test('handleTodoCompletionToggle should toggle todo completion', () => {
      const todoItem = document.createElement('li');
      todoItem.setAttribute('data-index', '0');

      view.todoList.appendChild(todoItem);
  
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'toggle-checkbox';
      todoItem.appendChild(checkbox);
  
      jest.spyOn(controller, 'toggleTodoItemCompleted');

      checkbox.addEventListener('change', e => view.handleTodoCompletionToggle(e));
      const changeEvent = new Event('change', { bubbles: true });
      checkbox.dispatchEvent(changeEvent);
  
      expect(controller.toggleTodoItemCompleted).toHaveBeenCalledWith(0);
    });
  });

  test('updateItemOrder should call reorderItems with correct order', () => {
   
    const item1 = document.createElement('li');
    const item2 = document.createElement('li');
    item1.dataset.index = '1';
    item2.dataset.index = '2';
    view.todoList.appendChild(item1);
    view.todoList.appendChild(item2);
  
    jest.spyOn(view.controller, 'reorderItems');
  
    view.updateItemOrder();
  
    expect(controller.reorderItems).toHaveBeenCalledWith(['1', '2']);
  });

  describe('update method', () => {
    test('should call render on UPDATE_TODO event', () => {
      jest.spyOn(view, 'render');
      view.update({ eventType: EventTypes.UPDATE_TODO });
      expect(view.render).toHaveBeenCalled();
    });

    test('should call displayNoLists on LISTS_EMPTY event', () => {
      jest.spyOn(view, 'displayNoLists');
      view.update({ eventType: EventTypes.LISTS_EMPTY });
      expect(view.displayNoLists).toHaveBeenCalled();
    });

    test('should call displayListsExist on LISTS_EXIST event', () => {
      jest.spyOn(view, 'displayListsExist');
      view.update({ eventType: EventTypes.LISTS_EXIST });
      expect(view.displayListsExist).toHaveBeenCalled();
    });

    test('should update current list name on LIST_CHANGED event', () => {
      jest.spyOn(view, 'updateCurrentListName');
      view.update({ eventType: EventTypes.LIST_CHANGED });
      expect(view.updateCurrentListName).toHaveBeenCalled();
    });

    test('should display an error on ERROR_TODO event', () => {
      const errorMessage = 'Error occurred';
      jest.spyOn(view, 'displayError');
      view.update({ eventType: EventTypes.ERROR_TODO, message: errorMessage });
      expect(view.displayError).toHaveBeenCalledWith(errorMessage);
    });
  });

  describe('UI Updates', () => {

    test('render should clear and repopulate todo list', () => {
      controller.getTodos = jest.fn().mockReturnValue([
        { id: 1, text: 'Task 1', completed: false },
        { id: 2, text: 'Task 2', completed: true }
      ]);
  
      const todoList = document.getElementById('todo-list');
      view.todoList = todoList;
      jest.spyOn(todoList, 'appendChild').mockImplementation(() => {});
  
      view.render();
      expect(todoList.appendChild).toHaveBeenCalledTimes(2);
    });

    test('displayNoLists should show no lists message', () => {
      view.displayNoLists();
      expect(view.emptyPrompt.style.display).toBe('flex');
      expect(view.content.style.display).toBe('none');
    });

    test('displayListsExist should show the list container', () => {
      view.displayListsExist();
      expect(view.emptyPrompt.style.display).toBe('none');
      expect(view.content.style.display).toBe('flex');
    });

    test('updateCurrentListName should update the display', () => {
      const newName = 'New List Name';
      model.getCurrentListName.mockReturnValue(newName);
      view.updateCurrentListName();
      expect(view.currentListNameDisplay.textContent).toBe(newName);
    });
  
    test('updateCurrentListName should display "No current list name" when there is no current list name', () => {
      model.getCurrentListName.mockReturnValue(null);
      view.updateCurrentListName();
      expect(view.currentListNameDisplay.textContent).toBe("No current list name");
    });
  });
  });