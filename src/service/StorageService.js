export class StorageService {

  constructor() {
    this.lists = new Map();
    this.currentListId = null;
  }

  initialize() {
    this.loadLists();
    this.currentListId = this.loadCurrentListId();
  }

  loadLists() {
    const data = localStorage.getItem("todoLists");
    if (data) {
      const parsedData = JSON.parse(data);
      parsedData.forEach(([key, value]) => {
      this.lists.set(key, value);
      });
    }
  }

  loadCurrentListId() {
    return localStorage.getItem("currentListId");
  }

  getCurrentListId() {
    return this.currentListId;
  }

  removeCurrentListId() {
    localStorage.removeItem("currentListId");
    this.currentListId = null;
  }

  saveCurrentListId(listId) {
    localStorage.setItem("currentListId", listId);
    this.currentListId = listId;
  }

  saveLists(newLists = this.lists) {
    localStorage.setItem("todoLists", JSON.stringify([...newLists]));
    this.lists = newLists;
  }

  // LIST methods

  getLists() {
    return new Map(this.lists);
  }

  getList(listId) {
    return {...this.lists.get(listId)}
  }

  getListNames() {
    return new Set([...this.lists.values()].map(list => list.name));
  }

  addList(list) {
    const newListMap = new Map(this.lists);
    newListMap.set(list.id, list);
    this.lists = newListMap;
    this.saveLists();
  }

  updateList(listId, list) {
    const updatedLists = new Map(this.lists);
    updatedLists.set(listId, {...list});
    this.lists = updatedLists;
    this.saveLists();
  }

  deleteList(listId) {
    const updatedLists = new Map(this.lists);
    updatedLists.delete(listId);
    this.lists = updatedLists;
    this.saveLists();
  }

  // TODO methods

  getTodos(listId) {
    const list = this.getList(listId);
    return list ? [...list.todos] : [];
  }

  addTodo(listId, todo) {
    const todos = [...this.getTodos(listId), todo];
    const updatedList = { ...this.getList(listId), todos };
    this.updateList(listId, updatedList);
  }

  updateTodo(listId, todoIndex, updatedTodo) {
    const list = this.getList(listId);
    list.todos[todoIndex] = updatedTodo;
    this.updateList(listId, list);
  }

  deleteTodo(listId, todoId) {
    const todos = this.getTodos(listId).filter((_, index) => index !== todoId);
    const updatedList = { ...this.getList(listId), todos };
    this.updateList(listId, updatedList);
  }
}
