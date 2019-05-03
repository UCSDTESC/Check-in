import { Admin, TESCEvent } from '@Shared/ModelTypes';
import { Role } from '@Shared/Roles';
import { Types } from 'mongoose';

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

export type EventUserCounts = {
  _id: string;
  count: number;
};

export interface EventsWithStatisticsResponse {
  events: TESCEvent[];
  userCounts: EventUserCounts[];
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

export interface ColumnResponse {
  [accessor: string]: string;
}

export interface RegisterUserResponse {
  email: string;
}
