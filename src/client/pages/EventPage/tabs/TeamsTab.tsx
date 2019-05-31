import { TESCTeam, UserStatus } from '@Shared/ModelTypes';
import classNames from 'classnames';
import React from 'react';
import Loading from '~/components/Loading';
import { getTeamStatus, TeamStatus } from '~/static/Teams';

import TeamCard from '../components/TeamCard';

import EventPageTab from './EventPageTab';

interface TeamsTabProps {
  teams: TESCTeam[];
}

interface TeamsTabState {
  selectedTeams: Set<string>;
  filteredTeams: Set<string>;
}

export default class TeamsTab extends EventPageTab<TeamsTabProps, TeamsTabState> {
  admittedTeams: Set<string> = new Set();
  notAdmittedTeams: Set<string> = new Set();

  constructor(props: TeamsTabProps & any) {
    super(props);

    this.state = {
      selectedTeams: new Set<string>(),
      filteredTeams: new Set<string>(props.teams.map((team: TESCTeam) => team._id)),
    };

    this.constructAdmitted(props.teams);
    this.constructNotAdmitted(props.teams);
  }

  componentDidUpdate(prevProps: TeamsTabProps) {
    const newTeams = this.props.teams;

    if (newTeams !== prevProps.teams) {
      this.constructAdmitted(newTeams);
      this.constructNotAdmitted(newTeams);
    }
  }

  /**
   * Constructs the list of all teams that have been admitted.
   */
  constructAdmitted = (teams: TESCTeam[]) => {
    const admittedStatuses: Set<TeamStatus> = new Set([UserStatus.Confirmed, UserStatus.Unconfirmed,
    UserStatus.Declined, UserStatus.Late]);

    this.admittedTeams = new Set(
      this.props.teams
        .filter(team => admittedStatuses.has(getTeamStatus(team.teammates)))
        .map(team => team._id)
    );
  };

  /**
   * Constructs the list of all teams that are not admitted.
   */
  constructNotAdmitted = (teams: TESCTeam[]) => {
    const notAdmittedStatuses: Set<TeamStatus> = new Set([UserStatus.NoStatus, UserStatus.Waitlisted]);

    this.notAdmittedTeams = new Set(
      this.props.teams
        .filter(team => notAdmittedStatuses.has(getTeamStatus(team.teammates)))
        .map(team => team._id)
    );
  };

  /**
   * Determines whether two sets of teams are equivalent.
   */
  areTeamSetsEqual = (a: Set<string>, b: Set<string>) => a.size === b.size && [...a].every(value => b.has(value));

  /**
   * Clears the admitted/not admitted filters.
   */
  clearFilters = () => {
    this.setState({
      filteredTeams: new Set<string>(this.props.teams.map((team: TESCTeam) => team._id)),
    });
  };

  /**
   * Changes the filtered set to a new set.
   */
  filterSet = (newSet: Set<string>) => {
    this.setState({
      filteredTeams: newSet,
    });
  }

  /**
   * Changes the selected set to a new set.
   */
  selectSet = (newSet: Set<string>) => {
    this.setState({
      selectedTeams: newSet,
    });
  }

  /**
   * Selects all teams.
   */
  selectAll = () => {
    const newSelect: Set<string> = new Set(
      this.props.teams
        .map(team => team._id)
    );

    this.setState({
      selectedTeams: newSelect,
    });
  };

  /**
   * Selects all teams that match a given status.
   */
  selectAllByStatus = (target: TeamStatus) => {
    const newSelect: Set<string> = new Set(
      this.props.teams
        .filter(team => getTeamStatus(team.teammates) === target)
        .map(team => team._id)
    );

    this.setState({
      selectedTeams: newSelect,
    });
  };

  /**
   * Determines whether a given team is selected.
   */
  isTeamSelected = (team: TESCTeam) =>
    this.state.selectedTeams.has(team._id);

  /**
   * Handles a team card being selected.
   */
  onTeamSelect = (team: TESCTeam) => {
    if (!this.isTeamSelected(team)) {
      this.setState({
        selectedTeams: new Set([
          ...this.state.selectedTeams,
          team._id,
        ]),
      });
    } else {
      // Copy to keep state immutable
      const teamsLess = new Set(this.state.selectedTeams);
      teamsLess.delete(team._id);
      this.setState({
        selectedTeams: teamsLess,
      });
    }
  }

  renderSelectButtons = (teams: TESCTeam[]) => {
    const { filteredTeams } = this.state;

    const baseClasses = ['btn', 'teams-filters__button'];
    const allTeamsClasses = classNames(baseClasses, {
      'teams-filters__button--active': filteredTeams.size === teams.length,
    });
    const admittedTeamsClasses = classNames(baseClasses, {
      'teams-filters__button--active': this.areTeamSetsEqual(filteredTeams, this.admittedTeams),
    });
    const notAdmittedTeamsClasses = classNames(baseClasses, {
      'teams-filters__button--active': this.areTeamSetsEqual(filteredTeams, this.notAdmittedTeams),
    });

    return (
      <div className="row teams-filters teams-filters--border">
        <div className="btn-group" role="group">
          <button
            type="button"
            className={allTeamsClasses}
            onClick={() => this.clearFilters()}
          >
            All Teams ({teams.length})
          </button>
          <button
            type="button"
            className={admittedTeamsClasses}
            onClick={() => this.filterSet(this.admittedTeams)}
          >
            Admitted ({this.admittedTeams.size})
          </button>
          <button
            type="button"
            className={notAdmittedTeamsClasses}
            onClick={() => this.filterSet(this.notAdmittedTeams)}
          >
            Not Admitted ({this.notAdmittedTeams.size})
          </button>
        </div>
      </div>
    );
  }

  render() {
    const { teams } = this.props;
    const { filteredTeams } = this.state;

    if (!filteredTeams && !this.props.teams) {
      return <Loading />;
    }

    return (
      <>
        {this.renderSelectButtons(teams)}

        <div className="row teams-filters teams-filters--secondary teams-filters--border">

          <button className="btn teams-filters__button teams-filters__button--new mr-2" type="button">
            New Filter
          </button>

          <div className="btn teams-filters__filter mr-2">
            Members are from UCSD
          </div>

          <div className="btn teams-filters__filter mr-2">
            Members are Male
          </div>
        </div>

        <div className="team__container">
          {teams
            .filter(team => filteredTeams.has(team._id))
            .map(team =>
              <TeamCard
                key={team._id}
                team={team}
                isSelected={this.isTeamSelected(team)}
                onSelect={this.onTeamSelect}
              />
            )}
        </div>
      </>
    );
  }
}
