import { Role } from '@Shared/Roles';
import { Admin } from '@Shared/Types';

export interface EventStatistics {
  count: number;
  universities: number;
  genders: {
    [GenderName: string]: number;
  };
  checkedIn: number;
  status: {
    [StatusType: string]: number;
  };
  resumes: number;
}

export interface JWTAdminAuthToken {
  _id: string;
  username: string;
  role: Role;
  checkin: boolean;
}

export interface JWTUserAuthToken {
  _id: string;
}

export interface JWTAdminAuth {
  token: string;
  user: JWTAdminAuthToken;
}

export interface JWTUserAuth {
  token: string;
  user: JWTUserAuthToken;
}

export type GetSponsorsResponse = Array<Pick<Admin, 'username' | '_id'>>;

export class SuccessResponse {
  static Positive: SuccessResponse = {
    success: true,
  };

  static Negative: SuccessResponse = {
    success: false,
  };

  success: boolean;
}
