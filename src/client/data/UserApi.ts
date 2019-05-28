import { TESCUser, TESCEvent } from '@Shared/ModelTypes';
import { USER_API_PREFIX } from '@Shared/api/Paths';
import {
  ResetPasswordRequest, ForgotPasswordRequest, UpdateUserRequest, RSVPUserRequest,
  RegisterUserRequest,
  RegisterUserFields,
  EmailExistsRequest
} from '@Shared/api/Requests';
import {
  SuccessResponse, EmailExistsResponse, EventsWithStatisticsResponse,
  RegisterUserResponse
} from '@Shared/api/Responses';
import { JWTAdminAuth } from '@Shared/api/Responses';
import request from 'superagent';
import nocache from 'superagent-no-cache';
import pref from 'superagent-prefix';
import Cookies from 'universal-cookie';
import { ApplyPageFormData } from '~/pages/ApplyPage';
import { UserProfileFormData } from '~/pages/UserPage/components/UserProfile';
import CookieTypes from '~/static/Cookies';

import { promisify } from './helpers';

const userApiPrefix = pref(USER_API_PREFIX);
const cookies = new Cookies();

/**
 * Checks whether the user is still authorised.
 * @returns {Promise} A promise of the request.
 */
export const authorised = () => {
  return promisify<{}>(request
    .get('/authorised')
    .set('Authorization', cookies.get(CookieTypes.user.token))
    .use(userApiPrefix)
    .use(nocache));
};

/**
 * Log in as a user.
 * @param  {String} email The email of the login.
 * @param  {String} password The password of the login.
 * @returns {Promise} A promise of the request.
 */
export const login = (email: string, password: string) => {
  return promisify<JWTAdminAuth>(request
    .post('/login')
    .set('Content-Type', 'application/json')
    .send({ email, password })
    .use(userApiPrefix)
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
    .send({ email } as ForgotPasswordRequest)
    .use(userApiPrefix)
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
    .send({ id, newPassword } as ResetPasswordRequest)
    .use(userApiPrefix)
    .use(nocache));
};

/**
 * Get the information about the current user.
 * @param {String} eventAlias The alias of the event for which to fetch data.
 * @returns {Promise} A promise of the request.
 */
export const getCurrentUser = (eventAlias: string) => {
  return promisify<TESCUser[]>(request
    .get(`/user`)
    .query({ alias: eventAlias })
    .set('Content-Type', 'application/json')
    .set('Authorization', cookies.get(CookieTypes.user.token))
    .use(userApiPrefix)
    .use(nocache));
};

/**
 * Get a list of events for which the user has applied.
 * @returns {Promise} A promise of the request.
 */
export const getAccountEvents = (accountId: string) => {
  return promisify<TESCEvent[]>(request
    .get(`/account/${accountId}/events`)
    .set('Content-Type', 'application/json')
    .set('Authorization', cookies.get(CookieTypes.user.token))
    .use(userApiPrefix));
};

/**
 * Updates a field for a given user.
 * @returns {Promise} A promise of the request.
 */
export const updateUserField = (user: UserProfileFormData) => {
  const postObject: UserProfileFormData = Object.assign({}, user);

  if (user.newResume) {
    delete postObject.newResume;
  }

  return promisify<TESCUser>(request
    .put(`/user`)
    .field('user', JSON.stringify({
      ...postObject,
    } as UpdateUserRequest))
    .attach('resume', user.newResume ? user.newResume[0] : null)
    .set('Authorization', cookies.get(CookieTypes.user.token))
    .use(userApiPrefix)
    .use(nocache));
};

/**
 * RSVPs the current user.
 * @param {String} userId The ID of the user to RSVP.
 * @param {Boolean} status True if the user is confirming their spot.
 * @param {Boolean} bussing True if the user is taking the bus, null if the user
 * wasn't offered a seat.
 * @returns {Promise} A promise of the request.
 */
export const rsvpUser = (userId: string, status: boolean, bussing: boolean) => {
  return promisify<TESCUser>(request
    .post(`/user/${userId}/rsvp`)
    .set('Content-Type', 'application/json')
    .set('Authorization', cookies.get(CookieTypes.user.token))
    .send({ status, bussing } as RSVPUserRequest)
    .use(userApiPrefix)
    .use(nocache));
};

/**
 * Checks whether the email is already in use.
 * @param {String} email The user email.
 * @returns {Promise} A promise of the request.
 */
export const checkUserExists = (email: string) =>
  promisify<EmailExistsResponse>(
    request
      .post(`/account/exists`)
      .send({ email } as EmailExistsRequest)
      .use(userApiPrefix)
  );

/**
 * Confirms a user account by a given ID.
 * @param {String} accountId The ID of the user account.
 * @returns {Promise} A promise of the request.
 */
export const confirmAccount = (accountId: string) =>
  promisify<SuccessResponse>(
    request
      .post(`/account/${accountId}/confirm`)
      .use(userApiPrefix)
  );

/**
 * Request a list of all events that is available to the public.
 * @returns {Promise} A promise of the request.
 */
export const loadAllPublicEvents = () =>
  promisify<EventsWithStatisticsResponse>(
    request
      .get('/events')
      .use(userApiPrefix)
      .use(nocache)
  );

/**
 * Requests event information based on a given event alias.
 * @param {String} eventAlias The event alias.
 */
export const loadEventByAlias = (eventAlias: string) =>
  promisify<EventsWithStatisticsResponse>(
    request
      .get(`/events`)
      .query({ alias: eventAlias })
      .use(userApiPrefix)
      .use(nocache)
  );

/**
 * Request to register a new user.
 * @param {String} eventAlias The alias for the event to register for.
 * @param  {Object} user The user fields to register.
 * @returns {Promise} A promise of the request.
 */
export const registerUser = (eventAlias: string, user: ApplyPageFormData) => {
  const { resume, ...clearUser } = user;
  const postObject: RegisterUserFields = Object.assign({}, clearUser);

  let baseReq = request
    .post(`/user`)
    .use(userApiPrefix)
    .field('user', JSON.stringify({
      alias: eventAlias,
      user: {
        ...postObject,
      },
    } as RegisterUserRequest));

  if (resume) {
    baseReq = baseReq.attach('resume', resume[0]);
  }
  return promisify<RegisterUserResponse>(baseReq);
};
