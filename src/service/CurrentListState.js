export class CurrentListState {
  constructor() {
      this.currentListId = null;
  }

  getCurrentListId() {
      return this.currentListId;
  }

  setCurrentListId(listId) {
      this.currentListId = listId;
  }
}