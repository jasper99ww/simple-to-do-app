import { ModelValidator } from '../model/ModelValidator.js';

export class ListService {
      constructor(lists) {
        this.lists = lists;
        this.listNames = new Set([...lists.values()].map(list => list.name));
        this.firstLoad = true;
    }

    getLists(query = '') {
      const filteredLists = [];
      this.lists.forEach((list) => {
        if (list.name.toLowerCase().includes(query)) {
          filteredLists.push(list);
        }
      });

      return filteredLists;
    }

    getList(listId) {
      const validation = ModelValidator.validateListExists(this.lists, listId);
      if (!validation.isValid) {
          return { success: false, error: validation.error, message: validation.message };
      }
      return { success: true, list: this.lists.get(listId) };
    }

    addList(name) {
      const validation = ModelValidator.validateListName(this.listNames, name);
        if (!validation.isValid) {
            return { success: false, error: validation.error, message: validation.message };
        }
        const listId = crypto.randomUUID();
        this.lists.set(listId, {
            id: listId,
            name: name,
            todos: [],
            completed: false
        });
        this.listNames.add(name);
        return { success: true, listId: listId };
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
        let currentKey = null;
        for (let key of this.lists.keys()) {
            if (key === listId) {
                break;
            }
            previousKey = key;
        }

        const list = this.lists.get(listId);
        this.listNames.delete(list.name);
        this.lists.delete(listId);    
        return { success: true, previousListId: previousKey };
    }
  
    updateListName(listId, newName) {
      const validation = ModelValidator.validateUpdatedListName(this.lists, this.listNames, listId, newName);
        if (!validation.isValid) {
            return { success: false, error: validation.error, message: validation.message };
        }
        const list = this.lists.get(listId);
        this.listNames.delete(list.name);
        list.name = newName;
        this.listNames.add(newName);
        return { success: true };
    }
  
    toggleTodoListCompleted(listId) {
      const validation = ModelValidator.validateListExists(this.lists, listId);
        if (!validation.isValid) {
            return { success: false, error: validation.error, message: validation.message };
        }
        const list = this.lists.get(listId);
        list.completed = !list.completed;
        return { success: true };
    }
  
    changeCurrentList(newListId) {
      const validation = ModelValidator.validateListExists(this.lists, newListId);
      if (!validation.isValid) {
          return { success: false, error: validation.error, message: validation.message };
      }
      return { success: true, newListId: newListId };
    }
  
    reorderLists(newOrder) {
      const newList = new Map();
        newOrder.forEach(listId => {
            const list = this.lists.get(listId);
            if (list) {
                newList.set(listId, list);
            }
        });

        this.lists.clear();
        newList.forEach((list, listId) => {
            this.lists.set(listId, list);
        });

        return { success: true };
    }

    checkListsExistence() {
      const listSize = this.lists.size

      // Always update css styles for list message on first load
      if (this.firstLoad) {
        this.firstLoad = false;
        return { success: listSize > 0, updateUI: true };
      }

      /* If listSize is equal to 0 then show empty lists message;
         If listSize is equal to 1 then show list;
         If listSize is greater than 1, don't update css styles, because it was update previously; */
      if (listSize === 0) {
        console.log("1.1")
      return { success: false, updateUI: true };
      } else if (listSize === 1) {
        console.log("1.2")
          return { success: true, updateUI: true };
      } else {
        console.log("1.3")
          return { success: true, updateUI: false };
      }
  }
}