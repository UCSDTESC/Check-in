import { TESCUser } from '@Shared/Types';
import auth from '~/auth/user/reducers/Auth';
import { UserAuthState } from '~/auth/user/reducers/types';
import current from '~/pages/UserPage/reducers/Current';

import events from './UserEvents';
import { UserEventsState } from './types';

export interface UserState {
  readonly auth: UserAuthState;
  readonly current?: TESCUser;
  readonly events: UserEventsState;
}

export default {
  auth,
  current,
  events,
};
