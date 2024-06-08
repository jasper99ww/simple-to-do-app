import { ModelValidator } from '../model/ModelValidator.js';

export class ListService {
      constructor({ getCurrentListId, setCurrentListId, lists, listNames }) {
        this.getCurrentListId = getCurrentListId;
        this.setCurrentListId = setCurrentListId;
        this.lists = lists;
        this.listNames = listNames;
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
        this.setCurrentListId(listId);
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
        const list = this.lists.get(listId);
        this.listNames.delete(list.name);
        this.lists.delete(listId);
        this.setCurrentListId(this.lists.size > 0 ? this.lists.keys().next().value : null);
        return { success: true };
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
      this.setCurrentListId(newListId);
      return { success: true };
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
      const eventType = this.lists.size
      if (eventType === 0) {
        return { success: false }
      } else {
        return { success: true }
      }
  }
}