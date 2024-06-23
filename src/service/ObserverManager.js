export class ObserverManager {
  constructor() {
      this.observers = new Map();
  }

  addObserver(eventType, observer) {
    if (!this.observers.has(eventType)) {
        this.observers.set(eventType, new Set());
    }
    this.observers.get(eventType).add(observer);
  }

  notifyObservers(eventType, data) {
      if (this.observers.has(eventType)) {
          this.observers.get(eventType).forEach(observer => observer.update(eventType, data));
      }
  }
}