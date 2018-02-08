import * as Types from '~/actions/types';

const INITIAL_STATE = {
  editing: false
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
  case Types.ENABLE_EDITING:
    return {...state, editing: true};
  case Types.DISABLE_EDITING:
    return {...state, editing: false};
  case Types.TOGGLE_EDITING:
    return {...state, editing: !state.editing};
  }

  return state;
};
