import ModelFactory from '../../factory/ModelFactory';
import { ListService } from '../../service/ListService';
import { TodoService } from '../../service/TodoService';
import { StorageService } from '../../service/StorageService';
import { ObserverManager } from '../../service/ObserverManager';
import { TodoAppModel } from '../../model/TodoAppModel';

describe('ModelFactory', () => {

  // Test createListService method
  describe('createListService', () => {
    it('should create and return a ListService instance', () => {
      const storageService = new StorageService();
      const listService = ModelFactory.createListService(storageService);
      expect(listService).toBeInstanceOf(ListService);
      expect(listService.storageService).toBe(storageService);
    });
  });

  // Test createTodoService method
  describe('createTodoService', () => {
    it('should create and return a TodoService instance', () => {
      const storageService = new StorageService();
      const todoService = ModelFactory.createTodoService(storageService);
      expect(todoService).toBeInstanceOf(TodoService);
      expect(todoService.storageService).toBe(storageService);
    });
  });

  // Test createStorageService method
  describe('createStorageService', () => {
    it('should create, initialize, and return a StorageService instance', () => {
      const storageService = ModelFactory.createStorageService();
      expect(storageService).toBeInstanceOf(StorageService);
    });
  });

  // Test createObserverManager method
  describe('createObserverManager', () => {
    it('should create and return an ObserverManager instance', () => {
      const observerManager = ModelFactory.createObserverManager();
      expect(observerManager).toBeInstanceOf(ObserverManager);
    });
  });

  // Test createTodoModel method
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
