import Cookies from 'universal-cookie';
import nocache from 'superagent-no-cache';
import pref from 'superagent-prefix';
import request from 'superagent';

import {promisify} from './helpers';

import CookieTypes from '~/static/Cookies';

const API_URL_PREFIX = '/api';

const apiPrefix = pref(API_URL_PREFIX);
const cookies = new Cookies();

/**
 * Request a list of all users.
 * @param {String} alias The event alias.
 * @returns {Promise} A promise of the request.
 */
export const loadAllUsers = (alias) =>
  promisify(request
    .get('/users/' + alias)
    .set('Authorization', cookies.get(CookieTypes.admin.token, {path: '/'}))
    .use(apiPrefix));

/**
 * Request user statistics for a given event.
 * @param {String} alias The event alias.
 * @returns {Promise} A promise of the request.
 */
export const loadEventStatistics = (alias) =>
  promisify(request
    .get('/statistics/' + alias)
    .set('Authorization', cookies.get(CookieTypes.admin.token, {path: '/'}))
    .use(apiPrefix));

/**
 * Request a list of all admins.
 * @returns {Promise} A promise of the request.
 */
export const loadAllAdmins = () =>
  promisify(request
    .get('/admins')
    .set('Authorization', cookies.get(CookieTypes.admin.token, {path: '/'}))
    .use(apiPrefix)
    .use(nocache));

/**
 * Request a list of all events that is available to the public.
 * @returns {Promise} A promise of the request.
 */
export const loadAllPublicEvents = () =>
  promisify(request
    .get('/events')
    .use(apiPrefix)
    .use(nocache));

/**
 * Request a list of all events the user has access to.
 * @returns {Promise} A promise of the request.
 */
export const loadAllEvents = () =>
  promisify(request
    .get('/admin/events')
    .set('Authorization', cookies.get(CookieTypes.admin.token, {path: '/'}))
    .use(apiPrefix)
    .use(nocache));

/**
 * Requests event information based on a given event alias.
 * @param {String} alias The event alias.
 */
export const loadEventByAlias = (alias) =>
  promisify(request
    .get('/admin/events/' + alias)
    .use(apiPrefix)
    .use(nocache));

/**
 * Request a list of all applicants.
 * @returns {Promise} A promise of the request.
 */
export const loadAllApplicants = () =>
  promisify(request
    .get('/sponsors/applicants')
    .set('Authorization', cookies.get(CookieTypes.admin.token, {path: '/'}))
    .use(apiPrefix)
    .use(nocache));

/**
 * Request the statistics for users.
 * @returns {Promise} A promise of the request.
 */
export const loadUserStats = () =>
  promisify(request
    .get('/stats/users')
    .set('Authorization', cookies.get(CookieTypes.admin.token, {path: '/'}))
    .use(apiPrefix));

/**
 * Request the statistics for universities.
 * @returns {Promise} A promise of the request.
 */
export const loadUniversityStats = () =>
  promisify(request
    .get('/stats/university')
    .set('Authorization', cookies.get(CookieTypes.admin.token, {path: '/'}))
    .use(apiPrefix));

/**
 * Request information about a given user.
 * @param  {String} id The ID of the requested user.
 * @returns {Promise} A promise of the request.
 */
export const loadUser = (id) =>
  promisify(request
    .get('/users/' + id)
    .set('Authorization', cookies.get(CookieTypes.admin.token, {path: '/'}))
    .use(apiPrefix));

/**
 * Request an update for a given user.
 * @param  {String} id The ID of the user.
 * @param  {Object} user The new user object to save.
 * @returns {Promise} A promise of the request.
 */
export const updateUser = (id, eventAlias, user) =>
  promisify(request
    .post('/users/' + eventAlias + '/' + id)
    .send(user)
    .set('Authorization', cookies.get(CookieTypes.admin.token, {path: '/'}))
    .use(apiPrefix));

/**
 * Request a user marked as checked in.
 * @param  {String} id of the user.
 * @param  {String} eventAlias of the event we want to check in to
 * @returns {Promise} A promise of the request.
 */
export const checkinUser = (id, eventAlias) =>
  promisify(request
    .post('/users/checkin/' + eventAlias)
    .send({id})
    .set('Authorization', cookies.get(CookieTypes.admin.token, {path: '/'}))
    .use(apiPrefix));


/**
 * Request to register a new user.
 * @param {String} eventAlias The alias for the event to register for.
 * @param  {Object} user The user fields to register.
 * @returns {Promise} A promise of the request.
 */
export const registerUser = (eventAlias, user) => {
  let baseReq = request
    .post('/register/' + eventAlias)
    .use(apiPrefix)
    .field(user);
  if (user.resume && user.resume.length > 0) {
    baseReq = baseReq.attach('resume', user.resume[0]);
  }
  return promisify(baseReq);
};

/**
 * Request to register a new admin.
 * @param {Object} admin The admin fields to register.
 * @returns {Promise} A promise of the request.
 */
export const registerAdmin = (admin) =>
  promisify(request
    .post('/admins/register')
    .send(admin)
    .set('Authorization', cookies.get(CookieTypes.admin.token, {path: '/'}))
    .use(apiPrefix));

/**
 * Request to delete a new admin.
 * @param {String} adminId The ID of the admin to delete.
 * @returns {Promise} A promise of the request.
 */
export const deleteAdmin = (adminId) =>
  promisify(request
    .post('/admins/delete')
    .send({id: adminId})
    .set('Authorization', cookies.get(CookieTypes.admin.token, {path: '/'}))
    .use(apiPrefix));

/**
 * Request to download a given set of resumes.
 * @param {String[]} applicants An array of User IDs to download
 * @returns {Promise} A promise of the request.
 */
export const downloadResumes = (applicants) =>
  promisify(request
    .post('/sponsors/applicants/download')
    .send({applicants})
    .set('Authorization', cookies.get(CookieTypes.admin.token, {path: '/'}))
    .use(apiPrefix));

/**
 * Requests the status of an ongoing download.
 * @param {String} downloadId The given ID of the download.
 * @returns {Promise} A promise of the request.
 */
export const pollDownload = (downloadId) =>
  promisify(request
    .get('/sponsors/applicants/download/' + downloadId)
    .set('Authorization', cookies.get(CookieTypes.admin.token, {path: '/'}))
    .use(apiPrefix));

/**
 * Requests the download of all users as a CSV file.
 * @param {String} eventAlias The alias associated with the event.
 * @returns {Request} A request object not wrapped in a promise.
 */
export const exportUsers = (eventAlias) =>
  request
    .get('/admin/export/' + eventAlias)
    .set('Authorization', cookies.get(CookieTypes.admin.token, {path: '/'}))
    .use(apiPrefix);
