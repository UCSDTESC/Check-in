import userColumns from '~/pages/UsersPage/reducers/Columns';
import users from '~/pages/UsersPage/reducers/Users';
import auth from '~/auth/reducers/Auth';
import dashboardStats from '~/pages/DashboardPage/reducers/Stats';
import admins from '~/pages/AdminsPage/reducers/Admins';
import resumes from '~/pages/ResumesPage/reducers/Resumes';
import filters from './Admin/Filters';
import general from './Admin/General';

export default {
  auth,
  admins,
  filters,
  general,
  userColumns,
  users,
  resumes,
  dashboardStats,
};
