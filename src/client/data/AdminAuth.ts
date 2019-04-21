import { Role } from '@Shared/Roles';
import { JWTAdminAuth } from '@Shared/api/Responses';
import request from 'superagent';
import nocache from 'superagent-no-cache';
import pref from 'superagent-prefix';

import { promisify } from './helpers';

const URL_PREFIX = '/api/auth';

const prefix = pref(URL_PREFIX);

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
    .send({username, password})
    .use(prefix)
    .use(nocache));
};
