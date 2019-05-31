import { TESCTeam, TESCUser } from '@Shared/ModelTypes';

export default interface BaseFilter {
  /**
   * The property on the user to filter.
   */
  memberProperty: keyof TESCUser;

  /**
   * The display name for the user column.
   */
  memberPropertyDisplayName: string;

  /**
   * Returns the text to display describing the filter.
   */
  getDisplayText(): string;

  /**
   * Applies the particular filter on the incoming list and outputs the newly filtered list.
   * @param input The list of incoming teams to filter.
   */
  applyFilter(input: TESCTeam[]): TESCTeam[];
}
