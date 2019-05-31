import { TESCTeam, TESCUser } from '@Shared/ModelTypes';

import BaseFilter from './BaseFilter';

export enum NumberOperation {
  EQUAL,
  LT,
  LTE,
  GT,
  GTE,
  BETWEEN,
}

type NumberFilterOperationFn = (team: TESCTeam, property: keyof TESCUser, input1: number, input2?: number) => boolean;

/**
 * Maps the operations to their individual team filter functions.
 */
const NumberFilterOperations: Map<NumberOperation, NumberFilterOperationFn> = new Map([
  [NumberOperation.BETWEEN, (team: TESCTeam, prop: keyof TESCUser, input1: number, input2?: number) => {
    return !team.teammates.some(member => member[prop] < input1 || member[prop] > input2);
  }],
  [NumberOperation.LT, (team: TESCTeam, prop: keyof TESCUser, input1: number) => {
    return !team.teammates.some(member => member[prop] >= input1);
  }],
  [NumberOperation.LTE, (team: TESCTeam, prop: keyof TESCUser, input1: number) => {
    return !team.teammates.some(member => member[prop] > input1);
  }],
  [NumberOperation.GT, (team: TESCTeam, prop: keyof TESCUser, input1: number) => {
    return !team.teammates.some(member => member[prop] <= input1);
  }],
  [NumberOperation.GTE, (team: TESCTeam, prop: keyof TESCUser, input1: number) => {
    return !team.teammates.some(member => member[prop] < input1);
  }],
  [NumberOperation.EQUAL, (team: TESCTeam, prop: keyof TESCUser, input1: number) => {
    return !team.teammates.some(member => member[prop] !== input1);
  }],
]);

export default class NumberFilter implements BaseFilter {
  input1: number;
  input2: number;
  memberProperty: keyof TESCUser;
  memberPropertyDisplayName: string;
  operation: NumberOperation;

  constructor(prop: keyof TESCUser, propertyDisplayName: string, op: NumberOperation, input1: number, input2?: number) {
    this.memberProperty = prop;
    this.memberPropertyDisplayName = propertyDisplayName;
    this.operation = op;
    this.input1 = input1;
    this.input2 = input2;
  }

  setInput(op: NumberOperation, input1: number, input2?: number) {
    this.operation = op;
    this.input1 = input1;
    this.input2 = input2;
  }

  setOperation(op: NumberOperation) {
    this.operation = op;
  }

  applyFilter(input: TESCTeam[]): TESCTeam[] {
    return input.filter(team => NumberFilterOperations.get(this.operation)
      (team, this.memberProperty, this.input1, this.input2)
    );
  }

  getDisplayText() {
    const { input1, input2, memberPropertyDisplayName: dn } = this;

    const displays: Map<NumberOperation, string> = new Map([
      [NumberOperation.EQUAL, `${dn} is ${input1}`],
      [NumberOperation.GT, `${dn} > ${input1}`],
      [NumberOperation.GTE, `${dn} >= ${input1}`],
      [NumberOperation.LT, `${dn} < ${input1}`],
      [NumberOperation.LTE, `${dn} <= ${input1}`],
      [NumberOperation.BETWEEN, `${dn} between ${input1} and ${input2}`],
    ]);

    return displays.get(this.operation);
  }
}
