import * as Auth from '~/data/User';

import * as Types from './types';

import Cookies from 'universal-cookie';
import Q from 'q';

import CookieTypes from '~/static/Cookies';

const cookies = new Cookies();

function storeLogin(res) {
  cookies.set(CookieTypes.user.token, res.token, {path: '/'});
  cookies.set(CookieTypes.user.user, res.user, {path: '/'});
}

export function errorHandler(dispatch, error, type) {
  let errorMessage = error.message;

  if (error.status === 401) {
    dispatch({
      type: type,
      payload: 'Unable to log in with that username and password.'
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

export function loginUser({username, password}) {
  return function(dispatch) {
    // Make the event return a promise
    var deferred = Q.defer();
    removeError(dispatch);

    Auth.login(username, password)
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
    cookies.remove(CookieTypes.user.token, {path: '/'});
    cookies.remove(CookieTypes.user.user, {path: '/'});
  };
};
