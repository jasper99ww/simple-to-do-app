import { ListService } from '../../service/ListService.js';
import { StorageService } from '../../service/StorageService.js';
import { ModelValidator } from '../../service/ModelValidator.js';

jest.mock('../../service/StorageService.js');
jest.mock('../../service/ModelValidator.js');

describe('ListService', () => {
  
  let listService;
  let storageServiceMock;

  beforeEach(() => {
    storageServiceMock = new StorageService();
    jest.clearAllMocks();
    listService = new ListService(storageServiceMock);
    
  });

  // Test addList method 

  describe('addList', () => {
    it('should add a list if the name is valid', () => {
      const listName = "New List";
      storageServiceMock.getListNames.mockReturnValue(new Set(['Existing List']));
      ModelValidator.validateListName.mockReturnValue({ isValid: true });
      storageServiceMock.addList.mockImplementation(() => {});

      const result = listService.addList(listName);

      expect(ModelValidator.validateListName).toHaveBeenCalledWith(expect.anything(), listName);
      expect(storageServiceMock.addList).toHaveBeenCalled();
      expect(result.success).toBe(true);
      expect(result).toHaveProperty('listId');
    });

    it('should not add a list if the name is not valid', () => {
      const listName = "New List";
      storageServiceMock.getListNames.mockReturnValue(new Set(['New List']));
      ModelValidator.validateListName.mockReturnValue({
        isValid: false,
        error: 'ERROR_LIST',
        message: 'List already exists'
      });

      const result = listService.addList(listName);

      expect(ModelValidator.validateListName).toHaveBeenCalledWith(expect.anything(), listName);
      expect(storageServiceMock.addList).not.toHaveBeenCalled();
      expect(result.success).toBe(false);
      expect(result.error).toBe('ERROR_LIST');
      expect(result.message).toBe('List already exists');
    });
  });

  // Test getLists method

  describe('getLists', () => {
    it('should return filtered lists based on the query', () => {
        const lists = new Map([
            ['1', { id: '1', name: 'Work', todos: [], completed: false }],
            ['2', { id: '2', name: 'Home', todos: [], completed: true }]
        ]);
        storageServiceMock.getLists.mockReturnValue(lists);

        const result = listService.getLists('work');

        expect(result).toHaveLength(1);
        expect(result[0]).toEqual(expect.objectContaining({ name: 'Work' }));
    });

    it('should return all lists when query is empty', () => {
        const lists = new Map([
            ['1', { id: '1', name: 'Work', todos: [], completed: false }],
            ['2', { id: '2', name: 'Home', todos: [], completed: true }]
        ]);
        storageServiceMock.getLists.mockReturnValue(lists);

        const result = listService.getLists('');

        expect(result).toHaveLength(2);
    });
});

  // Test getList method
  describe('getList', () => {
    it('should return the list if it exists', () => {
        const lists = new Map([
            ['1', { id: '1', name: 'Work', todos: [], completed: false }]
        ]);
        storageServiceMock.getLists.mockReturnValue(lists);
        ModelValidator.validateListExists.mockReturnValue({ isValid: true });

        const result = listService.getList('1');

        expect(result).toEqual({ success: true, list: { id: '1', name: 'Work', todos: [], completed: false } });
    });

    it('should return an error if the list does not exist', () => {
        const lists = new Map();
        storageServiceMock.getLists.mockReturnValue(lists);
        ModelValidator.validateListExists.mockReturnValue({ isValid: false, error: 'ERROR_LIST', message: 'List not found' });

        const result = listService.getList('1');

        expect(result).toEqual({ success: false, error: 'ERROR_LIST', message: 'List not found' });
    });
});

  // Test getListNames method
  describe('getListNames', () => {
    it('should return a set of all list names', () => {
        const lists = new Map([
            ['1', { id: '1', name: 'Work', todos: [], completed: false }],
            ['2', { id: '2', name: 'Home', todos: [], completed: true }]
        ]);
        storageServiceMock.getLists.mockReturnValue(lists);
        const result = listService.getListNames();
        expect(result).toEqual(new Set(['Work', 'Home']));
    });
});

  // Test getCurrentListId method
  describe('getCurrentListId', () => {
    it('should retrieve the current list ID from the storage', () => {
      storageServiceMock.getCurrentListId.mockReturnValue('1');
      const listId = listService.getCurrentListId();
      expect(listId).toBe('1');
      expect(storageServiceMock.getCurrentListId).toHaveBeenCalled();
    });
  });

  // Test getCurrentListName method
  describe('getCurrentListName', () => {
    it('should return an empty string if no current list ID is present', () => {
      storageServiceMock.getCurrentListId.mockReturnValue(null);
      const result = listService.getCurrentListName();
      expect(result).toEqual({ success: true, listName: "" });
    });
  
    it('should return the list name when the current list ID is valid and the list exists', () => {
      storageServiceMock.getCurrentListId.mockReturnValue('1');
      jest.spyOn(listService, 'getList').mockReturnValue({ success: true, list: { name: 'Home' } });
      const result = listService.getCurrentListName();
      expect(result).toEqual({ success: true, listName: 'Home' });
    });
  
    it('should return an error if the list does not exist', () => {
      storageServiceMock.getCurrentListId.mockReturnValue('1');
      jest.spyOn(listService, 'getList').mockReturnValue({ success: false, error: 'ERROR_LIST', message: 'List not found' });
      const result = listService.getCurrentListName();
      expect(result).toEqual({ success: false, error: 'ERROR_LIST', message: 'List not found' });
    });
  });

  // Test saveCurrentListId method
  describe('saveCurrentListId', () => {
    it('should call saveCurrentListId on storage service with the given list ID', () => {
      listService.saveCurrentListId('1');
      expect(storageServiceMock.saveCurrentListId).toHaveBeenCalledWith('1');
    });
  });

  // Test updateListName method
  describe('updateListName', () => {
    it('should update the name of a list if validation passes', () => {
      const listNames = new Set(['Home']);
      const listsMock = new Map([['1', { id: '1', name: 'Home', todos: [], completed: false }]]);
      storageServiceMock.getListNames.mockReturnValue(listNames);
      storageServiceMock.getLists.mockReturnValue(listsMock);

      ModelValidator.validateUpdatedListName.mockReturnValue({ isValid: true });
      storageServiceMock.updateList.mockImplementation(() => {});
  
      const result = listService.updateListName('1', 'Home Updated');
  
      expect(result.success).toBe(true);
    });
  
    it('should not update the list name if validation fails', () => {
      const listNames = new Set(['Home']);
      const listsMock = new Map();
      storageServiceMock.getLists.mockReturnValue(listsMock);
      storageServiceMock.getListNames.mockReturnValue(listNames);
      ModelValidator.validateUpdatedListName.mockReturnValue({ isValid: false, error: 'ERROR_LIST', message: 'Invalid name' });
  
      const result = listService.updateListName('1', 'Home Updated');
  
      expect(result.success).toBe(false);
      expect(result.error).toBe('ERROR_LIST');
      expect(result.message).toBe('Invalid name');
    });
  });

  // Test deleteList method
  describe('deleteList', () => {
    it('should delete a list and return the ID of the previous list', () => {
      const mockMap = new Map();
      mockMap.set('0', { id: '0', name: 'Previous List' });
      mockMap.set('1', { id: '1', name: 'Current List' });
  
      storageServiceMock.getLists.mockReturnValue(mockMap);
      storageServiceMock.deleteList.mockImplementation((id) => {
        mockMap.delete(id);
      });
      ModelValidator.validateListExists.mockReturnValue({ isValid: true });
  
      // Wywołanie metody
      const result = listService.deleteList('1');
  
      // Sprawdzenie wyników
      expect(result.success).toBe(true);
      expect(result.previousListId).toBe('0');
    });
  });

  // Test toggleTodoListCompleted method
  describe('toggleTodoListCompleted', () => {
    it('should toggle the completion status of a list', () => {
      const mockMap = new Map();
      mockMap.set('1', { id: '1', name: 'Test List', completed: false });
      storageServiceMock.getLists.mockReturnValue(mockMap);
      storageServiceMock.updateList.mockImplementation((id, list) => {
        mockMap.set(id, { ...list, completed: !list.completed });
      });
      ModelValidator.validateListExists.mockReturnValue({ isValid: true });
  
      const result = listService.toggleTodoListCompleted('1');
  
      expect(result.success).toBe(true);
      expect(mockMap.get('1').completed).toBe(true);
    });
  
    it('should return an error if the list does not exist', () => {
      ModelValidator.validateListExists.mockReturnValue({ isValid: false, error: 'ERROR_LIST', message: 'List not found' });
  
      const result = listService.toggleTodoListCompleted('1');
  
      expect(result.success).toBe(false);
      expect(result.error).toBe('ERROR_LIST');
    });
  });

  
  // Test reorderLists method
  describe('reorderLists', () => {
      it('should reorder the lists according to the new order provided', () => {
        const mockMap = new Map([
          ['1', { id: '1', name: 'List 1' }],
          ['2', { id: '2', name: 'List 2' }]
        ]);
        storageServiceMock.getLists.mockReturnValue(mockMap);
        storageServiceMock.saveLists.mockImplementation(() => {});
    
        const result = listService.reorderLists(['2', '1']);
    
        expect(result.success).toBe(true);
    });
  });

  // Test checkListsExistence
  describe('checkListsExistence', () => {
    beforeEach(() => {
      listService.firstLoad = true; // Reset the firstLoad before each test
    });
  
    it('should handle first load with no lists', () => {
      storageServiceMock.getLists.mockReturnValue(new Map());
      const result = listService.checkListsExistence();
      expect(result).toEqual({ success: false, updateUI: true });
      expect(listService.firstLoad).toBe(false);
    });
  
    it('should handle first load with lists', () => {
      storageServiceMock.getLists.mockReturnValue(new Map([['1', {}]]));
      const result = listService.checkListsExistence();
      expect(result).toEqual({ success: true, updateUI: true });
      expect(listService.firstLoad).toBe(false);
    });
  
    it('should handle no lists after the first load', () => {
      listService.firstLoad = false;
      storageServiceMock.getLists.mockReturnValue(new Map());
      storageServiceMock.removeCurrentListId.mockImplementation(() => {});
      const result = listService.checkListsExistence();
      expect(result).toEqual({ success: false, updateUI: true });
      expect(storageServiceMock.removeCurrentListId).toHaveBeenCalled();
    });
  
    it('should handle one list after the first load', () => {
      listService.firstLoad = false;
      storageServiceMock.getLists.mockReturnValue(new Map([['1', {}]]));
      const result = listService.checkListsExistence();
      expect(result).toEqual({ success: true, updateUI: true });
    });
  
    it('should handle multiple lists after the first load without updating UI', () => {
      listService.firstLoad = false;
      storageServiceMock.getLists.mockReturnValue(new Map([['1', {}], ['2', {}]]));
      const result = listService.checkListsExistence();
      expect(result).toEqual({ success: true, updateUI: false });
    });
  });

  // Test generateId
  describe('generateId', () => {
    it('should generate a new UUID', () => {
      expect(typeof listService.generateId()).toBe('string');
    });
  });

});
