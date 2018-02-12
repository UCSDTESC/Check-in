import * as Auth from '~/data/AdminAuth';

import * as Types from './types';

import Cookies from 'universal-cookie';
import Q from 'q';

import CookieTypes from '~/static/Cookies';

const cookies = new Cookies();

/**
 * Stores cookies from a login response.
 * @param {Object} res HTTP request response object.
 */
function storeLogin(res) {
  cookies.set(CookieTypes.admin.token, res.body.token, {path: '/'});
  cookies.set(CookieTypes.admin.user, res.body.user, {path: '/'});
}

/**
 * Dispatches a new error depending on the error status code.
 * @param {Function} dispatch The redux store dispatch function.
 * @param {Object} error The error to dispatch.
 * @param {String} type The type of error to dispatch.
 */
export function errorHandler(dispatch, error, type) {
  let errorMessage = error.message;

  if (error.status === 401) {
    dispatch({
      type: type,
      payload: 'The username or password you entered was not correct.'
    });
    logoutUser();
  } else {
    dispatch({
      type: type,
      payload: errorMessage
    });
  }
}

// Auth
/**
 * Registers a new user and handles the errors.
 * @param {{username: String, password: String}} User The details of the new
 * administrator to register.
 * @returns {Promise} The registration request promise.
 */
export function registerUser({username, password}) {
  return function(dispatch) {
    var deferred = Q.defer();

    Auth.register(username, password)
      .end((err, res) => {
        if (err) {
          let error = {
            message: res.body.error,
            status: res.error.status
          };
          deferred.reject(res.body.error);
          return errorHandler(dispatch, error, Types.AUTH_ERROR);
        }

        storeLogin(res);
        dispatch({
          type: Types.AUTH_USER,
          payload: res.body.user
        });
        deferred.resolve();
      });

    return deferred.promise;
  };
};

/**
 * Attempts to log in as the given user.
 * @param {{username: String, password: String}} User The details of the
 * administrator to login.
 * @returns {Promise} The login request promise.
 */
export function loginUser({username, password}) {
  return function(dispatch) {
    // Make the event return a promise
    var deferred = Q.defer();

    Auth.login(username, password)
      .end((err, res) => {
        if (err) {
          deferred.reject(res.error.message);
          return errorHandler(dispatch, res.error, Types.AUTH_ERROR);
        }

        storeLogin(res);
        dispatch({
          type: Types.AUTH_USER,
          payload: res.body.user
        });
        deferred.resolve();
      });

    return deferred.promise;
  };
};

/**
 * Logout the current authenticated user.
 * @returns {Function} The function to dispatch.
 */
export function logoutUser() {
  return function(dispatch) {
    dispatch({type: Types.UNAUTH_USER});
    cookies.remove(CookieTypes.admin.token, {path: '/'});
    cookies.remove(CookieTypes.admin.user, {path: '/'});
  };
};
