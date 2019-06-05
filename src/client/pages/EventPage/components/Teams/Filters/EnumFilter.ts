import { TESCTeam, TESCUser } from '@Shared/ModelTypes';

import BaseFilter from './BaseFilter';

export enum EnumOperation {
  INCLUDES,
  EXCLUDES,
}

export default class EnumFilter<E> implements BaseFilter {
  /**
   * Maps the operations to their individual team filter functions.
   */
  EnumFilterOperations: Map<EnumOperation,
    (team: TESCTeam, property: keyof TESCUser, inputs: E[]) => boolean> = new Map([
      [EnumOperation.INCLUDES, (team: TESCTeam, prop: keyof TESCUser, inputs: E[]) => {
        return team.members.every(member => inputs.includes(member[prop] as E));
      }],
      [EnumOperation.EXCLUDES, (team: TESCTeam, prop: keyof TESCUser, inputs: E[]) => {
        return team.members.every(member => !inputs.includes(member[prop] as E));
      }],
    ]);

  inputs: E[];
  operation: EnumOperation;
  memberProperty: keyof TESCUser;
  memberPropertyDisplayName: string;

  constructor(prop: keyof TESCUser, propertyDisplay: string, op: EnumOperation, ...inputs: E[]) {
    this.memberProperty = prop;
    this.memberPropertyDisplayName = propertyDisplay;
    this.operation = op;
    this.inputs = inputs;
  }

  applyFilter(input: TESCTeam[]): TESCTeam[] {
    return input.filter(team => this.EnumFilterOperations.get(this.operation)
      (team, this.memberProperty, this.inputs)
    );
  }

  getDisplayText() {
    const { inputs, memberPropertyDisplayName: dn } = this;

    const commaSeparated = inputs.join(', ');

    const displays: Map<EnumOperation, string> = new Map([
      [EnumOperation.INCLUDES, `${dn} including "${commaSeparated}"`],
      [EnumOperation.EXCLUDES, `${dn} excluding "${commaSeparated}"`],
    ]);

    return displays.get(this.operation);
  }
}
