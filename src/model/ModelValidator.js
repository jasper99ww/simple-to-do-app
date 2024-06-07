export class ModelValidator {

  static validateListExists(lists, listId, notifyObservers) {
    if (!lists.has(listId)) {
      notifyObservers({ eventType: EventTypes.ERROR_LIST, message: ERROR_MESSAGES.LIST_NOT_FOUND });
      return false;
    }
    return true;
  }

  static validateListName(listNames, listName, notifyObservers, onValid) {
    if (listNames.has(listName)) {
      notifyObservers({ eventType: EventTypes.ERROR_LIST, message: ERROR_MESSAGES.LIST_EXISTS });
    } else if (listName.length === 0) {
      notifyObservers({ eventType: EventTypes.ERROR_LIST, message: ERROR_MESSAGES.LIST_TEXT_EMPTY });
    } else {
      onValid();
    }
  }

  static validateUpdatedListName(lists, listNames, listId, listName, notifyObservers, onValid) {
    if (this.validateListExists(lists, listId, notifyObservers)) {
      this.validateListName(listNames, listName, notifyObservers, onValid);
    }
  }

  static validateTodoIndex(lists, listId, todoId, onValid) {
    if (todoId >= 0 && todoId < lists.get(listId).todos.length) {
      onValid();
    }
  }

  static validateTodoText(lists, listId, index, newText, notifyObservers, onValid) {
      if (this.validateListExists(lists, listId, notifyObservers)) {
          this.validateTodoIndex(lists, listId, index, () => {
            if (newText.length === 0) {
              notifyObservers({ eventType: EventTypes.ERROR_TODO, message: ERROR_MESSAGES.TODO_TEXT_EMPTY });
            } else {
              onValid();
            }
          });
      }
  }

  static validateAddTodo(lists, listId, todoText, notifyObservers, onValid) {
      if (this.validateListExists(lists, listId, notifyObservers)) {
        if (todoText.length === 0) {
          notifyObservers({
              eventType: EventTypes.ERROR_TODO,
              message: ERROR_MESSAGES.TODO_TEXT_EMPTY
          });
      } else {
        onValid();
      }
    }
  }

  static validateDeleteTodo(lists, listId, todoId, notifyObservers, onValid) {
    if (this.validateListExists(lists, listId, notifyObservers)) {
      this.validateTodoIndex(lists, listId, todoId, notifyObservers, onValid);
    }
  }
}
