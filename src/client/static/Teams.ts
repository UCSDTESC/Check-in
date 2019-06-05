import { TESCUser } from '@Shared/ModelTypes';
import { UserStatus } from '@Shared/UserStatus';

enum TeamStatusEnum {
  Unmatched = 'Unmatched',
  NoStatus = 'NoStatus',
}

export type TeamStatus = UserStatus | TeamStatusEnum;

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
    return TeamStatusEnum.NoStatus;
  }

  return initialStatus;
}
