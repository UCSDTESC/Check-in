import { AdminController } from './AdminController';
import { RegistrationController } from './RegistrationController';
import { SponsorsController } from './SponsorsController';
import { StatisticsController } from './StatisticsController';
import { UserAuthController } from './UserAuthController';
import { UserController } from './UserController';
import { UsersController } from './UsersController';
import { AdminsController } from './admin/AdminsController';
import { AuthController } from './admin/AuthController';
import { EventsController as AdminEventsController } from './admin/EventsController';
import { EventsController as UserEventsController } from './user/EventsController';

export const AdminControllers = [
  AuthController,
  AdminController,
  AdminsController,
  AdminEventsController,
  RegistrationController,
  SponsorsController,
  StatisticsController,
  UserAuthController,
  UserController,
  UsersController,
];

export const UserControllers = [
  UserEventsController,
];
