import nocache from 'superagent-no-cache';
import pref from 'superagent-prefix';
import request from 'superagent';
import { promisify } from './helpers';
import { Role } from '~/static/Roles';
import { JWTAuthUser } from './User';

const URL_PREFIX = '/api/auth';

const prefix = pref(URL_PREFIX);

export interface JWTAuthAdmin {
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
 * Requests a login for the given administrator.
 * @param  {String} username The username of the login.
 * @param  {String} password The password of the login.
 * @returns {Object} A superagent request object.
 */
export const login = (username: string, password: string) => {
  return promisify<JWTAuth>(request
    .post('/login')
    .set('Content-Type', 'application/json')
    .send({username, password})
    .use(prefix)
    .use(nocache));
};
