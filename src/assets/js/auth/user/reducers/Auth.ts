import * as Types from '../actions/types';
import { UserAuthState } from './types';
import { handleActions, ReducerMap } from 'redux-actions';
import { ActionType } from 'typesafe-actions';
import { authoriseUser, authoriseError } from '../actions';

const initialState: UserAuthState = {
  error: '',
  message: '',
  authenticated: false,
  user: null,
  authFinished: false,
};

export default handleActions({
  [Types.AUTH_USER]: (state, action: ActionType<typeof authoriseUser>) => ({
    error: '',
    message: '',
    authenticated: true,
    user: action.payload,
    authFinished: true,
  }),
  [Types.UNAUTH_USER]: (state) => ({
    ...state,
    authenticated: false,
    user: null,
  }),
  AUTH_ERROR: (state, action: ActionType<typeof authoriseError>) => ({
    ...state,
    error: action.payload,
  }),
  [Types.FINISH_AUTH]: (state) => ({
    ...state,
    authFinished: true,
  }),
  [Types.REMOVE_ERROR]: (state) => ({
    ...state,
    error: '',
  }),
} as ReducerMap<UserAuthState, any>, initialState);
