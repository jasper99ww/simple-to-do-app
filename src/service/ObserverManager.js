export class ObserverManager {
  constructor() {
      this.observers = new Map();
  }

  addObserver(observer, eventTypes) {
    // Dodajemy obserwatora z jego zestawem zdarzeń, na które chce reagować
    if (!this.observers.has(observer)) {
        this.observers.set(observer, new Set(eventTypes));
    } 
  }

  notifyObservers(event) {
    // Powiadamiamy tylko tych obserwatorów, którzy subskrybowali dane zdarzenie
    this.observers.forEach((events, observer) => {
      if (events.has(event.eventType)) {
          observer.update(event, event.message);
      }
    });
  }
}