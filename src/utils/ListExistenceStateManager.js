import { EventTypes } from '../utils/eventTypes.js'; 

export class ListExistenceStateManager {
  constructor(model) {
    console.log("START")
      this.model = model;
      this.model.addObserver(this, [
        EventTypes.LISTS_EMPTY,
        EventTypes.LISTS_EXIST
      ]);

      this.currentUIState = null;
      this.content = document.querySelector(".todo-container");
      this.emptyPrompt = document.querySelector(".prompt-container");
      this.model.checkListsExistence();
  }

  update(event) {
    switch (event.eventType) {
        case EventTypes.LISTS_EMPTY:
            if (this.currentUIState !== 'empty') {
                this.showEmptyListState();
                this.currentUIState = 'empty';
            }
            break;
        case EventTypes.LISTS_EXIST:
            if (this.currentUIState !== 'exist') {
                this.showListState();
                this.currentUIState = 'exist';
            }
            break;
      }
  }

  showEmptyListState() {
      document.getElementById('current-list-name').textContent = 'No active list';
      this.content.style.display = 'none';
      this.emptyPrompt.style.display = 'flex';
  }

  showListState() {
      const currentList = this.model.lists.get(this.model.currentListId);
      document.getElementById('current-list-name').textContent = currentList ? currentList.name : 'No current list name';
      this.content.style.display = 'flex';
      this.emptyPrompt.style.display = 'none';
  }
}
