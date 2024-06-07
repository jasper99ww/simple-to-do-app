export const EventDefinitions = {
  UPDATE: {
      eventType: 'update-event',
      message: null
  },
  ERROR_TODO: {
      eventType: 'error-todo-event',
      message: 'Generic error occurred in todo operation.'
  },
  ERROR_TEXT_EMPTY_TODO: {
      eventType: 'error-text-empty-todo-event',
      message: 'Todo name cannot be empty.'
  },
  ERROR_LIST: {
      eventType: 'error-list-event',
      message: 'Generic error occurred in list operation.'
  },
  ERROR_TEXT_EMPTY_LIST: {
      eventType: 'error-text-empty-list-event',
      message: 'List name cannot be empty.'
  }
};
