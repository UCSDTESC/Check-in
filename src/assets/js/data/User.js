import Cookies from 'universal-cookie';
import nocache from 'superagent-no-cache';
import pref from 'superagent-prefix';
import request from 'superagent';

import {promisify} from './helpers';

import CookieTypes from '~/static/Cookies';

const URL_PREFIX = '/user';

const prefix = pref(URL_PREFIX);
const cookies = new Cookies();

/**
 * Log in as a user.
 * @param  {String} email The email of the login.
 * @param  {String} password The password of the login.
 * @returns {Promise} A promise of the request.
 */
export const login = (email, password) => {
  return promisify(request
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
export const forgotPassword = (email) => {
  return promisify(request
    .post('/api/forgot')
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
export const resetPassword = (id, newPassword) => {
  return promisify(request
    .post('/api/reset')
    .set('Content-Type', 'application/json')
    .send({id, newPassword})
    .use(prefix)
    .use(nocache));
};

/**
 * Get the information about the current user.
 * @returns {Promise} A promise of the request.
 */
export const getCurrentUser = () => {
  return promisify(request
    .get('/api/current')
    .set('Content-Type', 'application/json')
    .set('Authorization', cookies.get(CookieTypes.user.token, {path: '/'}))
    .use(prefix)
    .use(nocache));
};

/**
 * Updates a field for a given user.
 * @returns {Promise} A promise of the request.
 */
export const updateUserField = (user) => {
  return promisify(request
    .post('/api/update')
    .field(user)
    .attach('resume', user.resume ? user.resume[0] : null)
    .set('Authorization', cookies.get(CookieTypes.user.token, {path: '/'}))
    .use(prefix)
    .use(nocache));
};

/**
 * RSVPs the current user..
 * @param {Boolean} status True if the user is confirming their spot.
 * @param {Boolean} bussing True if the user is taking the bus, null if the user
 * wasn't offered a seat.
 * @returns {Promise} A promise of the request.
 */
export const rsvpUser = (status, bussing) => {
  return promisify(request
    .post('/api/rsvp')
    .set('Content-Type', 'application/json')
    .set('Authorization', cookies.get(CookieTypes.user.token, {path: '/'}))
    .send({status, bussing})
    .use(prefix)
    .use(nocache));
};
