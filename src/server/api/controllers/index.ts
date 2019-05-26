import { AdminsController } from './admin/AdminsController';
import { AuthController } from './admin/AuthController';
import { CustomQuestionController } from './admin/CustomQuestionController';
import { EventsController as AdminEventsController } from './admin/EventsController';
import { ResumesController } from './admin/ResumesController';
import { SponsorsController } from './admin/SponsorsController';
import { StatisticsController } from './admin/StatisticsController';
import { UsersController } from './admin/UsersController';
import { EventsController as UserEventsController } from './user/EventsController';

export const AdminControllers = [
  AdminsController,
  AuthController,
  AdminEventsController,
  CustomQuestionController,
  ResumesController,
  SponsorsController,
  StatisticsController,
  UsersController,
];

export const UserControllers = [
  UserEventsController,
];
