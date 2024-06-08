class ServiceFactory {
  static createListService(todoModel) {
    return new ListService({
      notifyObservers: todoModel.notifyObservers.bind(todoModel),
      persistData: todoModel.persistData.bind(todoModel),
      currentListState: todoModel.currentListState,
      lists: todoModel.lists,
      listNames: todoModel.listNames
    });
  }

  static createTodoService(todoModel) {
    return new TodoService({
      notifyObservers: todoModel.notifyObservers.bind(todoModel),
      persistData: todoModel.persistData.bind(todoModel),
      currentListState: todoModel.currentListState,
      lists: todoModel.lists
    });
  }
}
