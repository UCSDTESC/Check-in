import * as Types from './types';

// Events
export const addEvents = (events) => ({
  type: Types.ADD_EVENTS,
  events
});

export const replaceEvents = (events) => ({
  type: Types.REPLACE_EVENTS,
  events
});
