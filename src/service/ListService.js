import { ModelValidator } from '../model/ModelValidator.js';
import { EventTypes } from '../utils/eventTypes.js';

export class ListService {
    constructor({ notifyObservers, persistData, currentListState, lists, listNames }) {
        this.notifyObservers = notifyObservers;
        this.persistData = persistData;
        this.currentListState = currentListState;
        this.lists = lists;
        this.listNames = listNames;
    }

    addList(name) {
      ModelValidator.validateListName(this.listNames, name, this.notifyObservers, () => {
            const listId = this.generateId();
            this.lists.set(listId, {
                id: listId,
                name: name,
                todos: [],
                completed: false
            });
            this.listNames.add(name);
            this.currentListState.setCurrentListId(listId);
            this.persistData();
            this.checkListsExistence();
        }
      );
    }
  
    generateId() {
      return crypto.randomUUID();
    }

    
    deleteList(listId) {
      ModelValidator.validateListExists(this.lists, listId, this.notifyObservers, () => {
        const list = this.lists.get(this.currentListId);
        this.listNames.delete(list.name);
        this.lists.delete(listId);
        this.currentListState.setCurrentListId(this.lists.size > 0 ? this.lists.keys().next().value : null);
        this.persistData();
        this.checkListsExistence();
      });
    }
  
    updateListName(listId, newName) {
      ModelValidator.validateUpdatedListName(
        this.lists,
        this.listNames,
        listId,
        newName,
        this.notifyObservers,
        () => {
            const list = this.lists.get(listId);
            this.listNames.delete(list.name);
            list.name = newName;
            this.listNames.add(newName);
            this.persistData();
        }
      );
    }
  
    toggleTodoListCompleted(listId) {
      ModelValidator.validateListExists(this.lists, listId, this.notifyObservers, () => {
        const list = this.lists.get(this.currentListId);
        list.completed = !list.completed;
        this.persistData();
      });
    }
  
    changeList(newListId) {
      ModelValidator.validateListExists(this.lists, newListId, this.notifyObservers, () => {
        const list = this.lists.get(this.currentListId);
        this.currentListState.setCurrentListId(newListId);
        this.persistData();
      });
    }
  
    reorderLists(newOrder) {
      const newList = new Map();
      newOrder.forEach(listId => {
        const list = this.lists.get(listId);
        if (list) {
          newList.set(listId, list);
        }
      });
      this.lists = newList;
      this.persistData();
    }

    checkListsExistence() {
      const eventType = this.lists.size === 0 ? EventTypes.LISTS_EMPTY : EventTypes.LISTS_EXIST;
      this.notifyObservers({ eventType: eventType });
  }
}