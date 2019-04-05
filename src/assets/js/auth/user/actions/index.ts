import * as Auth from '~/data/User';

import * as Types from './types';

import {deleteUserEvents, ApplicationDispatch, ApplicationAction} from '~/actions';

import Cookies from 'universal-cookie';
import Q from 'q';

import CookieTypes from '~/static/Cookies';
import { LoginFormData } from '../Login';
import { createStandardAction } from 'typesafe-actions';

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

export function errorHandler(dispatch: ApplicationDispatch, error: any) {
  const errorMessage = error.message;

  if (error.status === 401) {
    dispatch(authoriseError('Unable to find an account with that email and password'));
    logoutUser();
  } else {
    dispatch(authoriseError(errorMessage));
  }
}

export const loginUser = (loginFormData: LoginFormData): ApplicationAction<Q.Promise<{}>> => (
  (dispatch: ApplicationDispatch) => {
    // Make the event return a promise
    const deferred = Q.defer();
    dispatch(removeError());

    Auth.login(loginFormData.email, loginFormData.password)
      .then((res) => {
        storeLogin(res.token, res.user);
        dispatch(authoriseUser(res.user));
        deferred.resolve();
      })
      .catch((err) => {
        deferred.reject(err.message);
        return errorHandler(dispatch, err);
      });

    return deferred.promise;
  });

export const logoutUser = (): ApplicationAction => (
  (dispatch: ApplicationDispatch) => {
    dispatch(unauthoriseUser());
    dispatch(deleteUserEvents());
    cookies.remove(CookieTypes.user.token, {path: '/'});
    cookies.remove(CookieTypes.user.user, {path: '/'});
  });

// Return authorisation events

export const authoriseUser = createStandardAction(Types.AUTH_USER)<Auth.JWTAuthUser>();
export const unauthoriseUser = createStandardAction(Types.UNAUTH_USER)<void>();
export const finishAuthorisation = createStandardAction(Types.FINISH_AUTH)<void>();
export const authoriseError = createStandardAction(Types.AUTH_ERROR)<string>();
export const removeError = createStandardAction(Types.REMOVE_ERROR)<void>();
