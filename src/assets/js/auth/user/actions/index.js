import * as Auth from '~/data/User';

import * as Types from './types';

import {deleteUserEvents} from '~/actions';

import Cookies from 'universal-cookie';
import Q from 'q';

import CookieTypes from '~/static/Cookies';

const cookies = new Cookies();
const COOKIE_OPTIONS = {
  path: '/',
  maxAge: 7 * 24 * 60 * 60
};

/**
 * Stores cookies from a login response.
 * @param {Object} res HTTP request response object.
 */
function storeLogin(res) {
  cookies.set(CookieTypes.user.token, res.token, COOKIE_OPTIONS);
  cookies.set(CookieTypes.user.user, res.user, COOKIE_OPTIONS);
}

export function errorHandler(dispatch, error, type) {
  let errorMessage = error.message;

  if (error.status === 401) {
    dispatch({
      type: type,
      payload: 'Unable to find an account with that email and password'
    });
    logoutUser();
  } else {
    dispatch({
      type: type,
      payload: errorMessage
    });
  }
}

export function removeError(dispatch) {
  dispatch({
    type: Types.REMOVE_ERROR
  });
}

export function loginUser({email, password}) {
  return function(dispatch) {
    // Make the event return a promise
    var deferred = Q.defer();
    removeError(dispatch);

    Auth.login(email, password)
      .then((res) => {
        storeLogin(res);
        dispatch({
          type: Types.AUTH_USER,
          payload: res.user
        });
        deferred.resolve();
      })
      .catch((err) => {
        deferred.reject(err.message);
        return errorHandler(dispatch, err, Types.AUTH_ERROR);
      });

    return deferred.promise;
  };
};

export function logoutUser() {
  return function(dispatch) {
    dispatch({type: Types.UNAUTH_USER});
    dispatch(deleteUserEvents());
    cookies.remove(CookieTypes.user.token, {path: '/'});
    cookies.remove(CookieTypes.user.user, {path: '/'});
  };
};
