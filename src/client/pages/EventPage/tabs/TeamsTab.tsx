import { TESCTeam, UserStatus } from '@Shared/ModelTypes';
import classNames from 'classnames';
import React from 'react';
import Loading from '~/components/Loading';
import { getTeamStatus, TeamStatus } from '~/static/Teams';

import TeamCard from '../components/Teams/TeamCard';
import TeamsFilters from '../components/Teams/TeamsFilters';

import EventPageTab from './EventPageTab';

interface TeamsTabProps {
  teams: TESCTeam[];
}

interface TeamsTabState {
  selectedTeams: Set<string>;
  filteredTeams: Set<string>;
}

export default class TeamsTab extends EventPageTab<TeamsTabProps, TeamsTabState> {
  constructor(props: TeamsTabProps & any) {
    super(props);

    this.state = {
      selectedTeams: new Set<string>(),
      filteredTeams: new Set<string>(props.teams.map((team: TESCTeam) => team._id)),
    };
  }

  /**
   * Callback for when the filters have changed.
   */
  onFilteredChange = (newFiltered: Set<string>) => {
    this.setState({
      filteredTeams: newFiltered,
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

  render() {
    const { teams, columns } = this.props;
    const { filteredTeams } = this.state;

    if (!filteredTeams && !this.props.teams) {
      return <Loading />;
    }

    return (
      <>
        <TeamsFilters teams={teams} onFilteredChanged={this.onFilteredChange} columns={columns} />

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
