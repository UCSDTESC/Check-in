import { JWTUserAuth, JWTUserAuthToken } from '@Shared/api/Responses';

export interface UserAuthState {
  readonly error: string;
  readonly message: string;
  readonly authenticated: boolean;
  readonly user?: JWTUserAuthToken;
  readonly authFinished: boolean;
}
