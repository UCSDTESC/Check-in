import { JWTAuthAdmin } from '~/data/AdminAuth';

export interface AdminAuthState {
  readonly error: string;
  readonly message: string;
  readonly authenticated: boolean;
  readonly user?: JWTAuthAdmin;
  readonly authFinished: boolean;
}
