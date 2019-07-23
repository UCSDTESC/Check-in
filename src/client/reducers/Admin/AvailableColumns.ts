import { handleActions } from 'redux-actions';
import { ActionType } from 'typesafe-actions';
import { replaceAvailableColumns } from '~/actions';
import * as Types from '~/actions/types';

import { AvailableColumnsState } from './types';

const initialState: AvailableColumnsState = {};

export default handleActions({
  [Types.REPLACE_AVAILABLE_COLUMNS]: (state: AvailableColumnsState,
    action: ActionType<typeof replaceAvailableColumns>) =>
    Object.assign({}, action.payload),
}, initialState);
