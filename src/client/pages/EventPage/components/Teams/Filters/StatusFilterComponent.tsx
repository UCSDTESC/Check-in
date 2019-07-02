import { UserStatus } from '@Shared/UserStatus';
import React, { ChangeEvent } from 'react';
import { TeamStatusEnum, TeamStatusDisplayText, TeamStatus } from '~/static/Teams';

import EnumFilter, { EnumOperation } from './EnumFilter';
import FilterComponent from './FilterComponent';

interface StatusFilterComponentProps {
}

interface StatusFilterComponentState {
}

export default class StatusFilterComponent
  extends FilterComponent<StatusFilterComponentProps, StatusFilterComponentState> {
  onChange = (newValueEvent: ChangeEvent<HTMLSelectElement>) => {
    const { label, propertyName } = this.props;
    const newStatus: TeamStatus = newValueEvent.currentTarget.value as TeamStatus;
    const newFilter: EnumFilter<TeamStatus> =
      new EnumFilter<TeamStatus>(propertyName, label, EnumOperation.INCLUDES, newStatus);
    this.props.onFiltersChanged(newFilter);
  }

  render() {
    const { label } = this.props;
    const userStatuses = Object.values(UserStatus);
    const teamStatuses = Object.values(TeamStatusEnum);

    return (
      <>
        <div>
          {label}
        </div>
        <select className="sd-form__input-select d-block w-100" onChange={this.onChange}>
          {[...userStatuses, ...teamStatuses].map(status =>
            <option key={status} value={status}>{TeamStatusDisplayText.get(status)}</option>
          )}
        </select>
      </>
    );
  }
}
