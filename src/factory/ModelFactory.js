import { ListService } from '../service/ListService.js';
import { TodoService } from '../service/TodoService.js';
import { StorageService } from '../service/StorageService.js';
import { ObserverManager } from '../service/ObserverManager.js';
import { TodoModel } from '../model/TodoModel.js';

export default class ModelFactory {
    static createListService(storageService) {
        return new ListService(storageService);
    }

    static createTodoService(storageService) {
        return new TodoService(storageService);
    }

    static createStorageService() {
        return new StorageService();
    }

    static createObserverManager() {
        return new ObserverManager();
    }

    static createTodoModel() {
        const storageService = ModelFactory.createStorageService();
        const observerManager = ModelFactory.createObserverManager();

        const listService = ModelFactory.createListService(storageService);
        const todoService = ModelFactory.createTodoService(storageService);

        return new TodoModel(listService, todoService, observerManager);
    }
}