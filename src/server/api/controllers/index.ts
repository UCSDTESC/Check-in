import { AdminController } from './AdminController';
import { RegistrationController } from './RegistrationController';
import { SponsorsController } from './SponsorsController';
import { UserAuthController } from './UserAuthController';
import { UserController } from './UserController';
import { UsersController } from './UsersController';
import { AdminsController } from './admin/AdminsController';
import { AuthController } from './admin/AuthController';
import { CustomQuestionController } from './admin/CustomQuestionController';
import { EventsController as AdminEventsController } from './admin/EventsController';
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
