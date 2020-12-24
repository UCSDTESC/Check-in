import { TESCTeam, TESCUser } from '@Shared/ModelTypes';
import React, { MouseEvent } from 'react';
import FA from 'react-fontawesome';
import { getTeamStatus, getStatusIndicatorText, TeamStatusDisplayText } from '~/static/Teams';

interface TeamCardProps {
  team: TESCTeam;
  isSelected: boolean;
  onSelect: (team: TESCTeam) => void;
  onEdit: (team: TESCTeam) => void;
}

interface TeamCardState {
}

export default class TeamCard extends React.Component<TeamCardProps, TeamCardState> {
  /**
   * Get a user's full name.
   */
  getUserFullName = (user: TESCUser) => {
    return `${user.firstName} ${user.lastName}`;
  }

  /**
   * Get a user's initials.
   */
  getUserInitials = (user: TESCUser) => {
    return `${user.firstName[0]}${user.lastName[0]}`;
  }

  /**
   * Handles the user clicking the edit button.
   */
  onEditMembers = () => {
    this.props.onEdit(this.props.team);
  }

  render() {
    const { team, isSelected, onSelect } = this.props;

    const teamLeader = team.members[0];
    const teamStatus = getTeamStatus(team.members);

    return (
      <div className={`team team--${teamStatus.toLowerCase()} card`} onClick={() => onSelect(team)}>
        <div className="card-header">
          <h2 className="team__title card-title">
            <input
              className="sd-form__input-checkbox team__select"
              type="checkbox"
              onChange={() => onSelect(team)}
              checked={isSelected}
            />
            <span className="team__name">{team.code}</span>
            <div
              className="team__indicator"
              data-toggle="tooltip"
              data-placement="right"
              title={getStatusIndicatorText(teamStatus)}
              data-offset="0, 8"
            >
              {TeamStatusDisplayText.get(teamStatus)}
            </div>
          </h2>
        </div>
        <div className="card-body team__card">
          <h6 className="team__subtitle card-subtitle mb-2 text-muted">
            Leader: {this.getUserFullName(teamLeader)}
          </h6>
          <div className="team__icons">
            <div className="team__edit" onClick={() => this.onEditMembers()}><FA name="pencil"></FA></div>
            <div className="team__members">
              {
                team.members.map(user => (
                  <div
                    className={`team__member team__member--${user.status.toLowerCase()}`}
                    data-toggle="tooltip"
                    data-placement="bottom"
                    title={this.getUserFullName(user)}
                    key={user._id}
                  >
                    {this.getUserInitials(user)}
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}
