import * as Types from '../actions/types';
import { AdminAuthState } from './types';
import { handleActions, ReducerMap } from 'redux-actions';
import { ActionType } from 'typesafe-actions';
import { authoriseAdmin, authoriseError } from '../actions';

const initialState: AdminAuthState = {
  error: '',
  message: '',
  authenticated: false,
  user: null,
  authFinished: false,
};

export default handleActions({
  [Types.AUTH_ADMIN]: (state, action: ActionType<typeof authoriseAdmin>) => ({
    user: action.payload,
    error: '',
    message: '',
    authenticated: true,
    authFinished: true,
  }),
  [Types.UNAUTH_ADMIN]: (state) => ({
    ...state,
    authenticated: false,
    user: null,
  }),
  [Types.AUTH_ADMIN_ERROR]: (state, action: ActionType<typeof authoriseError>) => ({
    ...state,
    error: action.payload,
  }),
  [Types.FINISH_ADMIN_AUTH]: (state) => ({
    ...state,
    authFinished: true,
  }),
} as ReducerMap<AdminAuthState, any>, initialState);
