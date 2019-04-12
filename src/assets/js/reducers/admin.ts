import reduceReducers from 'reduce-reducers';

import userColumns from '~/pages/UsersPage/reducers/Columns';

import usersReducer from '~/pages/UsersPage/reducers/Users';

import checkinReducer from '~/pages/CheckinPage/reducers/Checkin';

import auth from '~/auth/admin/reducers/Auth';

import admins from '~/pages/AdminsPage/reducers/Admins';

import resumes from '~/pages/ResumesPage/reducers/Resumes';

import eventAlerts from '~/pages/EventPage/reducers/EventAlerts';

import eventStatistics from '~/pages/EventPage/reducers/EventStatistics';

import events from './Admin/Events';
import filters from './Admin/Filters';
import { AdminAuthState } from '~/auth/admin/reducers/types';
import { Admin, TESCUser } from '~/static/types';
import { EventsState, FiltersState, GeneralState } from './Admin/types';
import { ColumnsState } from '~/pages/UsersPage/reducers/types';
import { ResumesState } from '~/pages/ResumesPage/reducers/types';
import { EventAlertsState, EventStatisticsState } from '~/pages/EventPage/reducers/types';

export interface AdminState {
  readonly auth: AdminAuthState;
  readonly admins: Admin[];
  readonly events: EventsState;
  readonly filters: FiltersState;
  readonly userColumns: ColumnsState;
  readonly users: TESCUser[];
  readonly resumes: ResumesState;
  readonly eventAlerts: EventAlertsState;
  readonly eventStatistics: EventStatisticsState;
}

export default {
  auth,
  admins,
  events,
  filters,
  userColumns,
  users: reduceReducers(usersReducer, checkinReducer),
  resumes,
  eventAlerts,
  eventStatistics,
};
