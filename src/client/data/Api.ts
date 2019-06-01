import { TESCUser, Admin, TESCEventOptions, Question, Download,
    TESCEvent } from '@Shared/ModelTypes';
import { QuestionType } from '@Shared/Questions';
import { AddCustomQuestionRequest, UpdateCustomQuestionRequest, DeleteCustomQuestionRequest,
    BulkChangeRequest, UpdateEventOptionsRequest, AddNewSponsorRequest,
    AddNewOrganiserRequest,
    DownloadResumesRequest,
    DeleteAdminRequest,
    RegisterAdminRequest,
    CheckinUserRequest,
    RegisterEventRequest,
    RegisterUserRequest,
    StatusEmailRequest } from '@Shared/api/Requests';
import { EventStatistics, GetSponsorsResponse, EventsWithStatisticsResponse,
  SuccessResponse,
  ColumnResponse,
  RegisterUserResponse,
  EmailExistsResponse } from '@Shared/api/Responses';
import moment from 'moment';
import request, { SuperAgentRequest } from 'superagent';
import nocache from 'superagent-no-cache';
import pref from 'superagent-prefix';
import Cookies from 'universal-cookie';
import { NewAdminModalFormData } from '~/components/NewAdminModal';
import { ApplyPageFormData } from '~/pages/ApplyPage';
import { NewEventFormData } from '~/pages/NewEventPage/components/NewEventForm';
import CookieTypes from '~/static/Cookies';

import { promisify } from './helpers';

const API_URL_PREFIX = '/api';

const apiPrefix = pref(API_URL_PREFIX);
const cookies = new Cookies();

/**
 * Checks whether the user is still authorised.
 * @returns {Promise} A promise of the request.
 */
export const authorised = () =>
  promisify<{}>(
    request
      .get('/auth/authorised')
      .set('Authorization', cookies.get(CookieTypes.admin.token))
      .use(apiPrefix)
      .use(nocache)
  );

/**
 * Request a list of all users.
 * @param {String} alias The event alias.
 * @returns {Promise} A promise of the request.
 */
export const loadAllUsers = (alias: string) =>
  promisify<TESCUser[]>(
    request
      .get(`/users/${alias}`)
      .set('Authorization', cookies.get(CookieTypes.admin.token))
      .use(apiPrefix)
  );

/**
 * Request user statistics for a given event.
 * @param {String} alias The event alias.
 * @returns {Promise} A promise of the request.
 */
export const loadEventStatistics = (alias: string) =>
  promisify<EventStatistics>(
    request
      .get(`/statistics/${alias}`)
      .set('Authorization', cookies.get(CookieTypes.admin.token))
      .use(apiPrefix)
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
      .use(apiPrefix)
      .use(nocache)
  );

/**
 * Checks whether the email is already in use.
 * @param {String} email The user email.
 * @returns {Promise} A promise of the request.
 */
export const checkUserExists = (email: string) =>
  promisify<EmailExistsResponse>(
    request
      .get(`/register/verify/${email}`)
      .use(apiPrefix)
  );

/**
 * Confirms a user account by a given ID.
 * @param {String} accountId The ID of the user account.
 * @returns {Promise} A promise of the request.
 */
export const confirmAccount = (accountId: string) =>
  promisify<SuccessResponse>(
    request
      .get(`/register/confirm/${accountId}`)
      .use(apiPrefix)
  );

/**
 * Request a list of all events that is available to the public.
 * @returns {Promise} A promise of the request.
 */
export const loadAllPublicEvents = () =>
  promisify<EventsWithStatisticsResponse>(
    request
      .get('/events')
      .use(apiPrefix)
      .use(nocache)
  );

/**
 * Requests event information based on a given event alias.
 * @param {String} eventAlias The event alias.
 */
export const loadEventByAlias = (eventAlias: string) =>
  promisify<TESCEvent>(
    request
      .get(`/events/${eventAlias}`)
      .use(apiPrefix)
      .use(nocache)
  );

/**
 * Request a list of all events the user has access to.
 * @returns {Promise} A promise of the request.
 */
export const loadAllEvents = () =>
  promisify<EventsWithStatisticsResponse>(
    request
      .get('/admin/events')
      .set('Authorization', cookies.get(CookieTypes.admin.token))
      .use(apiPrefix)
      .use(nocache)
  );

/**
 * Request a list of all applicants.
 * @param {String} eventAlias The event alias.
 * @returns {Promise} A promise of the request.
 */
export const loadAllApplicants = (eventAlias: string) =>
  promisify<TESCUser[]>(
    request
      .get(`/sponsors/applicants/${eventAlias}`)
      .set('Authorization', cookies.get(CookieTypes.admin.token))
      .use(apiPrefix)
      .use(nocache)
  );

/**
 * Request an update for a given user.
 * @param  {String} eventAlias The alias of the event the user belongs to.
 * @param  {Object} user The new user object to save.
 * @returns {Promise} A promise of the request.
 */
export const updateUser = (eventAlias: string, user: TESCUser) =>
  promisify<SuccessResponse>(
    request
      .post(`/users/${eventAlias}`)
      .send(user)
      .set('Authorization', cookies.get(CookieTypes.admin.token))
      .use(apiPrefix)
  );

/**
 * Request a user marked as checked in.
 * @param  {String} id of the user.
 * @param  {String} eventAlias of the event we want to check in to
 * @returns {Promise} A promise of the request.
 */
export const checkinUser = (id: string, eventAlias: string) =>
  promisify<SuccessResponse>(
    request
      .post(`/users/checkin/${eventAlias}`)
      .send({ id } as CheckinUserRequest)
      .set('Authorization', cookies.get(CookieTypes.admin.token))
      .use(apiPrefix)
  );

/**
 * Request to register a new user.
 * @param {String} eventAlias The alias for the event to register for.
 * @param  {Object} user The user fields to register.
 * @returns {Promise} A promise of the request.
 */
export const registerUser = (eventAlias: string, user: ApplyPageFormData) => {
  const { resume, ...clearUser } = user;
  const postObject: RegisterUserRequest = Object.assign({}, clearUser);

  let baseReq = request
    .post(`/register/${eventAlias}`)
    .use(apiPrefix)
    .field('user', JSON.stringify({
      ...postObject,
    }));

  if (resume) {
    baseReq = baseReq.attach('resume', resume[0]);
  }
  return promisify<RegisterUserResponse>(baseReq);
};

export const registerNewEvent = (event: NewEventFormData) => {
  const {logo, closeTimeDay, closeTimeMonth, closeTimeYear, ...eventWithoutFields} = event;
  const closeTime: string = moment(new Date(
    closeTimeYear,
    closeTimeMonth - 1,
    closeTimeDay
  )).toISOString(true);
  return promisify<TESCEvent>(
    request
      .post('/admin/events')
      .set('Authorization', cookies.get(CookieTypes.admin.token))
      .field('event', JSON.stringify({
        ...eventWithoutFields,
        closeTime,
      } as RegisterEventRequest))
      .attach('logo', logo[0])
      .use(apiPrefix)
      .use(nocache)
  );
};

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
      .use(apiPrefix)
  );

/**
 * Request to delete a new admin.
 * @param {String} adminId The ID of the admin to delete.
 * @returns {Promise} A promise of the request.
 */
export const deleteAdmin = (adminId: string) =>
  promisify<SuccessResponse>(
    request
      .delete('/admins')
      .send({ id: adminId } as DeleteAdminRequest)
      .set('Authorization', cookies.get(CookieTypes.admin.token))
      .use(apiPrefix)
  );

/**
 * Request to download a given set of resumes.
 * @param {String[]} applicants An array of User IDs to download
 * @returns {Promise} A promise of the request.
 */
export const downloadResumes = (applicants: string[]) =>
  promisify<Download>(
    request
      .post('/sponsors/download')
      .send({ applicants } as DownloadResumesRequest)
      .set('Authorization', cookies.get(CookieTypes.admin.token))
      .use(apiPrefix)
  );

/**
 * Requests the status of an ongoing download.
 * @param {String} downloadId The given ID of the download.
 * @returns {Promise} A promise of the request.
 */
export const pollDownload = (downloadId: string) =>
  promisify<Download>(
    request
      .get(`/sponsors/download/${downloadId}`)
      .set('Authorization', cookies.get(CookieTypes.admin.token))
      .use(apiPrefix)
  );

/**
 * Requests the download of all users as a CSV file. Returned as a request since
 * it downloads a CSV blob.
 * @param {String} eventAlias The alias associated with the event.
 * @returns {Request} A request object not wrapped in a promise.
 */
export const exportUsers = (eventAlias: string): SuperAgentRequest =>
  request
    .get(`/admin/export/${eventAlias}`)
    .set('Authorization', cookies.get(CookieTypes.admin.token))
    .use(apiPrefix);

/**
 * Bulk updates a list of users to all have the same status.
 * @param {String[]} users A list of User IDs.
 * @param {String} status The new status string for all of the users
 * @returns {Promise} A promise of the request.
 */
export const bulkChange = (users: string[], status: string) =>
  promisify<SuccessResponse>(
    request
      .post('/admin/bulkChange')
      .send({ users, status } as BulkChangeRequest)
      .set('Authorization', cookies.get(CookieTypes.admin.token))
      .use(apiPrefix)
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
      .post(`/admin/update/${eventAlias}`)
      .send({ options } as UpdateEventOptionsRequest)
      .set('Authorization', cookies.get(CookieTypes.admin.token))
      .use(apiPrefix)
  );

/**
 * Request a list of columns that define the user.
 * @returns {Promise} A promise of the request.
 */
export const loadColumns = () =>
  promisify<ColumnResponse>(
    request
      .get('/admin/columns')
      .set('Authorization', cookies.get(CookieTypes.admin.token))
      .use(apiPrefix)
      .use(nocache)
  );

/**
 * Request a list of sponsors.
 * @returns {Promise} A promise of the request.
 */
export const loadSponsors = () =>
  promisify<GetSponsorsResponse>(
    request
      .get('/admin/sponsors')
      .set('Authorization', cookies.get(CookieTypes.admin.token))
      .use(apiPrefix)
      .use(nocache)
  );

/**
 * Request to add a new sponsor to an event.
 * @returns {Promise} A promise of the request.
 */
export const addNewSponsor = (eventAlias: string, sponsorId: string) =>
  promisify<SuccessResponse>(
    request
      .post(`/admin/addSponsor/${eventAlias}`)
      .send({ sponsorId: sponsorId } as AddNewSponsorRequest)
      .set('Authorization', cookies.get(CookieTypes.admin.token))
      .use(apiPrefix)
      .use(nocache)
  );

/**
 * Request to add a new organiser to an event.
 * @returns {Promise} A promise of the request.
 */
export const addNewOrganiser = (eventAlias: string, adminId: string) =>
  promisify<SuccessResponse>(
    request
      .post(`/admin/addOrganiser/${eventAlias}`)
      .send({ organiserId: adminId } as AddNewOrganiserRequest)
      .set('Authorization', cookies.get(CookieTypes.admin.token))
      .use(apiPrefix)
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
      .post(`/admin/customQuestion/${eventAlias}`)
      .send({ question, type } as AddCustomQuestionRequest)
      .set('Authorization', cookies.get(CookieTypes.admin.token))
      .use(apiPrefix)
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
      .put(`/admin/customQuestion/${eventAlias}`)
      .send({ question } as UpdateCustomQuestionRequest)
      .set('Authorization', cookies.get(CookieTypes.admin.token))
      .use(apiPrefix)
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
      .delete(`/admin/customQuestion/${eventAlias}`)
      .send({ question, type } as DeleteCustomQuestionRequest)
      .set('Authorization', cookies.get(CookieTypes.admin.token))
      .use(apiPrefix)
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
      .send({user} as StatusEmailRequest)
      .use(apiPrefix)
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
      .send({user} as StatusEmailRequest)
      .use(apiPrefix)
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
      .send({user} as StatusEmailRequest)
      .use(apiPrefix)
      .use(nocache)
  );
