import {
  TESCUser, Admin, TESCEventOptions, Question, Download,
  TESCEvent,
  TESCTeam
} from '@Shared/ModelTypes';
import { QuestionType } from '@Shared/Questions';
import { ADMIN_API_PREFIX } from '@Shared/api/Paths';
import {
  AddCustomQuestionRequest, UpdateCustomQuestionRequest, DeleteCustomQuestionRequest,
  BulkChangeRequest, UpdateEventOptionsRequest, AddSponsorRequest,
  AddOrganiserRequest,
  DownloadResumesRequest,
  RegisterAdminRequest,
  CheckinUserRequest,
  RegisterEventRequest,
  StatusEmailRequest,
  ExportUsersRequest,
  AddTeamMembersRequest,
  RemoveTeamMembersRequest
} from '@Shared/api/Requests';
import { SuccessResponse, ColumnResponse, JWTAdminAuth } from '@Shared/api/Responses';
import { EventStatistics, GetSponsorsResponse, EventsWithStatisticsResponse } from '@Shared/api/Responses';
import moment from 'moment';
import request, { SuperAgentRequest } from 'superagent';
import nocache from 'superagent-no-cache';
import pref from 'superagent-prefix';
import Cookies from 'universal-cookie';
import { NewAdminModalFormData } from '~/components/NewAdminModal';
import { EventFormData } from '~/components/EventForm';
import CookieTypes from '~/static/Cookies';

import { promisify } from './helpers';

const adminApiPrefix = pref(ADMIN_API_PREFIX);
const cookies = new Cookies();

/**
 * Checks whether the user is still authorised.
 * @returns {Promise} A promise of the request.
 */
export const authorised = () =>
  promisify<{}>(
    request
      .get('/authorised')
      .set('Authorization', cookies.get(CookieTypes.admin.token))
      .use(adminApiPrefix)
      .use(nocache)
  );

/**
 * Requests a login for the given administrator.
 * @param  {String} username The username of the login.
 * @param  {String} password The password of the login.
 * @returns {Object} A superagent request object.
 */
export const login = (username: string, password: string) => {
  return promisify<JWTAdminAuth>(request
    .post('/login')
    .set('Content-Type', 'application/json')
    .send({ username, password })
    .use(adminApiPrefix)
    .use(nocache));
};

/**
 * Request a list of all users.
 * @returns {Promise} A promise of the request.
 */
export const loadAllUsers = (eventId: string) =>
  promisify<TESCUser[]>(
    request
      .get(`/events/${eventId}/users`)
      .set('Authorization', cookies.get(CookieTypes.admin.token))
      .use(adminApiPrefix)
  );

/**
 * Request user statistics for a given event.
 * @param {String} alias The event alias.
 * @returns {Promise} A promise of the request.
 */
export const loadEventStatistics = (alias: string) =>
  promisify<EventStatistics>(
    request
      .get(`/statistics`)
      .query({ alias: alias })
      .set('Authorization', cookies.get(CookieTypes.admin.token))
      .use(adminApiPrefix)
  );

/**
 * Request a list of all admins.
 * @returns {Promise} A promise of the request.
 */
export const loadAllAdmins = () =>
  promisify<Admin[]>(
    request
      .get('/admins')
      .set('Authorization', cookies.get(CookieTypes.admin.token))
      .use(adminApiPrefix)
      .use(nocache)
  );

/**
 * Request a list of all events the user has access to.
 * @returns {Promise} A promise of the request.
 */
export const loadAllEvents = () =>
  promisify<EventsWithStatisticsResponse>(
    request
      .get('/events')
      .set('Authorization', cookies.get(CookieTypes.admin.token))
      .use(adminApiPrefix)
      .use(nocache)
  );

/**
 * Request a list of all applicants.
 * @returns {Promise} A promise of the request.
 */
export const loadAllSponsorUsers = (eventId: string) =>
  promisify<TESCUser[]>(
    request
      .get(`/events/${eventId}/sponsor-users`)
      .set('Authorization', cookies.get(CookieTypes.admin.token))
      .use(adminApiPrefix)
      .use(nocache)
  );

/**
 * Request a list of all teams.
 * @returns {Promise} A promise of the request.
 */
export const loadAllTeams = (eventId: string) =>
  promisify<TESCTeam[]>(
    request
      .get(`/events/${eventId}/teams`)
      .set('Authorization', cookies.get(CookieTypes.admin.token))
      .use(adminApiPrefix)
      .use(nocache)
  );

/**
 * Request an update for a given user.
 * @param  {Object} user The new user object to save.
 * @returns {Promise} A promise of the request.
 */
export const updateUser = (user: TESCUser) =>
  promisify<SuccessResponse>(
    request
      .post(`/users`)
      .send(user)
      .set('Authorization', cookies.get(CookieTypes.admin.token))
      .use(adminApiPrefix)
  );

/**
 * Request a user marked as checked in.
 * @param  {String} id of the user.
 * @returns {Promise} A promise of the request.
 */
export const checkinUser = (id: string, eventId: string) =>
  promisify<SuccessResponse>(
    request
      .post(`/events/${eventId}/checkin`)
      .send({ id } as CheckinUserRequest)
      .set('Authorization', cookies.get(CookieTypes.admin.token))
      .use(adminApiPrefix)
  );

export const registerNewEvent = (event: EventFormData) => {
  const { logo, closeTimeDay, closeTimeMonth, closeTimeYear, ...eventWithoutFields } = event;
  const closeTime: string = moment(new Date(
    closeTimeYear,
    closeTimeMonth,
    closeTimeDay
  )).toISOString(true);
  return promisify<TESCEvent>(
    request
      .post('/events')
      .set('Authorization', cookies.get(CookieTypes.admin.token))
      .field('event', JSON.stringify({
        ...eventWithoutFields,
        closeTime,
      } as RegisterEventRequest))
      .attach('logo', logo[0])
      .use(adminApiPrefix)
      .use(nocache)
  );
};

export const editExistingEvent = (id: string, event: Partial<EventFormData>) => {
  const { logo, closeTimeDay, closeTimeMonth, closeTimeYear, ...eventWithoutFields } = event;
  const closeTime: string = moment(new Date(
    closeTimeYear,
    closeTimeMonth,
    closeTimeDay
  )).toISOString(true);


  const promiseReq = request
    .patch(`/events/${id}`)
    .set('Authorization', cookies.get(CookieTypes.admin.token))
    .field('event', JSON.stringify({
      ...eventWithoutFields,
      closeTime,
    } as RegisterEventRequest))
    .use(adminApiPrefix)
    .use(nocache)

  if (logo) {
    promiseReq.attach('logo', logo[0])
  }

  return promisify<void>(promiseReq);
}

export const addUsersToTeam = (emails: string[], eventId: string, teamId: string) =>
  promisify(request
    .post(`/events/${eventId}/teams/${teamId}/add-members`)
    .send({ emails } as AddTeamMembersRequest)
    .set('Authorization', cookies.get(CookieTypes.admin.token))
    .use(adminApiPrefix)
    .use(nocache)
  )

export const removeUsersFromTeam = (emails: string[], eventId: string, teamId: string) =>
  promisify(request
    .post(`/events/${eventId}/teams/${teamId}/remove-members`)
    .send({ emails } as RemoveTeamMembersRequest)
    .set('Authorization', cookies.get(CookieTypes.admin.token))
    .use(adminApiPrefix)
    .use(nocache)
  )

/**
 * Request to register a new admin.
 * @param {Object} admin The admin fields to register.
 * @returns {Promise} A promise of the request.
 */
export const registerAdmin = (admin: NewAdminModalFormData) =>
  promisify<Admin>(
    request
      .post('/admins')
      .send(admin as RegisterAdminRequest)
      .set('Authorization', cookies.get(CookieTypes.admin.token))
      .use(adminApiPrefix)
  );

/**
 * Request to delete a new admin.
 * @param {String} adminId The ID of the admin to delete.
 * @returns {Promise} A promise of the request.
 */
export const deleteAdmin = (adminId: string) =>
  promisify<SuccessResponse>(
    request
      .delete(`/admins/${adminId}`)
      .set('Authorization', cookies.get(CookieTypes.admin.token))
      .use(adminApiPrefix)
  );

/**
 * Request to download a given set of resumes.
 * @param {String[]} applicants An array of User IDs to download
 * @returns {Promise} A promise of the request.
 */
export const downloadResumes = (applicants: string[]): SuperAgentRequest =>
  request
    .post('/resumes')
    .send({ applicants } as DownloadResumesRequest)
    .set('Authorization', cookies.get(CookieTypes.admin.token))
    .use(adminApiPrefix)

/**
 * Requests the status of an ongoing download.
 * @param {String} downloadId The given ID of the download.
 * @returns {Promise} A promise of the request.
 */
export const pollDownload = (downloadId: string) =>
  promisify<Download>(
    request
      .get(`/resumes/${downloadId}`)
      .set('Authorization', cookies.get(CookieTypes.admin.token))
      .use(adminApiPrefix)
  );

/**
 * Requests the download of all users as a CSV file. Returned as a request since
 * it downloads a CSV blob.
 * @param {String} eventAlias The alias associated with the event.
 * @param {boolean} emailsOnly True if only want to export emails.
 * @returns {Request} A request object not wrapped in a promise.
 */
export const exportUsers = (eventAlias: string, emailsOnly: boolean): SuperAgentRequest =>
  request
    .post(`/export/`)
    .send({ alias: eventAlias, emailsOnly: emailsOnly } as ExportUsersRequest)
    .set('Authorization', cookies.get(CookieTypes.admin.token))
    .use(adminApiPrefix);

/**
 * Bulk updates a list of users to all have the same status.
 * @param {String[]} users A list of User IDs.
 * @param {String} status The new status string for all of the users
 * @returns {Promise} A promise of the request.
 */
export const bulkChange = (users: string[], status: string) =>
  promisify<SuccessResponse>(
    request
      .patch('/users')
      .send({ users, status } as BulkChangeRequest)
      .set('Authorization', cookies.get(CookieTypes.admin.token))
      .use(adminApiPrefix)
  );

/**
 * Request an update for the event options.
 * @param  {String} eventAlias The alias for the event.
 * @param  {Object} options The new event options.
 * @returns {Promise} A promise of the request.
 */
export const updateOptions = (eventAlias: string, options: TESCEventOptions) =>
  promisify<SuccessResponse>(
    request
      .put(`/events`)
      .send({ alias: eventAlias, options } as UpdateEventOptionsRequest)
      .set('Authorization', cookies.get(CookieTypes.admin.token))
      .use(adminApiPrefix)
  );

/**
 * Request a list of columns that define the user.
 * @returns {Promise} A promise of the request.
 */
export const loadColumns = () =>
  promisify<ColumnResponse>(
    request
      .get('/columns')
      .set('Authorization', cookies.get(CookieTypes.admin.token))
      .use(adminApiPrefix)
      .use(nocache)
  );

/**
 * Request a list of sponsors.
 * @returns {Promise} A promise of the request.
 */
export const loadSponsors = () =>
  promisify<GetSponsorsResponse>(
    request
      .get('/sponsors')
      .set('Authorization', cookies.get(CookieTypes.admin.token))
      .use(adminApiPrefix)
      .use(nocache)
  );

/**
 * Request to add a new sponsor to an event.
 * @returns {Promise} A promise of the request.
 */
export const addSponsor = (eventId: string, sponsorId: string) =>
  promisify<SuccessResponse>(
    request
      .post(`/events/${eventId}/sponsors`)
      .send({ sponsorId: sponsorId } as AddSponsorRequest)
      .set('Authorization', cookies.get(CookieTypes.admin.token))
      .use(adminApiPrefix)
      .use(nocache)
  );

/**
 * Request to add a new organiser to an event.
 * @returns {Promise} A promise of the request.
 */
export const addOrganiser = (eventId: string, adminId: string) =>
  promisify<SuccessResponse>(
    request
      .post(`/events/${eventId}/organisers`)
      .send({ organiserId: adminId } as AddOrganiserRequest)
      .set('Authorization', cookies.get(CookieTypes.admin.token))
      .use(adminApiPrefix)
      .use(nocache)
  );

/**
 * Add a new custom question to a given event.
 * @param {String} eventAlias The alias for the event.
 * @param {Object} question The question object to post.
 * @param {QuestionType} type The question type.
 */
export const addCustomQuestion = (eventAlias: string, question: Question, type: QuestionType) =>
  promisify<SuccessResponse>(
    request
      .post(`/customQuestion`)
      .send({ alias: eventAlias, question, type } as AddCustomQuestionRequest)
      .set('Authorization', cookies.get(CookieTypes.admin.token))
      .use(adminApiPrefix)
      .use(nocache)
  );

/**
 * Update a custom question for a given event.
 * @param {String} eventAlias The alias for the event.
 * @param {Object} question The updated question object.
 */
export const updateCustomQuestion = (eventAlias: string, question: Question) =>
  promisify<SuccessResponse>(
    request
      .put(`/customQuestion`)
      .send({ alias: eventAlias, question } as UpdateCustomQuestionRequest)
      .set('Authorization', cookies.get(CookieTypes.admin.token))
      .use(adminApiPrefix)
      .use(nocache)
  );

/**
 * Delete a custom question from a given event.
 * @param {String} eventAlias The alias for the event.
 * @param {Object} question The existing question to delete.
 * @param {QuestionType} type The question type.
 */
export const deleteCustomQuestion = (eventAlias: string, question: Question, type: QuestionType) =>
  promisify<SuccessResponse>(
    request
      .delete(`/customQuestion`)
      .send({ alias: eventAlias, question, type } as DeleteCustomQuestionRequest)
      .set('Authorization', cookies.get(CookieTypes.admin.token))
      .use(adminApiPrefix)
      .use(nocache)
  );

/**
 * Send an acceptance email to a user
 * @param {TESCUser} user The user to send the email to
 */
export const sendAcceptanceEmail = (user: TESCUser) =>
  promisify<SuccessResponse>(
    request
      .post(`/emails/acceptance`)
      .set('Authorization', cookies.get(CookieTypes.admin.token))
      .send({ user } as StatusEmailRequest)
      .use(adminApiPrefix)
      .use(nocache)
  );

/**
 * Send a rejection email to a user
 * @param {TESCUser} user The user to send the email to
 */
export const sendRejectionEmail = (user: TESCUser) =>
  promisify<SuccessResponse>(
    request
      .post(`/emails/rejection`)
      .set('Authorization', cookies.get(CookieTypes.admin.token))
      .send({ user } as StatusEmailRequest)
      .use(adminApiPrefix)
      .use(nocache)
  );

/**
 * Send an waitlist email to a user
 * @param {TESCUser} user The user to send the email to
 */
export const sendWaitlistEmail = (user: TESCUser) =>
  promisify<SuccessResponse>(
    request
      .post(`/emails/waitlist/`)
      .set('Authorization', cookies.get(CookieTypes.admin.token))
      .send({ user } as StatusEmailRequest)
      .use(adminApiPrefix)
      .use(nocache)
  );