import * as express from 'express';
// tslint:disable-next-line:no-import-side-effect
import 'reflect-metadata';
// tslint:disable-next-line:no-import-side-effect no-submodule-imports
import 'source-map-support/register';
import * as throng from 'throng';

import { Config } from './config';
import { Logger } from './config/Logging';
import ApplicationLoader from './loaders';

// Create workers on all the threads
if (Config.NodeEnv === 'development') {
// Don't multithread for debugging ease
  startInstance();
} else {
  throng({
    workers: Config.WebConcurrency,
    lifetime: Infinity,
    start: startInstance,
  });
}

async function startInstance() {
  const app = express();
  const port = Config.Port;

  await ApplicationLoader.InitialiseLoaders(app);

  app.listen(port, () => {
    Logger.info('Server started. Listening on port %d with %d worker(s)',
      port, Config.WebConcurrency);
  });
}
