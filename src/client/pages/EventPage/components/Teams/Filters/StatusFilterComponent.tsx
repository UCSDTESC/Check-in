import { UserStatus } from '@Shared/UserStatus';
import React from 'react';
import { TeamStatusEnum, TeamStatusDisplayText } from '~/static/Teams';

interface StatusFilterComponentProps {
  label: string;
  onChange: (newStatus: UserStatus) => void;
}

interface StatusFilterComponentState {
}

export default class StatusFilterComponent
  extends React.Component<StatusFilterComponentProps, StatusFilterComponentState> {
  render() {
    const { label } = this.props;
    const userStatuses = Object.values(UserStatus);
    const teamStatuses = Object.values(TeamStatusEnum);

    return (
      <>
        <div>
          {label}
        </div>
        <select className="sd-form__input-select d-block w-100">
          {[...userStatuses, ...teamStatuses].map(status =>
            <option key={status} value={status}>{TeamStatusDisplayText.get(status)}</option>
          )}
        </select>
      </>
    );
  }
}
