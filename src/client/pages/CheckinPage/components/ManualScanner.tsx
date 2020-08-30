import { TESCUser } from '@Shared/ModelTypes';
import React from 'react';

import Scanner from './Scanner';

interface ManualScannerProps {

  // All users in this event.
  users: TESCUser[];
}

interface ManualScannerState {
  // All eligible users for the search query.
  filteredApplicants: TESCUser[];
}

export default class ManualScanner extends Scanner<ManualScannerProps, ManualScannerState> {
  state: Readonly<ManualScannerState> = {
    filteredApplicants: [],
  };

  /**
   * Search function for filtering users according to the input in this component
   * 
   * @param {React.FormEvent} event the input event being reacted to.
   */
  nameApplicants = (event: React.FormEvent<HTMLInputElement>) => {
    const {users} = this.props;

    const name = event.currentTarget.value;

    // Do not issue a search for less than 3 charactes.
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

  /**
   * When an applicant is selected form the filteredApplicants, make the 
   * request to check in said user.
   * 
   * @param {TESCUser} user The user to be checked in.
   */
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
