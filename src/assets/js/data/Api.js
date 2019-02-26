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
 * Checks whether the user is still authorised.
 * @returns {Promise} A promise of the request.
 */
export const authorised = () =>
  promisify(request
    .get('/auth/authorised')
    .set('Authorization', cookies.get(CookieTypes.admin.token, {path: '/'}))
    .use(apiPrefix)
    .use(nocache));

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
 * Checks whether the email is already in use.
 * @param {String} email The user email.
 * @returns {Promise} A promise of the request.
 */
export const checkUserExists = (email) =>
  promisify(request
    .get('/verify/' + email)
    .use(apiPrefix));

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
 * @param {String} eventAlias The event alias.
 */
export const loadEventByAlias = (eventAlias) =>
  promisify(request
    .get('/admin/events/' + eventAlias)
    .use(apiPrefix)
    .use(nocache));

/**
 * Request a list of all applicants.
 * @param {String} eventAlias The event alias.
 * @returns {Promise} A promise of the request.
 */
export const loadAllApplicants = (eventAlias) =>
  promisify(request
    .get('/sponsors/applicants/' + eventAlias)
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

export const registerNewEvent = (event) =>
  promisify(request
    .post('/admin/events')
    .set('Authorization', cookies.get(CookieTypes.admin.token, {path: '/'}))
    .field(event)
    .attach('logo', event.logo[0])
    .use(apiPrefix)
    .use(nocache));

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
    .post('/sponsors/download')
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
    .get('/sponsors/downloads/' + downloadId)
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


/**
 * Requests the download of all teams as a CSV file.
 * @param {String} eventAlias The alias associated with the event.
 * @returns {Promise} A promise of the request.
 */
export const exportTeams = (eventAlias) =>
  request
      .get('/admin/exportTeams/' + eventAlias)
      .set('Authorization', cookies.get(CookieTypes.admin.token, {path: '/'}))
      .use(apiPrefix);

/**
 * Bulk updates a list of users to all have the same status.
 * @param {String} users A newline-delimited list of User IDs.
 * @param {String} status The new status string for all of the users
 * @returns {Promise} A promise of the request.
 */
export const bulkChange = (users, status) =>
  promisify(request
    .post('/admin/bulkChange')
    .send({users, status})
    .set('Authorization', cookies.get(CookieTypes.admin.token, {path: '/'}))
    .use(apiPrefix));

/**
 * Request an update for the event options.
 * @param  {String} eventAlias The alias for the event.
 * @param  {Object} options The new event options.
 * @returns {Promise} A promise of the request.
 */
export const updateOptions = (eventAlias, options) =>
  promisify(request
    .post('/admin/update/' + eventAlias)
    .send({options})
    .set('Authorization', cookies.get(CookieTypes.admin.token, {path: '/'}))
    .use(apiPrefix));

/**
 * Request a list of columns that define the user.
 * @returns {Promise} A promise of the request.
 */
export const loadColumns = () =>
  promisify(request
    .get('/admin/columns')
    .set('Authorization', cookies.get(CookieTypes.admin.token, {path: '/'}))
    .use(apiPrefix)
    .use(nocache));

/**
 * Request a list of sponsors.
 * @returns {Promise} A promise of the request.
 */
export const loadSponsors = () =>
  promisify(request
    .get('/admin/sponsors')
    .set('Authorization', cookies.get(CookieTypes.admin.token, {path: '/'}))
    .use(apiPrefix)
    .use(nocache));

/**
 * Request to add a new sponsor to an event.
 * @returns {Promise} A promise of the request.
 */
export const addNewSponsor = (eventAlias, sponsorId) =>
  promisify(request
    .post('/admin/addSponsor/' + eventAlias)
    .send({sponsor: sponsorId})
    .set('Authorization', cookies.get(CookieTypes.admin.token, {path: '/'}))
    .use(apiPrefix)
    .use(nocache));

/**
 * Request to add a new organiser to an event.
 * @returns {Promise} A promise of the request.
 */
export const addNewOrganiser = (eventAlias, adminId) =>
  promisify(request
    .post('/admin/addOrganiser/' + eventAlias)
    .send({admin: adminId})
    .set('Authorization', cookies.get(CookieTypes.admin.token, {path: '/'}))
    .use(apiPrefix)
    .use(nocache));
