import { TESCUser } from 'Shared/types';
import React from 'react';

import Scanner from './Scanner';

interface ManualScannerProps {
  users: TESCUser[];
}

interface ManualScannerState {
  filteredApplicants: TESCUser[];
}

export default class ManualScanner extends Scanner<ManualScannerProps, ManualScannerState> {
  state: Readonly<ManualScannerState> = {
    filteredApplicants: [],
  };

  nameApplicants = (event: React.FormEvent<HTMLInputElement>) => {
    const {users} = this.props;

    const name = event.currentTarget.value;
    if (name.length < 3) {
      return;
    }

    // Filter by given name
    const eligibleUsers = users.filter((user) =>
      (`${user.firstName} ${user.lastName}`).indexOf(name) !== -1 ||
      user.account.email.indexOf(name) !== -1);
    this.setState({
      filteredApplicants: eligibleUsers,
    });
  }

  selectedApplicant = (user: TESCUser) => {
    this.setState({
      filteredApplicants: [],
    });

    this.props.onUserScanned(user._id);
  }

  render() {
    const {filteredApplicants} = this.state;

    return (
      <div className="row">
        <div className="col-12 text-center">
          <h2>Hacker Search</h2>
          <input
            type="text"
            placeholder="Name or Email"
            className="rounded-input"
            onChange={this.nameApplicants}
          />
          <ul className="checkin__list">
            {filteredApplicants.map((app) => (
              <li className="checkin__list-user" key={app._id}>
                <button
                  className="rounded-button rounded-button--small"
                  onClick={() => this.selectedApplicant(app)}
                >
                  {app.firstName} {app.lastName}<br/>
                  <small>{app.account.email}</small>
                </button>
              </li>)
            )}
          </ul>
        </div>
      </div>
    );
  }
}
