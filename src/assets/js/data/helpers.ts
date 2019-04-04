import Q from 'q';
import { SuperAgentRequest } from 'superagent';

/**
 * Run a request and return a Q promise.
 * @param  {Object} request The superagent request to run.
 */
export function promisify<T>(request: SuperAgentRequest): Q.Promise<T> {
  const deferred = Q.defer<T>();
  request.end((err, res) => {
    if (err || (res.body && res.body.error)) {
      if (res.body) {
        return deferred.reject(new Error(res.body.error));
      }
      return deferred.reject(err);
    }
    deferred.resolve(res.body as T);
  });
  return deferred.promise;
};
