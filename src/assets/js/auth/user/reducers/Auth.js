import {
  AUTH_ERROR,
  AUTH_USER,
  UNAUTH_USER,
  REMOVE_ERROR,
  FINISH_AUTH
} from '../actions/types';

const INITIAL_STATE = {
  error: '',
  message: '',
  authenticated: false,
  user: {},
  authFinished: false
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
  case AUTH_USER:
    return {...state, error: '', message: '', authenticated: true,
      user: action.payload, authFinished: true};
  case UNAUTH_USER:
    return {...state, authenticated: false, user: {}};
  case AUTH_ERROR:
    return {...state, error: action.payload};
  case REMOVE_ERROR:
    return {...state, error: ''};
  case FINISH_AUTH:
    return {...state, authFinished: true};
  }

  return state;
};
