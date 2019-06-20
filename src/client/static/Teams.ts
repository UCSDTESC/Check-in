import { TESCUser } from '@Shared/ModelTypes';
import { UserStatus } from '@Shared/UserStatus';

export enum TeamStatusEnum {
  Unmatched = 'Unmatched',
}

export type TeamStatus = UserStatus | TeamStatusEnum;

export const TeamStatusDisplayText: Map<TeamStatus, string> =
  new Map<TeamStatus, string>([
    [UserStatus.Confirmed, 'Confirmed'],
    [UserStatus.Rejected, 'Rejected'],
    [UserStatus.Declined, 'Declined'],
    [UserStatus.Late, 'Late'],
    [UserStatus.Waitlisted, 'Waitlisted'],
    [UserStatus.Unconfirmed, 'Admitted'],
    [TeamStatusEnum.Unmatched, 'Mixed'],
    [UserStatus.NoStatus, 'No Status'],
  ]);

/**
 * Get the text that should be in the team status indicator.
 */
export function getStatusIndicatorText(status: TeamStatus) {
  if (status !== TeamStatusEnum.Unmatched) {
    return `All ${status}`;
  }
  return 'Different Statuses';
}

/**
 * Determine the team status given the list of teammates.
 */
export function getTeamStatus(teammates: TESCUser[]): TeamStatus {
  const initialStatus = teammates[0].status;

  for (const user of teammates) {
    if (user.status !== initialStatus) {
      return TeamStatusEnum.Unmatched;
    }
  }

  if (!initialStatus) {
    return UserStatus.NoStatus;
  }

  return initialStatus;
}
