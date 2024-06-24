export class StorageService {

  constructor() {
    this.lists = new Map();
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

  saveCurrentListId(listId) {
    localStorage.setItem("currentListId", listId);
  }

  saveLists() {
    localStorage.setItem("todoLists", JSON.stringify([...this.lists]));
  }

  // LIST methods

  getLists() {
    return this.lists;
  }

  getList(listId) {
    console.log("XXCZ")
    return this.lists.get(listId);
  }

  getListNames() {
    return new Set([...this.lists.values()].map(list => list.name));
  }

  addList(list) {
    this.lists.set(list.id, list);
    this.saveLists();
  }

  deleteList(listId) {
    this.lists.delete(listId);
    this.saveLists();
  }

  updateList(listId, list) {
    this.lists.set(listId, list);
    this.saveLists();
  }

  // TODO methods

  getTodos(listId) {
    return this.lists.get(listId)?.todos || [];
  }

  addTodo(listId, todo) {
    const todos = this.getTodos(listId);
    todos.push(todo);
    this.saveLists();
  }

  updateTodoName(todoIndex, listId, text) {
    const todos = this.getTodos(listId);
    todos[todoIndex].text = text;
    this.saveLists();
  }

  deleteTodo(listId, todoId) {
    const todos = this.getTodos(listId);
    todos.splice(todoId, 1);
    this.saveLists();
  }

  toggleTodoCompleted(listId, todoId) {
    const todos = this.getTodos(listId);
    todos[todoId].completed = !todos[todoId].completed;
    this.saveLists();
  }

  reorderTodos(listId, newOrder) {
    const list = this.getList(listId);
    const todosTemp = [...list.todos];
    newOrder.forEach((todoIndex, position) => {
      list.todos[position] = todosTemp[todoIndex];
    });
    this.saveLists();
  }
}
