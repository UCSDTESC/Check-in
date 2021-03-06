import { SuperAgentRequest } from 'superagent';

/**
 * Run a request and return a Q promise.
 * @param  {Object} request The superagent request to run.
 */
export function promisify<T>(request: SuperAgentRequest): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    request.end((err, res) => {
      if (err || (res.body && res.body.error)) {
        if (res.body) {
          return reject(new Error(res.body.message));
        }
        return reject(err);
      }
      return resolve(res.body as T);
    });
  });
}
