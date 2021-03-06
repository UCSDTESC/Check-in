import { Admin, TESCUser } from '@Shared/ModelTypes';
import reduceReducers from 'reduce-reducers';
import auth from '~/auth/admin/reducers/Auth';
import { AdminAuthState } from '~/auth/admin/reducers/types';
import admins from '~/pages/AdminsPage/reducers/Admins';
import checkinReducer from '~/pages/CheckinPage/reducers/Checkin';
import eventAlerts from '~/pages/EventPage/reducers/EventAlerts';
import eventStatistics from '~/pages/EventPage/reducers/EventStatistics';
import { EventAlertsState, EventStatisticsState } from '~/pages/EventPage/reducers/types';
import resumes from '~/pages/ResumesPage/reducers/Resumes';
import { ResumesState } from '~/pages/ResumesPage/reducers/types';
import userPageColumns from '~/pages/UsersPage/reducers/Columns';
import usersReducer from '~/pages/UsersPage/reducers/Users';
import { ColumnsState } from '~/pages/UsersPage/reducers/types';

import availableColumns from './Admin/AvailableColumns';
import events from './Admin/Events';
import filters from './Admin/Filters';
import { EventsState, FiltersState, AvailableColumnsState } from './Admin/types';

export interface AdminState {
  readonly admins: Admin[];
  readonly auth: AdminAuthState;
  readonly availableColumns: AvailableColumnsState;
  readonly events: EventsState;
  readonly filters: FiltersState;
  readonly userPageColumns: ColumnsState;
  readonly users: TESCUser[];
  readonly resumes: ResumesState;
  readonly eventAlerts: EventAlertsState;
  readonly eventStatistics: EventStatisticsState;
}

export default {
  admins,
  auth,
  availableColumns,
  events,
  filters,
  userPageColumns,
  users: reduceReducers(usersReducer, checkinReducer),
  resumes,
  eventAlerts,
  eventStatistics,
};
