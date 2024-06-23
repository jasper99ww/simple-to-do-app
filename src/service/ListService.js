import { ModelValidator } from '../model/ModelValidator.js';

export class ListService {
    constructor(storageService) {
        this.storageService = storageService;
        this.firstLoad = true;
    }

    getLists(query = '') {
      const lists = this.storageService.getLists();
      const filteredLists = [];
      for (let listId in lists) {
          if (lists[listId].name.toLowerCase().includes(query.toLowerCase())) {
              filteredLists.push(lists[listId]);
          }
      }
      return filteredLists;
    }

    getList(listId) {
      const lists = this.storageService.getLists();
      const validation = ModelValidator.validateListExists(lists, listId);
      if (!validation.isValid) {
          return { success: false, error: validation.error, message: validation.message };
      }
      const list = this.storageService.getList(listId);
      return { success: true, list };
    }

    getListNames() {
      const lists = this.storageService.getLists();
      return new Set([...lists.values()].map(list => list.name));
    }

    getCurrentListId() {
      return this.storageService.loadCurrentListId();
    }

    addList(name) {
      const listNames = this.storageService.getListNames();
      const validation = ModelValidator.validateListName(listNames, name);
        if (!validation.isValid) {
            return { success: false, error: validation.error, message: validation.message };
        }
      const listId = crypto.randomUUID();
      const newList = {
        id: listId,
        name: name,
        todos: [],
        completed: false
      }
      this.storageService.addList(newList);
      return { success: true, listId: listId };
    }

    saveCurrentListId(listId) {
      this.storageService.saveCurrentListId(listId);
  }
  
    generateId() {
      return crypto.randomUUID();
    }

    deleteList(listId) {
      const validation = ModelValidator.validateListExists(this.lists, listId);
        if (!validation.isValid) {
            return { success: false, error: validation.error, message: validation.message };
        }

        let previousKey = null;
        for (let key of this.lists.keys()) {
            if (key === listId) {
                break;
            }
            previousKey = key;
        }
        
        this.storageService.deleteList(listId);
        return { success: true, previousListId: previousKey };
    }
  
    updateListName(listId, newName) {
      const listNames = this.getListNames();
      const lists = this.storageService.getLists();
      const validation = ModelValidator.validateUpdatedListName(lists, listNames, listId, newName);
      if (!validation.isValid) {
          return { success: false, error: validation.error, message: validation.message };
      }
      const list = this.storageService.getList(listId);
      list.name = newName;
      this.storageService.updateList(listId, list);
      return { success: true };
    }
  
    toggleTodoListCompleted(listId) {
      const lists = this.storageService.getLists();
      const validation = ModelValidator.validateListExists(lists, listId);
      if (!validation.isValid) {
          return { success: false, error: validation.error, message: validation.message };
      }
      const list = this.storageService.getList(listId);
      list.completed = !list.completed;
      return { success: true };
    }
  
    changeCurrentList(newListId) {
      const lists = this.storageService.getLists();
      const validation = ModelValidator.validateListExists(lists, newListId);
      if (!validation.isValid) {
          return { success: false, error: validation.error, message: validation.message };
      }
      return { success: true, newListId: newListId };
    }
  
    reorderLists(newOrder) {
      const newList = new Map();
      const lists = this.storageService.getLists();
        newOrder.forEach(listId => {
            const list = lists.get(listId);
            if (list) {
                newList.set(listId, list);
            }
        });

        this.lists.clear();
        newList.forEach((list, listId) => {
            lists.set(listId, list);
        });
        this.storageService.saveLists();
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

      /* If listSize is equal to 0 then show empty lists message;
         If listSize is equal to 1 then show list;
         If listSize is greater than 1, don't update css styles, because it was update previously; */
      if (listSize === 0) {
          return { success: false, updateUI: true };
      } else if (listSize === 1) {
          return { success: true, updateUI: true };
      } else {
          return { success: true, updateUI: false };
      }
  }
}