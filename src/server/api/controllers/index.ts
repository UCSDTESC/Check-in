import { AdminsController } from './admin/AdminsController';
import { AuthController } from './admin/AuthController';
import { ColumnsController } from './admin/ColumnsController';
import { CustomQuestionController } from './admin/CustomQuestionController';
import { EventsController as AdminEventsController } from './admin/EventsController';
import { ResumesController } from './admin/ResumesController';
import { SponsorsController } from './admin/SponsorsController';
import { StatisticsController } from './admin/StatisticsController';
import { UsersController } from './admin/UsersController';
import { AccountController } from './user/AccountController';
import { EventsController as UserEventsController } from './user/EventsController';
import { UserController } from './user/UserController';

export const AdminControllers = [
  AdminsController,
  AuthController,
  AdminEventsController,
  ColumnsController,
  CustomQuestionController,
  ResumesController,
  SponsorsController,
  StatisticsController,
  UsersController,
];

export const UserControllers = [
  AccountController,
  UserEventsController,
  UserController,
];
