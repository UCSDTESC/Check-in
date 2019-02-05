import reduceReducers from 'reduce-reducers';

import userColumns from '~/pages/UsersPage/reducers/Columns';

import usersReducer from '~/pages/UsersPage/reducers/Users';

import checkinReducer from '~/pages/CheckinPage/reducers/Checkin';

import auth from '~/auth/admin/reducers/Auth';

import dashboardStats from '~/pages/DashboardPage/reducers/Stats';

import admins from '~/pages/AdminsPage/reducers/Admins';

import resumes from '~/pages/ResumesPage/reducers/Resumes';

import eventAlerts from '~/pages/EventPage/reducers/EventAlerts';

import eventStatistics from '~/pages/EventPage/reducers/EventStatistics';

import events from './Admin/Events';
import filters from './Admin/Filters';
import general from './Admin/General';

export default {
  auth,
  admins,
  events,
  filters,
  general,
  userColumns,
  users: reduceReducers(usersReducer, checkinReducer),
  resumes,
  dashboardStats,
  eventAlerts,
  eventStatistics
};
