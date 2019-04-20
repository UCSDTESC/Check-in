import { Role } from '@Shared/Roles';
import { TESCUser, TESCEvent } from '@Shared/Types';
import request from 'superagent';
import nocache from 'superagent-no-cache';
import pref from 'superagent-prefix';
import Cookies from 'universal-cookie';
import { UserProfileFormData } from '~/pages/UserPage/components/UserProfile';
import CookieTypes from '~/static/Cookies';

import { promisify, SuccessResponse } from './helpers';

const URL_PREFIX = '/api/user';

const prefix = pref(URL_PREFIX);
const cookies = new Cookies();

export interface JWTAuthUser {
  _id: string;
  username: string;
  role: Role;
  checkin: boolean;
}

interface JWTAuth {
  token: string;
  user: JWTAuthUser;
}

/**
 * Checks whether the user is still authorised.
 * @returns {Promise} A promise of the request.
 */
export const authorised = () => {
  return promisify<{}>(request
    .get('/authorised')
    .set('Authorization', cookies.get(CookieTypes.user.token))
    .use(prefix)
    .use(nocache));
};

/**
 * Log in as a user.
 * @param  {String} email The email of the login.
 * @param  {String} password The password of the login.
 * @returns {Promise} A promise of the request.
 */
export const login = (email: string, password: string) => {
  return promisify<JWTAuth>(request
    .post('/login')
    .set('Content-Type', 'application/json')
    .send({email, password})
    .use(prefix)
    .use(nocache));
};

/**
 * Requests a password reset for the current user.
 * @param {String} email The email address of the user.
 * @returns {Promise} A promise of the request.
 */
export const forgotPassword = (email: string) => {
  return promisify<SuccessResponse>(request
    .post('/forgot')
    .set('Content-Type', 'application/json')
    .send({email})
    .use(prefix)
    .use(nocache));
};

/**
 * Resets the password for the given user.
 * @param {String} id The ID of the account to reset.
 * @param {String} newPassword The new password to associate with the user.
 * @returns {Promise} A promise of the request.
 */
export const resetPassword = (id: string, newPassword: string) => {
  return promisify<SuccessResponse>(request
    .post('/reset')
    .set('Content-Type', 'application/json')
    .send({id, newPassword})
    .use(prefix)
    .use(nocache));
};

/**
 * Get the information about the current user.
 * @param {String} eventAlias The alias of the event for which to fetch data.
 * @returns {Promise} A promise of the request.
 */
export const getCurrentUser = (eventAlias: string) => {
  return promisify<TESCUser>(request
    .get(`/current/${eventAlias}`)
    .set('Content-Type', 'application/json')
    .set('Authorization', cookies.get(CookieTypes.user.token))
    .use(prefix)
    .use(nocache));
};

/**
 * Get a list of events for which the user has applied.
 * @returns {Promise} A promise of the request.
 */
export const getUserEvents = () => {
  return promisify<TESCEvent[]>(request
    .get('/events')
    .set('Content-Type', 'application/json')
    .set('Authorization', cookies.get(CookieTypes.user.token))
    .use(prefix));
};

/**
 * Updates a field for a given user.
 * @returns {Promise} A promise of the request.
 */
export const updateUserField = (user: UserProfileFormData, eventAlias: string) => {
  const postObject: UserProfileFormData = Object.assign({}, user);

  if (user.newResume) {
    delete postObject.newResume;
  }

  return promisify<TESCUser>(request
    .post(`/update/${eventAlias}`)
    .field({
      ...postObject,
    } as any)
    .attach('resume', user.newResume ? user.newResume[0] : null)
    .set('Authorization', cookies.get(CookieTypes.user.token))
    .use(prefix)
    .use(nocache));
};

/**
 * RSVPs the current user.
 * @param {String} eventAlias The alias of the event to RSVP.
 * @param {Boolean} status True if the user is confirming their spot.
 * @param {Boolean} bussing True if the user is taking the bus, null if the user
 * wasn't offered a seat.
 * @returns {Promise} A promise of the request.
 */
export const rsvpUser = (eventAlias: string, status: boolean, bussing: boolean) => {
  return promisify<TESCUser>(request
    .post(`/rsvp/${eventAlias}`)
    .set('Content-Type', 'application/json')
    .set('Authorization', cookies.get(CookieTypes.user.token))
    .send({status, bussing})
    .use(prefix)
    .use(nocache));
};
