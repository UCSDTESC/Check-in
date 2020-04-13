import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { RegisterModels } from '@Models/index';
import { Logger } from '@Config/Logging';

Logger.transports.forEach((t) => (t.silent = true));
RegisterModels();


