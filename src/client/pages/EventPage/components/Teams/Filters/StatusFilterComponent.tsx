import { UserStatus } from '@Shared/UserStatus';
import React, { ChangeEvent } from 'react';
import { TeamStatusEnum, TeamStatusDisplayText, TeamStatus } from '~/static/Teams';

import EnumFilter, { EnumOperation } from './EnumFilter';
import FilterComponent from './FilterComponent';

interface StatusFilterComponentProps {
}

interface StatusFilterComponentState {
  values: TeamStatus[];
}

export default class StatusFilterComponent
  extends FilterComponent<StatusFilterComponentProps, StatusFilterComponentState> {
  state: Readonly<StatusFilterComponentState> = {
    values: [],
  };

  componentDidMount() {
    this.sendCurrentValues();
  }

  /**
   * Sends the currently selected values' filter to the parent.
   */
  sendCurrentValues = () => {
    const { label, propertyName } = this.props;
    const newFilter: EnumFilter<TeamStatus> =
      new EnumFilter<TeamStatus>(propertyName, label, EnumOperation.INCLUDES, ...this.state.values);
    this.props.onFiltersChanged(newFilter);
  }

  onChange = (newValueEvent: ChangeEvent<HTMLSelectElement>) => {
    const newStatus: TeamStatus = newValueEvent.currentTarget.value as TeamStatus;
    const newValues = [newStatus, ...this.state.values];
    this.setState({
      values: newValues,
    }, this.sendCurrentValues);
  }

  render() {
    const { label } = this.props;
    const { values } = this.state;
    const userStatuses = Object.values(UserStatus);
    const teamStatuses = Object.values(TeamStatusEnum);

    return (
      <>
        <div>
          {label}
        </div>
        <ul>
          {values.map(value =>
            <li key={value}>{value}</li>
          )}
        </ul>
        <select className="sd-form__input-select d-block w-100" onChange={this.onChange}>
          {[...userStatuses, ...teamStatuses].map(status =>
            <option key={status} value={status}>{TeamStatusDisplayText.get(status)}</option>
          )}
        </select>
      </>
    );
  }
}
