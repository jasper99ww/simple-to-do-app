import ModelFactory from '../../factory/ModelFactory.js';
import ListService from '../../service/ListService.js';
import TodoService from '../../service/TodoService.js';
import StorageService from '../../service/StorageService.js';
import ObserverManager from '../../service/ObserverManager.js';
import TodoAppModel from '../../model/TodoAppModel.js';

describe('ModelFactory', () => {
  describe('createListService', () => {
    it('should create and return a ListService instance', () => {
      const storageService = new StorageService();
      const listService = ModelFactory.createListService(storageService);
      expect(listService).toBeInstanceOf(ListService);
      expect(listService.storageService).toBe(storageService);
    });
  });

  describe('createTodoService', () => {
    it('should create and return a TodoService instance', () => {
      const storageService = new StorageService();
      const todoService = ModelFactory.createTodoService(storageService);
      expect(todoService).toBeInstanceOf(TodoService);
      expect(todoService.storageService).toBe(storageService);
    });
  });

  describe('createStorageService', () => {
    it('should create, initialize, and return a StorageService instance', () => {
      const storageService = ModelFactory.createStorageService();
      expect(storageService).toBeInstanceOf(StorageService);
    });
  });

  describe('createObserverManager', () => {
    it('should create and return an ObserverManager instance', () => {
      const observerManager = ModelFactory.createObserverManager();
      expect(observerManager).toBeInstanceOf(ObserverManager);
    });
  });

  describe('createTodoModel', () => {
    it('should create and return a TodoAppModel instance with all dependencies', () => {
      const todoModel = ModelFactory.createTodoModel();
      expect(todoModel).toBeInstanceOf(TodoAppModel);
      expect(todoModel.listService).toBeInstanceOf(ListService);
      expect(todoModel.todoService).toBeInstanceOf(TodoService);
      expect(todoModel.observerManager).toBeInstanceOf(ObserverManager);
    });
  });
});
