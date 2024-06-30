import { TodoAppModel } from '../../model/TodoAppModel.js';
import { ObserverManager } from '../../service/ObserverManager.js';
import { EventTypes } from '../../utils/eventTypes.js';

jest.mock('../../service/ObserverManager.js');

describe('TodoAppModel - Observer Methods', () => {
  let model;
  let observerManagerMock;

  beforeEach(() => {
    observerManagerMock = new ObserverManager();
    jest.clearAllMocks();
    model = new TodoAppModel({}, {}, observerManagerMock);
  });

  test('addObserver should call observerManager.addObserver with correct arguments', () => {
    const observer = {};
    const eventTypes = [EventTypes.UPDATE_TODO, EventTypes.UPDATE_LIST];

    model.addObserver(observer, eventTypes);

    expect(observerManagerMock.addObserver).toHaveBeenCalledWith(observer, eventTypes);
  });
});