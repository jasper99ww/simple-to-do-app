import { StorageService } from '../../service/StorageService';

describe('StorageService', () => {
  let storageService;

  // Mock local storage
  const localStorageMock = (() => {
    let store = {};
    return {
      getItem: jest.fn((key) => store[key] || null),
      setItem: jest.fn((key, value) => {
        store[key] = value.toString();
      }),
      removeItem: jest.fn((key) => {
        delete store[key];
      }),
      clear: jest.fn(() => {
        store = {};
      })
    };
  })();

  beforeEach(() => {
    jest.clearAllMocks();
    storageService = new StorageService();

    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock
    });
    localStorage.clear();
    localStorage.setItem('todoLists', JSON.stringify([['1', { id: '1', name: 'Home', todos: [] }]]));
    localStorage.setItem('currentListId', '1');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test initialize method
  describe('initialize', () => {
    it('should load lists and current list ID upon initialization', () => {
      storageService.initialize();
      expect(localStorage.getItem).toHaveBeenCalledWith('todoLists');
      expect(localStorage.getItem).toHaveBeenCalledWith('currentListId');
      expect(storageService.getCurrentListId()).toBe('1');
    });
  });

  // Test loadLists method
  describe('loadLists', () => {
    it('should load lists from localStorage', () => {
      storageService.loadLists();
      expect(storageService.getLists().size).toBe(1);
      expect(storageService.getLists().get('1').name).toBe('Home');
    });
  });

  // Test loadCurrentListId method
  describe('loadCurrentListId', () => {
    it('should load the current list ID from localStorage', () => {
      expect(storageService.loadCurrentListId()).toBe('1');
    });
  });

  // Test getCurrentListId method
  describe('getCurrentListId', () => {
    it('should return the current list ID', () => {
      storageService.loadCurrentListId();
      expect(storageService.getCurrentListId()).toBe('1');
    });
  });

  // Test removeCurrentListId method
  describe('removeCurrentListId', () => {
    it('should remove the current list ID from local storage and reset it', () => {
      storageService.removeCurrentListId();
      expect(localStorage.removeItem).toHaveBeenCalledWith("currentListId");
      expect(storageService.getCurrentListId()).toBeNull();
    });
  });

  // Test saveCurrentListId method
  describe('saveCurrentListId', () => {
    it('should save the current list ID to localStorage', () => {
      storageService.saveCurrentListId('2');
      expect(localStorage.setItem).toHaveBeenCalledWith('currentListId', '2');
    });
  });

  // Test saveLists method
  describe('saveLists', () => {
    it('should save lists to localStorage', () => {
      const newLists = new Map([['2', { id: '2', name: 'Work', todos: [] }]]);
      storageService.saveLists(newLists);
      expect(localStorage.setItem).toHaveBeenCalledWith('todoLists', JSON.stringify([...newLists]));
      expect(storageService.getLists()).toEqual(newLists);
    });
  });

  // Test getLists method
  describe('getLists', () => {
    it('should return a copy of the lists', () => {
      storageService.loadLists();
      const lists = storageService.getLists();
      expect(lists).toBeInstanceOf(Map);
      expect(lists.size).toBe(1);
      expect(lists.get('1').name).toBe('Home');
    });
  });

  // Test getList method
  describe('getList', () => {
    it('should retrieve a list by ID', () => {
      storageService.loadLists();
      const list = storageService.getList('1');
      expect(list.name).toBe('Home');
    });
  });

  // Test getListNames method
  describe('getListNames', () => {
    it('should return a set of all list names', () => {
      storageService.loadLists();
      const names = storageService.getListNames();
      expect(names).toEqual(new Set(['Home']));
    });
  });

  // Test addList method
  describe('addList', () => {
    it('should add a new list and save it', () => {
      const newList = { id: '2', name: 'Work', todos: [] };
      storageService.addList(newList);
      expect(storageService.getLists().has('2')).toBe(true);
      expect(storageService.getLists().get('2').name).toBe('Work');
    });
  });

  // Test updateList method
  describe('updateList', () => {
    it('should update an existing list and save it', () => {
      storageService.loadLists();
      const updatedList = { id: '1', name: 'Home Updated', todos: [] };
      storageService.updateList('1', updatedList);
      expect(storageService.getLists().get('1').name).toBe('Home Updated');
    });
  });

  // Test deleteList method
  describe('deleteList', () => {
    it('should delete a list and save the change', () => {
      storageService.loadLists();
      storageService.deleteList('1');
      expect(storageService.getLists().has('1')).toBe(false);
    });
  });

  // Test TODO methods

  describe('Todo management', () => {
    beforeEach(() => {
      // Initialize lists with one list containing some todos
      const initialList = {
        id: '1',
        name: 'Home',
        todos: [
          { id: 'todo1', text: 'Do laundry', completed: false },
          { id: 'todo2', text: 'Vacuum room', completed: true }
        ]
      };
      const lists = new Map([['1', initialList]]);
      storageService.loadLists = jest.fn(() => storageService.lists = lists);
      storageService.loadLists();
    });

    // Test getTodos method
    describe('getTodos', () => {
      it('should return todos for a specific list', () => {
        jest.spyOn(storageService, 'getList').mockReturnValue({
          id: '1',
          name: 'Home',
          todos: [
            { id: 'todo1', text: 'Do laundry', completed: false },
            { id: 'todo2', text: 'Vacuum room', completed: true }
          ]
        });

        const todos = storageService.getTodos('1');
        expect(todos.length).toBe(2);
        expect(todos[0].text).toBe('Do laundry');
      });

      it('should return an empty array if the list does not exist', () => {
        jest.spyOn(storageService, 'getList').mockReturnValue(undefined);

        const todos = storageService.getTodos('nonexistent');
        expect(todos).toEqual([]);
      });
    });

    // Test addTodo method
    describe('addTodo', () => {
      it('should add a todo to an existing list and save updates', () => {
        const newTodo = { id: 'todo3', text: 'Wash dishes', completed: false };
        storageService.addTodo('1', newTodo);
        const todos = storageService.getTodos('1');
        expect(todos.length).toBe(3);
        expect(todos[2]).toEqual(newTodo);
      });
    });

    // Test updateTodo method
    describe('updateTodo', () => {
      it('should update an existing todo', () => {
        const updatedTodo = { id: 'todo1', text: 'Do laundry quickly', completed: true };
        storageService.updateTodo('1', 0, updatedTodo);
        const todos = storageService.getTodos('1');
        expect(todos[0]).toEqual(updatedTodo);
      });
    });

    // Test deleteTodo method
    describe('deleteTodo', () => {
      it('should delete a todo by index from a list', () => {
        jest.spyOn(storageService, 'getTodos').mockReturnValue([
          { id: 'todo1', text: 'Do laundry', completed: false },
          { id: 'todo2', text: 'Vacuum room', completed: true }
        ]);
        jest.spyOn(storageService, 'getList').mockReturnValue({
          id: '1',
          name: 'Home',
          todos: [
            { id: 'todo1', text: 'Do laundry', completed: false },
            { id: 'todo2', text: 'Vacuum room', completed: true }
          ]
        });
        const spyUpdateList = jest.spyOn(storageService, 'updateList').mockImplementation(() => {});
    
        storageService.deleteTodo('1', 0);
    
        expect(spyUpdateList).toHaveBeenCalledWith('1', {
          id: '1',
          name: 'Home',
          todos: [
            { id: 'todo2', text: 'Vacuum room', completed: true }
          ]
        });
      });
    });
  });

});
