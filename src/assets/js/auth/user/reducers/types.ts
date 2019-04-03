import { TESCUser } from "~/static/types";

export interface UserAuthState {
  error: string,
  message: string,
  authenticated: boolean,
  user: TESCUser | {},
  authFinished: boolean
};