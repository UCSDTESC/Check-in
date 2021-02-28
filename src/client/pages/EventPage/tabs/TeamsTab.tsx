import { TESCTeam, TESCUser, TESCEvent } from '@Shared/ModelTypes';
import { UserStatus } from '@Shared/UserStatus';
import classnames from 'classnames';
import React from 'react';
import FA from 'react-fontawesome';
import Loading from '~/components/Loading';
import { bulkChange, addUsersToTeam, removeUsersFromTeam } from '~/data/AdminApi';

import { addEventSuccessAlert, addEventDangerAlert } from '../actions';
import ConfirmActionModal from '../components/Teams/ConfirmActionModal';
import { CheckboxState } from '../components/Teams/SelectAllCheckbox';
import TeamCard from '../components/Teams/TeamCard';
import TeamsFilters from '../components/Teams/TeamsFilters';

import EventPageTab from './EventPageTab';
import EditTeamModal from '~/components/EditTeamModal';

enum UserAction {
  Admit = 'Admit',
  Waitlist = 'Waitlist',
  Reject = 'Reject',
}

interface ConfirmModalState {
  isOpen: boolean;
  actionType: UserAction;
}
interface EditModalState {
  isOpen: boolean;
  team?: TESCTeam;
}

interface TeamsTabProps {
  event: TESCEvent;
  teams: TESCTeam[];
  onTeamsUpdate: () => void;
}

interface TeamsTabState {
  selectedTeams: Set<string>;
  selectedUsers: Set<TESCUser>;
  filteredTeams: Set<string>;

  confirmModalState: ConfirmModalState;
  editModalState: EditModalState;
}

export default class TeamsTab extends EventPageTab<TeamsTabProps, TeamsTabState> {
  constructor(props: TeamsTabProps) {
    super(props as any);

    this.state = {
      selectedTeams: new Set<string>(),
      selectedUsers: new Set<TESCUser>(),
      filteredTeams: new Set<string>(props.teams.map((team: TESCTeam) => team._id)),
      confirmModalState: {
        isOpen: false,
        actionType: UserAction.Admit,
      },
      editModalState: {
        isOpen: false,
      },
    };
  }

  /**
   * Gets the list of users in a given set of team IDs.
   */
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

  /**
   * Handles when the admin clicks on a user action button.
   */
  onUserAction = (actionType: UserAction) => {
    // Open the modal and set action type
    this.setState({
      confirmModalState: {
        isOpen: true,
        actionType: actionType,
      },
    });
  };

  /**
   * Handles when the user chooses an option within the confirm modal.
   */
  onConfirmModalClosed = (shouldAct: boolean) => {
    // Close the modal
    this.setState({
      confirmModalState: {
        isOpen: false,
        actionType: UserAction.Admit,
      },
    });

    // Exit out if the admin decides to cancel their action.
    if (!shouldAct) {
      return;
    }

    // Perform the action
    const { event } = this.props;
    const userAction = this.state.confirmModalState.actionType;
    let newStatus: UserStatus;
    switch (userAction) {
      case (UserAction.Admit):
        newStatus = UserStatus.Unconfirmed;
        break;
      case (UserAction.Reject):
        newStatus = UserStatus.Rejected;
        break;
      case (UserAction.Waitlist):
        newStatus = UserStatus.Waitlisted;
        break;
      default:
        return;
    }
    const userIDs = Array.from(this.state.selectedUsers, user => user._id);

    bulkChange(userIDs, newStatus)
      .then(() => {
        // Reload tab
        this.props.onTeamsUpdate();
        addEventSuccessAlert(event.alias, `Successfully updated ${userIDs.length} user(s)!`,
          'Update Teams');
      })
      .catch((err) => {
        addEventDangerAlert(event.alias, err.message, 'Update Teams');
        console.error(err);
      });
  }

  onTeamEdit = (team: TESCTeam) => {
    this.setState({
      editModalState: {
        isOpen: true,
        team,
      }
    })
  }

  handleTeamEditSubmit = async (newTeam: TESCTeam) => {
    const oldTeam = this.state.editModalState.team;
    const deletedMembersEmails = oldTeam.members.filter(user => !newTeam.members.includes(user)).map(user => user.account!.email!)
    const addedMembersEmails = newTeam.members.filter(user => !oldTeam.members.includes(user)).map(user => user.account!.email!)

    const removedAllOldMembers = deletedMembersEmails.length === oldTeam.members.length;
    if (removedAllOldMembers && addedMembersEmails.length > 0) {
      if (oldTeam.members.length === 4) {
        // Can't add a new member when the team is full
        const deletedUser = deletedMembersEmails.pop();
        await removeUsersFromTeam([deletedUser], this.props.event._id!, oldTeam._id!)
      }

      // We need to add one member before removing everyone else, so that we don't delete the team due to no members
      const newUser = addedMembersEmails.pop();
      await addUsersToTeam([newUser], this.props.event._id!, newTeam._id!)
    }

    deletedMembersEmails.length > 0 && await removeUsersFromTeam(deletedMembersEmails, this.props.event._id!, oldTeam._id!)
    addedMembersEmails.length > 0 && await addUsersToTeam(addedMembersEmails, this.props.event._id!, oldTeam._id!)
    this.onTeamModalToggle();
    this.props.onTeamsUpdate();
  }

  onTeamModalToggle = () => {
    this.setState({
      editModalState: {
        isOpen: false,
        team: null,
      }
    });
  }

  /**
   * Renders the buttons which modifies the selected users
   */
  renderModifyButtons() {
    const { selectedTeams, selectedUsers } = this.state;
    const numTeams = selectedTeams.size;
    const numUsers = selectedUsers.size;

    const buttonClasses = ['btn', 'btn-primary', 'team__action-btn'];
    const hidden = { 'team__action-btn--hidden': numTeams === 0 };

    return (
      <div>
        {numUsers > 0 && <div className="btn-group" role="group">
          <button
            className={classnames(buttonClasses, hidden, 'team__action-btn--confirmed')}
            onClick={() => this.onUserAction(UserAction.Admit)}
          >
            Admit <span className="badge badge-light">{numUsers}</span>
          </button>
          <button
            className={classnames(buttonClasses, hidden, 'team__action-btn--waitlisted')}
            onClick={() => this.onUserAction(UserAction.Waitlist)}
          >
            Waitlist <span className="badge badge-light">{numUsers}</span>
          </button>
          <button
            className={classnames(buttonClasses, hidden, 'team__action-btn--rejected')}
            onClick={() => this.onUserAction(UserAction.Reject)}
          >
            Reject <span className="badge badge-light">{numUsers}</span>
          </button>
        </div>}
      </div>
    );
  }

  /**
   * Renders the field that displays the number of filtered teams and users.
   */
  renderFilteredCount() {
    const { filteredTeams } = this.state;
    const numTeams = filteredTeams.size;

    const numUsers = this.getUsersFromTeamSet(filteredTeams).length;

    return (
      <div>
        Filtered <span className="ml-2">{numTeams}</span> <FA name="users" />{' '}
        <span className="ml-2">{numUsers}</span> <FA name="user" />
      </div>
    );
  }

  /**
   * Renders the field that displays the number of selected teams and users.
   */
  renderSelectedCount() {
    const { selectedTeams, selectedUsers } = this.state;
    const numTeams = selectedTeams.size;
    const numUsers = selectedUsers.size;

    return (
      <div>
        Selected <span className="ml-2">{numTeams}</span> <FA name="users" />{' '}
        <span className="ml-2">{numUsers}</span> <FA name="user" />
      </div>
    );
  }

  render() {
    const { teams, columns } = this.props;
    const { filteredTeams, selectedTeams, selectedUsers, confirmModalState, editModalState } = this.state;

    if (filteredTeams.size === 0 && teams.length === 0) {
      return <Loading title="Teams" />;
    }

    return (
      <>
        <ConfirmActionModal
          isOpen={confirmModalState.isOpen}
          selectedUsers={selectedUsers.size}
          actionType={confirmModalState.actionType}
          onConfirmChoice={this.onConfirmModalClosed}
        />
        <EditTeamModal
          open={editModalState.isOpen}
          toggle={this.onTeamModalToggle}
          initialValues={editModalState.team}
          onSubmit={this.handleTeamEditSubmit}
        />
        <TeamsFilters
          teams={teams}
          onFilteredChanged={this.onFilteredChange}
          columns={columns}
          selectAllState={this.getSelectAllState(filteredTeams, selectedTeams)}
          onSelectAll={this.onSelectAll}
        >
          <div className="d-flex flex-row">
            <div>
              {this.renderModifyButtons()}
            </div>
            <div className="d-flex flex-column align-items-end ml-2">
              {this.renderFilteredCount()}
              {this.renderSelectedCount()}
            </div>
          </div>
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
                onEdit={this.onTeamEdit}
              />
            )}
        </div>
      </>
    );
  }
}
