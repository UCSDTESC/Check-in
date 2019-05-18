export enum UserStatus {
  Rejected = 'Rejected',
  Unconfirmed = 'Unconfirmed',
  Confirmed = 'Confirmed',
  Declined = 'Declined',
  Late = 'Late',
  Waitlisted = 'Waitlisted',
}

export function isAcceptableStatus(status: UserStatus): boolean {
  return new Set([UserStatus.Unconfirmed, UserStatus.Confirmed]).has(status);
}
  