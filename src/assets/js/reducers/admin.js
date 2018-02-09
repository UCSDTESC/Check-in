import userColumns from '~/pages/UsersPage/reducers/Columns';
import users from '~/pages/UsersPage/reducers/Users';
import auth from '~/auth/reducers/Auth';
import dashboardStats from '~/pages/DashboardPage/reducers/Stats';
import admins from '~/pages/AdminsPage/reducers/Admins';
import events from '~/pages/DashboardPage/reducers/Events';
import resumes from '~/pages/ResumesPage/reducers/Resumes';
import filters from './Admin/Filters';
import general from './Admin/General';

export default {
  auth,
  admins,
  events,
  filters,
  general,
  userColumns,
  users,
  resumes,
  dashboardStats,
};
