import { Admin } from '~/static/types';

export interface AdminAuthState {
  error: string;
  message: string;
  authenticated: boolean;
  user?: Admin;
  authFinished: boolean;
}
