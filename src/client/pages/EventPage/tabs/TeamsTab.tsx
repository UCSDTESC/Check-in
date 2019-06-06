import { TESCTeam } from '@Shared/ModelTypes';
import React from 'react';
import Loading from '~/components/Loading';

import { CheckboxState } from '../components/Teams/SelectAllCheckbox';
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
    // Ensure we aren't selecting any teams that aren't available anymore
    const newSelected = new Set(
      [...this.state.selectedTeams]
        .filter(team => newFiltered.has(team))
    );

    this.setState({
      selectedTeams: newSelected,
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
   * Selects all currently filtered teams.
   */
  selectAll = () => {
    const newSelect: Set<string> = new Set(
      this.state.filteredTeams
    );

    this.setState({
      selectedTeams: newSelect,
    });
  };

  /**
   * Deselects all teams.
   */
  deselectAll = () => {
    this.setState({
      selectedTeams: new Set(),
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

  /**
   * Determine the state of the select all button given the number of selected teams.
   */
  getSelectAllState = (filteredTeams: Set<string>, selectedTeams: Set<string>): CheckboxState => {
    if (selectedTeams.size === 0) {
      return CheckboxState.UNCHECKED;
    }
    if (filteredTeams.size === selectedTeams.size) {
      return CheckboxState.CHECKED;
    }
    return CheckboxState.INDETERMINATE;
  }

  /**
   * Handles the callback of the select all button.
   */
  onSelectAll = () => {
    const { filteredTeams, selectedTeams } = this.state;
    const currentState = this.getSelectAllState(filteredTeams, selectedTeams);

    if (currentState === CheckboxState.CHECKED) {
      this.deselectAll();
    } else {
      this.selectAll();
    }
  }

  render() {
    const { teams, columns } = this.props;
    const { filteredTeams, selectedTeams } = this.state;

    if (filteredTeams.size === 0 && teams.length === 0) {
      return <Loading title="Teams" />;
    }

    return (
      <>
        <TeamsFilters
          teams={teams}
          onFilteredChanged={this.onFilteredChange}
          columns={columns}
          selectAllState={this.getSelectAllState(filteredTeams, selectedTeams)}
          onSelectAll={this.onSelectAll}
        />

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
