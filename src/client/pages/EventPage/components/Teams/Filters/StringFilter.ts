import { TESCTeam, TESCUser } from '@Shared/ModelTypes';

import BaseFilter from './BaseFilter';

export enum StringOperation {
  STARTS_WITH,
  ENDS_WITH,
  EQUALS,
  CONTAINS,
}

type StringFilterOperationFn = (team: TESCTeam, property: keyof TESCUser, ...inputs: string[]) => boolean;

/**
 * Maps the operations to their individual team filter functions.
 */
const StringFilterOperations: Map<StringOperation, StringFilterOperationFn> = new Map([
  [StringOperation.STARTS_WITH, (team: TESCTeam, prop: keyof TESCUser, ...inputs: string[]) => {
    return team.members.every(member => inputs.some(input => member[prop].toString().toLowerCase().startsWith(input)));
  }],
  [StringOperation.ENDS_WITH, (team: TESCTeam, prop: keyof TESCUser, ...inputs: string[]) => {
    return team.members.every(member => inputs.some(input => member[prop].toString().toLowerCase().endsWith(input)));
  }],
  [StringOperation.EQUALS, (team: TESCTeam, prop: keyof TESCUser, ...inputs: string[]) => {
    return team.members.every(member => inputs.some(input => member[prop].toString().toLowerCase() === input));
  }],
  [StringOperation.CONTAINS, (team: TESCTeam, prop: keyof TESCUser, ...inputs: string[]) => {
    return team.members.every(member => inputs.some(input => member[prop].toString().toLowerCase().includes(input)));
  }],
]);

export default class StringFilter implements BaseFilter {
  inputs: string[];
  operation: StringOperation;
  memberProperty: keyof TESCUser;
  memberPropertyDisplayName: string;

  constructor(prop: keyof TESCUser, propertyDisplay: string, op: StringOperation, ...inputs: string[]) {
    this.memberProperty = prop;
    this.memberPropertyDisplayName = propertyDisplay;
    this.operation = op;
    this.inputs = inputs;
  }

  applyFilter(input: TESCTeam[]): TESCTeam[] {
    return input.filter(team => StringFilterOperations.get(this.operation)
      (team, this.memberProperty, ...this.inputs.map(input => input.toLowerCase()))
    );
  }

  getDisplayText() {
    const { inputs, memberPropertyDisplayName: dn } = this;

    if (inputs.length === 1) {
      const displaySingle: Map<StringOperation, string> = new Map([
        [StringOperation.ENDS_WITH, `${dn} ends with "${inputs[0]}"`],
        [StringOperation.EQUALS, `${dn} is "${inputs[0]}"`],
        [StringOperation.STARTS_WITH, `${dn} starts with "${inputs[0]}"`],
        [StringOperation.CONTAINS, `${dn} contains "${inputs[0]}"`],
      ]);

      return displaySingle.get(this.operation);
    }

    // Display all options if it's short
    const inputsJoined = inputs.join('", "');
    if (inputsJoined.length <= 25) {
      const displayMultipleAll: Map<StringOperation, string> = new Map([
        [StringOperation.ENDS_WITH, `${dn} ends with any of "${inputsJoined}"`],
        [StringOperation.EQUALS, `${dn} is any of "${inputsJoined}"`],
        [StringOperation.STARTS_WITH, `${dn} starts with any of "${inputsJoined}"`],
        [StringOperation.CONTAINS, `${dn} contains any of "${inputsJoined}"`],
      ]);

      return displayMultipleAll.get(this.operation);
    }

    const displayMultiple: Map<StringOperation, string> = new Map([
      [StringOperation.ENDS_WITH, `${dn} ends with any of ${inputs.length} values`],
      [StringOperation.EQUALS, `${dn} is any of ${inputs.length} values`],
      [StringOperation.STARTS_WITH, `${dn} starts with any of ${inputs.length} values`],
      [StringOperation.CONTAINS, `${dn} contains any of ${inputs.length} values`],
    ]);

    return displayMultiple.get(this.operation);
  }
}
