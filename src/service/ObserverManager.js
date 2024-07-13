export class ObserverManager {
  constructor() {
      this.observers = new Map();
  }

  addObserver(observer, eventTypes) {
    if (!this.observers.has(observer)) {
        this.observers.set(observer, new Set(eventTypes));
    } 
  }

  notifyObservers(event) {
    this.observers.forEach((events, observer) => {
      if (events.has(event.eventType)) {
          observer.update(event, event.message);
      }
    });
  }
}