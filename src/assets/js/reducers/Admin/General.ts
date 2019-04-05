import * as Types from '~/actions/types';
import { GeneralState } from './types';
import { handleActions } from 'redux-actions';

const INITIAL_STATE: GeneralState = {
  editing: false,
};

export default handleActions({
  [Types.ENABLE_EDITING]: (state: GeneralState) => ({
    ...state,
    editing: true,
  }),
  [Types.DISABLE_EDITING]: (state: GeneralState) => ({
    ...state,
    editing: false,
  }),
  [Types.TOGGLE_EDITING]: (state: GeneralState) => ({
    ...state,
    editing: !state.editing,
  }),
}, INITIAL_STATE);
