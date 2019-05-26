import { AdminsController } from './admin/AdminsController';
import { AuthController } from './admin/AuthController';
import { CustomQuestionController } from './admin/CustomQuestionController';
import { EventsController as AdminEventsController } from './admin/EventsController';
import { SponsorsController } from './admin/SponsorsController';
import { StatisticsController } from './admin/StatisticsController';
import { EventsController as UserEventsController } from './user/EventsController';

export const AdminControllers = [
  AdminsController,
  AuthController,
  AdminEventsController,
  CustomQuestionController,
  SponsorsController,
  StatisticsController,
];

export const UserControllers = [
  UserEventsController,
];
