import { AdminsController } from './admin/AdminsController';
import { AuthController as AdminAuthController } from './admin/AuthController';
import { ColumnsController } from './admin/ColumnsController';
import { CustomQuestionController } from './admin/CustomQuestionController';
import { EmailController } from './admin/EmailController';
import { EventsController as AdminEventsController } from './admin/EventsController';
import { ExportController } from './admin/ExportController';
import { ResumesController } from './admin/ResumesController';
import { SponsorsController } from './admin/SponsorsController';
import { StatisticsController } from './admin/StatisticsController';
import { UsersController } from './admin/UsersController';
import { AccountController } from './user/AccountController';
import { AuthController as UserAuthController } from './user/AuthController';
import { EventsController as UserEventsController } from './user/EventsController';
import { UserController } from './user/UserController';

export const AdminControllers = [
  AdminsController,
  AdminAuthController,
  AdminEventsController,
  ColumnsController,
  CustomQuestionController,
  EmailController,
  ExportController,
  ResumesController,
  SponsorsController,
  StatisticsController,
  UsersController,
];

export const UserControllers = [
  AccountController,
  UserAuthController,
  UserEventsController,
  UserController,
];
