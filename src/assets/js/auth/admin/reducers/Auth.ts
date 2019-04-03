import {Reducer} from 'redux';
import {
  AUTH_ERROR,
  AUTH_USER,
  UNAUTH_USER,
  FINISH_AUTH
} from '../actions/types';
import { AdminAuthState } from './types';

const INITIAL_STATE:AdminAuthState = {
  error: '',
  message: '',
  authenticated: false,
  user: {},
  authFinished: false
};

const adminAuth: Reducer<AdminAuthState> = (state:AdminAuthState = INITIAL_STATE, action) => {
  switch (action.type) {
  case AUTH_USER:
    return {...state, error: '', message: '', authenticated: true,
      user: action.payload, authFinished: true};
  case UNAUTH_USER:
    return {...state, authenticated: false, user: {}};
  case AUTH_ERROR:
    return {...state, error: action.payload};
  case FINISH_AUTH:
    return {...state, authFinished: true};
  }

  return state;
};

export default adminAuth;
