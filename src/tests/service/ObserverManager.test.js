import { ObserverManager } from '../../service/ObserverManager';

describe('ObserverManager', () => {
    let observerManager;
    let mockObserver;

    beforeEach(() => {
        observerManager = new ObserverManager();
        mockObserver = {
            update: jest.fn()
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
      });

    // Test addObserver method
    describe('addObserver', () => {
        it('should add an observer with specified event types', () => {
            observerManager.addObserver(mockObserver, ['event1', 'event2']);
            expect(observerManager.observers.get(mockObserver)).toEqual(new Set(['event1', 'event2']));
        });

        it('should not add the same observer twice', () => {
            observerManager.addObserver(mockObserver, ['event1']);
            observerManager.addObserver(mockObserver, ['event1']);
            expect(observerManager.observers.get(mockObserver).size).toBe(1);
        });
    });

    // Test notifyObservers method
    describe('notifyObservers', () => {
        it('should notify observers of an event they are interested in', () => {
            observerManager.addObserver(mockObserver, ['event1', 'event2']);
            const event = { eventType: 'event1', message: 'test message' };
            observerManager.notifyObservers(event);
            expect(mockObserver.update).toHaveBeenCalledWith(event, event.message);
        });

        it('should not notify observers if the event type is not of their interest', () => {
            observerManager.addObserver(mockObserver, ['event2']);
            const event = { eventType: 'event1', message: 'test message' };
            observerManager.notifyObservers(event);
            expect(mockObserver.update).not.toHaveBeenCalled();
        });
    });
});