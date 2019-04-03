import auth from '~/auth/user/reducers/Auth';

import current from '~/pages/UserPage/reducers/Current';

import events from './UserEvents';
import { UserAuthState } from '~/auth/user/reducers/types';
import { TESCUser } from '~/static/types';
import { UserEventsState } from './types';

export interface UserState {
  auth: UserAuthState,
  current: TESCUser | {},
  events: UserEventsState
};

export default {
  auth,
  current,
  events
};
