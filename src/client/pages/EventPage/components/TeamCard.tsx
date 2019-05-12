import { TESCTeam, UserStatus, TESCUser } from '@Shared/ModelTypes';
import React from 'react';

enum TeamStatusEnum {
  Unmatched = 'Unmatched',
}

export type TeamStatus = UserStatus | TeamStatusEnum;

interface TeamCardProps {
  team: TESCTeam;
}

interface TeamCardState {
  isSelected: boolean;
}

export default class TeamCard extends React.Component<TeamCardProps, TeamCardState> {
  state: Readonly<TeamCardState> = {
    isSelected: false,
  };

  /**
   * Toggle the select state of the card.
   */
  toggleSelectCard = () => {
    this.setState({
      isSelected: !this.state.isSelected,
    });
  }

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
   * Get the text that should be in the team status indicator.
   */
  getStatusIndicatorText = (status: TeamStatus) => {
    if (status !== TeamStatusEnum.Unmatched) {
      return `All ${status}`;
    }
    return 'Different Statuses';
  }

  /**
   * Determine the team status given the list of teammates.
   */
  getTeamStatus = (teammates: TESCUser[]): TeamStatus => {
    const initialStatus = teammates[0].status;

    for (const user of teammates) {
      if (user.status !== initialStatus) {
        return TeamStatusEnum.Unmatched;
      }
    }

    return initialStatus;
  }

  render() {
    const { team } = this.props;
    const { isSelected } = this.state;

    const teamLeader = team.teammates[0];
    const teamStatus = this.getTeamStatus(team.teammates);

    return (
      <div className={`team team--${teamStatus.toLowerCase()} card`}>
        <div className="card-body team__card">
          <h2 className="team__title card-title">
            <input
              className="sd-form__input-checkbox team__select"
              type="checkbox"
              onChange={this.toggleSelectCard}
              checked={isSelected}
            />
            <span className="team__name">{team.code}</span>
            <div
              className="team__indicator"
              data-toggle="tooltip"
              data-placement="right"
              title={this.getStatusIndicatorText(teamStatus)}
              data-offset="0, 8"
            />
          </h2>
          <h6 className="team__subtitle card-subtitle mb-2 text-muted">
            Leader: {this.getUserFullName(teamLeader)}
          </h6>
          <div className="team__members">
            {
              team.teammates.map(user => (
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
    );
  }
}
