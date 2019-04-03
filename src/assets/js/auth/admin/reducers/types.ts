import { TESCUser } from "~/static/types";

export interface AdminAuthState {
  error: string,
  message: string,
  authenticated: boolean,
  user: TESCUser | {},
  authFinished: boolean
};