import { JWTAdminAuthToken } from '@Shared/api/Responses';

export interface AdminAuthState {
  readonly error: string;
  readonly message: string;
  readonly authenticated: boolean;
  readonly user?: JWTAdminAuthToken;
  readonly authFinished: boolean;
}
