import * as Auth from '~/data/AdminAuth';

import * as Types from './types';

import Cookies from 'universal-cookie';
import Q from 'q';

import CookieTypes from '~/static/Cookies';
import { ApplicationAction, ApplicationDispatch } from '~/actions';
import { LoginFormData } from '../Login';
import { createStandardAction } from 'typesafe-actions';

const cookies = new Cookies();
const COOKIE_OPTIONS = {
  path: '/',
  maxAge: 3 * 60 * 60,
};

/**
 * Stores cookies from a login response.
 * @param {Object} res HTTP request response object.
 */
function storeLogin(token: string, user: Auth.JWTAuthAdmin) {
  cookies.set(CookieTypes.admin.token, token, COOKIE_OPTIONS);
  cookies.set(CookieTypes.admin.user, user, COOKIE_OPTIONS);
}

/**
 * Dispatches a new error depending on the error status code.
 * @param {Function} dispatch The redux store dispatch function.
 * @param {Object} error The error to dispatch.
 * @param {String} type The type of error to dispatch.
 */
export function errorHandler(dispatch: ApplicationDispatch, error: any) {
  const errorMessage = error.message;

  if (error.status === 401) {
    dispatch(authoriseError('The username or password you entered was not correct.'));
    logoutAdmin();
  } else {
    dispatch(authoriseError(errorMessage));
  }
}

// Auth
/**
 * Attempts to log in as the given user.
 * @param {{username: String, password: String}} User The details of the
 * administrator to login.
 * @returns {Promise} The login request promise.
 */
export const loginAdmin = (loginFormData: LoginFormData): ApplicationAction<Q.Promise<{}>> => (
  (dispatch: ApplicationDispatch) => {
    // Make the event return a promise
    const deferred = Q.defer();

    Auth.login(loginFormData.username, loginFormData.password)
      .then((res) => {
        storeLogin(res.token, res.user);
        dispatch(authoriseAdmin(res.user));
        deferred.resolve();
      })
      .catch((err) => {
        deferred.reject(err.message);
        return errorHandler(dispatch, err);
      });

    return deferred.promise;
  });

/**
 * Logout the current authenticated user.
 * @returns {Function} The function to dispatch.
 */
export const logoutAdmin = (): ApplicationAction => (
  (dispatch: ApplicationDispatch) => {
    dispatch(unauthoriseAdmin());
    cookies.remove(CookieTypes.admin.token, {path: '/'});
    cookies.remove(CookieTypes.admin.user, {path: '/'});
  });

// Return authorisation events

export const authoriseAdmin = createStandardAction(Types.AUTH_ADMIN)<Auth.JWTAuthAdmin>();
export const unauthoriseAdmin = createStandardAction(Types.UNAUTH_ADMIN)<void>();
export const finishAuthorisation = createStandardAction(Types.FINISH_ADMIN_AUTH)<void>();
export const authoriseError = createStandardAction(Types.AUTH_ADMIN_ERROR)<string>();
