import { TESCTeam, TESCUser } from '@Shared/ModelTypes';

import BaseFilter from './BaseFilter';

export enum StringOperation {
  STARTS_WITH,
  ENDS_WITH,
  EQUALS,
  CONTAINS,
}

type StringFilterOperationFn = (team: TESCTeam, property: keyof TESCUser, input: string) => boolean;

/**
 * Maps the operations to their individual team filter functions.
 */
const StringFilterOperations: Map<StringOperation, StringFilterOperationFn> = new Map([
  [StringOperation.STARTS_WITH, (team: TESCTeam, prop: keyof TESCUser, input: string) => {
    return team.teammates.every(member => member[prop].toString().toLowerCase().startsWith(input));
  }],
  [StringOperation.ENDS_WITH, (team: TESCTeam, prop: keyof TESCUser, input: string) => {
    return team.teammates.every(member => member[prop].toString().toLowerCase().endsWith(input));
  }],
  [StringOperation.EQUALS, (team: TESCTeam, prop: keyof TESCUser, input: string) => {
    return team.teammates.every(member => member[prop].toString().toLowerCase() === input);
  }],
  [StringOperation.CONTAINS, (team: TESCTeam, prop: keyof TESCUser, input: string) => {
    return team.teammates.every(member => member[prop].toString().toLowerCase().includes(input));
  }],
]);

export default class StringFilter implements BaseFilter {
  input: string;
  operation: StringOperation;
  memberProperty: keyof TESCUser;
  memberPropertyDisplayName: string;

  constructor(prop: keyof TESCUser, propertyDisplay: string, op: StringOperation, input: string) {
    this.memberProperty = prop;
    this.memberPropertyDisplayName = propertyDisplay;
    this.operation = op;
    this.input = input;
  }

  applyFilter(input: TESCTeam[]): TESCTeam[] {
    return input.filter(team => StringFilterOperations.get(this.operation)
      (team, this.memberProperty, this.input.toLowerCase())
    );
  }

  getDisplayText() {
    const { input, memberPropertyDisplayName: dn } = this;

    const displays: Map<StringOperation, string> = new Map([
      [StringOperation.ENDS_WITH, `${dn} ends with "${input}"`],
      [StringOperation.EQUALS, `${dn} is "${input}"`],
      [StringOperation.STARTS_WITH, `${dn} starts with "${input}"`],
      [StringOperation.CONTAINS, `${dn} contains "${input}"`],
    ]);

    return displays.get(this.operation);
  }
}
