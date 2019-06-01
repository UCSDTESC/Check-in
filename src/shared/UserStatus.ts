export enum UserStatus {
  Rejected = 'Rejected',
  Unconfirmed = 'Unconfirmed',
  Confirmed = 'Confirmed',
  Declined = 'Declined',
  Late = 'Late',
  Waitlisted = 'Waitlisted',
}

export function isAcceptableStatus(status: UserStatus): boolean {
  return new Set<UserStatus>([UserStatus.Unconfirmed, 
    UserStatus.Confirmed, UserStatus.Waitlisted]).has(status);
}

export function isRejectableStatus(status: UserStatus): boolean {
  return new Set<UserStatus>([UserStatus.Late, UserStatus.Rejected]).has(status);
}

export function isWaitlistableStatus(status: UserStatus): boolean {
  return status === UserStatus.Waitlisted
}