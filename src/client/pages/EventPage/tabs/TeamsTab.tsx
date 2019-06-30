import { TESCTeam, TESCUser } from '@Shared/ModelTypes';
import classnames from 'classnames';
import React from 'react';
import FA from 'react-fontawesome';
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
  selectedUsers: Set<TESCUser>;
  filteredTeams: Set<string>;
}

export default class TeamsTab extends EventPageTab<TeamsTabProps, TeamsTabState> {
  constructor(props: TeamsTabProps & any) {
    super(props);

    this.state = {
      selectedTeams: new Set<string>(),
      selectedUsers: new Set<TESCUser>(),
      filteredTeams: new Set<string>(props.teams.map((team: TESCTeam) => team._id)),
    };
  }

  getUsersFromTeamSet = (teamSet: Set<string>) =>
    this.props.teams
      .filter(team => teamSet.has(team._id))
      .reduce((current, team) => [...current, ...team.members], [] as TESCUser[])

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
      selectedUsers: new Set(this.getUsersFromTeamSet(newSelected)),
      filteredTeams: newFiltered,
    });
  }

  /**
   * Changes the selected set to a new set.
   */
  selectSet = (newSet: Set<string>) => {
    this.setState({
      selectedTeams: newSet,
      selectedUsers: new Set(this.getUsersFromTeamSet(newSet)),
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
      selectedUsers: new Set(this.getUsersFromTeamSet(newSelect)),
    });
  };

  /**
   * Deselects all teams.
   */
  deselectAll = () => {
    this.setState({
      selectedTeams: new Set(),
      selectedUsers: new Set(),
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
      const newSelectedTeams = new Set([
        ...this.state.selectedTeams,
        team._id,
      ]);

      this.setState({
        selectedTeams: newSelectedTeams,
        selectedUsers: new Set(this.getUsersFromTeamSet(newSelectedTeams)),
      });
    } else {
      // Copy to keep state immutable
      const teamsLess = new Set(this.state.selectedTeams);
      teamsLess.delete(team._id);

      this.setState({
        selectedTeams: teamsLess,
        selectedUsers: new Set(this.getUsersFromTeamSet(teamsLess)),
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

  renderModifyButtons() {
    const { selectedTeams, selectedUsers } = this.state;
    const numTeams = selectedTeams.size;
    const numUsers = selectedUsers.size;

    const buttonClasses = ['btn', 'btn-primary', 'team__action-btn'];
    const hidden = { 'team__action-btn--hidden': numTeams === 0 };

    return (
      <>
        Selected <span className="ml-2">{numTeams}</span> <FA name="users" />{' '}
        <span className="ml-2">{numUsers}</span> <FA name="user" />
        {numUsers > 0 && <div className="btn-group ml-2" role="group">
          <button className={classnames(buttonClasses, hidden, 'team__action-btn--confirmed')}>
            Admit <span className="badge badge-light">{numUsers}</span>
          </button>
          <button className={classnames(buttonClasses, hidden, 'team__action-btn--waitlisted')}>
            Waitlist <span className="badge badge-light">{numUsers}</span>
          </button>
          <button className={classnames(buttonClasses, hidden, 'team__action-btn--rejected')}>
            Reject <span className="badge badge-light">{numUsers}</span>
          </button>
        </div>}
      </>
    );
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
        >
          {this.renderModifyButtons()}
        </TeamsFilters>

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
