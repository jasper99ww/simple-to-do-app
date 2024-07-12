import { ModelValidator } from './ModelValidator.js';

export class ListService {
  constructor(storageService) {
    this.storageService = storageService;
    this.firstLoad = true;
  }

  validateAndExecute(validationMethod, operationCallback, ...args) {
    const lists = this.storageService.getLists();
    const validation = validationMethod.call(ModelValidator, lists, ...args);
    if (!validation.isValid) {
      return { success: false, error: validation.error, message: validation.message };
    }
    return operationCallback.call(this, lists, ...args);
  }

  addList(name) {
    const listNames = this.storageService.getListNames();
    const validation = ModelValidator.validateListName(listNames, name);
    if (!validation.isValid) {
      return { success: false, error: validation.error, message: validation.message };
    }
    const listId = this.generateId();
    const newList = {
      id: listId,
      name: name,
      todos: [],
      completed: false
    }
    this.storageService.addList(newList);
    return { success: true, listId: listId };
  }

  getLists(query = '') {
    return [...this.storageService.getLists().values()].filter(list =>
      list.name.toLowerCase().includes(query.toLowerCase()));
  }

  getList(listId) {
    return this.validateAndExecute(
      ModelValidator.validateListExists,
      () => {
        const list = this.storageService.getList(listId);
        return { success: true, list };
      },
      listId
    );
  }

  getListNames() {
    const lists = this.storageService.getLists();
    return new Set([...lists.values()].map(list => list.name));
  }

  getCurrentListId() {
    return this.storageService.getCurrentListId();
  }

  getCurrentListName() {
    const currentListId = this.getCurrentListId();
    if (!currentListId) {
      return { success: true, listName: "" };
    }
    const result = this.getList(currentListId);
    if (!result.success) {
      return result;
    }
    return { success: true, listName: result.list.name };
  }

  saveCurrentListId(listId) {
    this.storageService.saveCurrentListId(listId);
  }

  updateListName(listId, newName) {
    const listNames = this.getListNames();
    return this.validateAndExecute(
      ModelValidator.validateUpdatedListName,
      (lists) => {
        const list = lists.get(listId);
        list.name = newName;
        this.storageService.updateList(listId, list);
        return { success: true };
      },
      listNames,
      listId,
      newName
    );
  }

  deleteList(listId) {
    return this.validateAndExecute(
      ModelValidator.validateListExists,
      (lists) => {
        let previousKey = null;
        for (let key of lists.keys()) {
          if (key === listId) break;
          previousKey = key;
        }
        this.storageService.deleteList(listId);
        return { success: true, previousListId: previousKey };
      },
      listId
    );
  }

  toggleTodoListCompleted(listId) {
    return this.validateAndExecute(
      ModelValidator.validateListExists,
      () => {
        const list = this.storageService.getList(listId);
        list.completed = !list.completed;
        this.storageService.updateList(listId, list);
        return { success: true };
      },
      listId
    );
  }

  reorderLists(newOrder) {
    const lists = this.storageService.getLists();
    const newList = new Map();

    newOrder.forEach(listId => {
      const list = lists.get(listId);
      if (list) {
        newList.set(listId, list);
      }
    });
    
    this.storageService.saveLists(newList);
    return { success: true };
  }

  checkListsExistence() {
    const lists = this.storageService.getLists();
    const listSize = lists.size;

    // Always update css styles for list message on first load
    if (this.firstLoad) {
      this.firstLoad = false;
      return { success: listSize > 0, updateUI: true };
    }

    if (listSize === 0) {
      // If listSize is equal to 0 then show empty lists message
      this.storageService.removeCurrentListId();
      return { success: false, updateUI: true };
    } else if (listSize === 1) {
      // If listSize is equal to 1 then show list
      return { success: true, updateUI: true };
    } else {
      // If listSize is greater than 1, don't update css styles, because it was update previously
      return { success: true, updateUI: false };
    }
  }

  generateId() {
    return crypto.randomUUID();
  }
}