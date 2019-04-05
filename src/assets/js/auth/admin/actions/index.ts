import * as Auth from '~/data/AdminAuth';

import * as Types from './types';

import Cookies from 'universal-cookie';
import Q from 'q';

import CookieTypes from '~/static/Cookies';
import { ApplicationAction, ApplicationDispatch } from '~/actions';
import { LoginFormData } from '../Login';

const cookies = new Cookies();
const COOKIE_OPTIONS = {
  path: '/',
  maxAge: 3 * 60 * 60,
};

/**
 * Stores cookies from a login response.
 * @param {Object} res HTTP request response object.
 */
function storeLogin(token: string, user: string) {
  cookies.set(CookieTypes.admin.token, token, COOKIE_OPTIONS);
  cookies.set(CookieTypes.admin.user, user, COOKIE_OPTIONS);
}

/**
 * Dispatches a new error depending on the error status code.
 * @param {Function} dispatch The redux store dispatch function.
 * @param {Object} error The error to dispatch.
 * @param {String} type The type of error to dispatch.
 */
export function errorHandler(dispatch: ApplicationDispatch, error: any, type: string) {
  const errorMessage = error.message;

  if (error.status === 401) {
    dispatch({
      type: type,
      payload: 'The username or password you entered was not correct.',
    });
    logoutUser();
  } else {
    dispatch({
      type: type,
      payload: errorMessage,
    });
  }
}

// Auth
/**
 * Attempts to log in as the given user.
 * @param {{username: String, password: String}} User The details of the
 * administrator to login.
 * @returns {Promise} The login request promise.
 */
export const loginUser = (loginFormData: LoginFormData): ApplicationAction => (
  (dispatch: ApplicationDispatch) => {
    // Make the event return a promise
    const deferred = Q.defer();

    Auth.login(loginFormData.username, loginFormData.password)
      .end((err, res) => {
        if (err) {
          deferred.reject(res.error.message);
          return errorHandler(dispatch, res.error, Types.AUTH_ERROR);
        }

        storeLogin(res.body.token, res.body.user);
        dispatch({
          type: Types.AUTH_USER,
          payload: res.body.user,
        });
        deferred.resolve();
      });

    return deferred.promise;
  });

/**
 * Logout the current authenticated user.
 * @returns {Function} The function to dispatch.
 */
export const logoutUser = (): ApplicationAction => (
  (dispatch: ApplicationDispatch) => {
    dispatch({type: Types.UNAUTH_USER});
    cookies.remove(CookieTypes.admin.token, {path: '/'});
    cookies.remove(CookieTypes.admin.user, {path: '/'});
  });
