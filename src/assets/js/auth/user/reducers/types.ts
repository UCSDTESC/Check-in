import { JWTAuthUser } from '~/data/User';

export interface UserAuthState {
  readonly error: string;
  readonly message: string;
  readonly authenticated: boolean;
  readonly user?: JWTAuthUser;
  readonly authFinished: boolean;
}
