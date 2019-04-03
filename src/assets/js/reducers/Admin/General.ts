import {Reducer} from 'redux';
import * as Types from '~/actions/types';
import { GeneralState } from './types';

const INITIAL_STATE: GeneralState = {
  editing: false,
};

const general: Reducer<GeneralState> = (state: GeneralState = INITIAL_STATE, action) => {
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

export default general;
