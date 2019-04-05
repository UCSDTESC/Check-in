import * as Auth from '~/data/User';

import * as Types from './types';

import {deleteUserEvents, ApplicationDispatch, ApplicationAction} from '~/actions';

import Cookies from 'universal-cookie';
import Q from 'q';

import CookieTypes from '~/static/Cookies';
import { LoginFormData } from '../Login';

const cookies = new Cookies();
const COOKIE_OPTIONS = {
  path: '/',
  maxAge: 7 * 24 * 60 * 60,
};

/**
 * Stores cookies from a login response.
 * @param {Object} res HTTP request response object.
 */
function storeLogin(token: string, user: Auth.JWTAuthUser) {
  cookies.set(CookieTypes.user.token, token, COOKIE_OPTIONS);
  cookies.set(CookieTypes.user.user, user, COOKIE_OPTIONS);
}

export function errorHandler(dispatch: ApplicationDispatch, error: any, type: string) {
  const errorMessage = error.message;

  if (error.status === 401) {
    dispatch({
      type: type,
      payload: 'Unable to find an account with that email and password',
    });
    logoutUser();
  } else {
    dispatch({
      type: type,
      payload: errorMessage,
    });
  }
}

export function removeError(dispatch: ApplicationDispatch) {
  dispatch({
    type: Types.REMOVE_ERROR,
  });
}

export const loginUser = (loginFormData: LoginFormData): ApplicationAction => (
  (dispatch: ApplicationDispatch) => {
    // Make the event return a promise
    const deferred = Q.defer();
    removeError(dispatch);

    Auth.login(loginFormData.email, loginFormData.password)
      .then((res) => {
        storeLogin(res.token, res.user);
        dispatch({
          type: Types.AUTH_USER,
          payload: res.user,
        });
        deferred.resolve();
      })
      .catch((err) => {
        deferred.reject(err.message);
        return errorHandler(dispatch, err, Types.AUTH_ERROR);
      });

    return deferred.promise;
  });

export const logoutUser = (): ApplicationAction => (
  (dispatch: ApplicationDispatch) => {
    dispatch({type: Types.UNAUTH_USER});
    dispatch(deleteUserEvents());
    cookies.remove(CookieTypes.user.token, {path: '/'});
    cookies.remove(CookieTypes.user.user, {path: '/'});
  });
