export class SortableHandler {
  constructor(container, handleSelector, updateCallback) {
    this.container = container;
    this.handleSelector = handleSelector;
    this.updateCallback = updateCallback;
    this.setupSortable();
  }

  setupSortable() {
    this.sortable = new Sortable(this.container, {
      animation: 150,
      ghostClass: 'sortable-ghost',
      chosenClass: 'sortable-chosen',
      forceFallback: true,
      fallbackClass: 'sortable-fallback',
      handle: this.handleSelector,
      onStart: (evt) => {
        document.body.classList.add("grabbing");
      },
      onEnd: (evt) => {
        document.body.classList.remove("grabbing");
        this.updateCallback();
        const event = new CustomEvent('items-reordered', { detail: { container: this.container } });
        document.dispatchEvent(event);
      },
    });
  }  
}
