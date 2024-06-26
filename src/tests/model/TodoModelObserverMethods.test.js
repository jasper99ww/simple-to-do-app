import { TodoModel } from '../../model/TodoModel.js';
import { ObserverManager } from '../../service/ObserverManager.js';
import { EventTypes } from '../../utils/eventTypes.js';

jest.mock('../../service/ObserverManager.js');

describe('TodoModel - Observer Methods', () => {
  let model;
  let observerManagerMock;

  beforeEach(() => {
    observerManagerMock = new ObserverManager();
    jest.clearAllMocks();
    model = new TodoModel({}, {}, observerManagerMock);

    
  });

  test('addObserver should call observerManager.addObserver with correct arguments', () => {
    const observer = {};
    const eventTypes = [EventTypes.UPDATE_TODO, EventTypes.UPDATE_LIST];

    model.addObserver(observer, eventTypes);

    expect(observerManagerMock.addObserver).toHaveBeenCalledWith(observer, eventTypes);
  });
});