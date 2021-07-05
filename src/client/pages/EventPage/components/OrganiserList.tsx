import { Admin } from '@Shared/ModelTypes';
import { Role, RolesColors } from '@Shared/Roles';
import React from 'react';
import FA from 'react-fontawesome';
import { AdminSelectType } from '~/components/AdminSelect';
import NewAdminModal, { NewAdminModalFormData } from '~/components/NewAdminModal';
import OrganiserSelect from '~/components/OrganiserSelect';

interface OrganiserListProps {

  // List of organisers for the event
  organisers: Admin[];

  // Callback function to show a modal to add a new organiser to the event
  addNewOrganiser: (toAdd: AdminSelectType) => void;

  // Callback to add the organiser to the event
  registerNewOrganiser: (newOrganiser: NewAdminModalFormData) => void;
}

interface OrganiserListState {

  // The new organiser to be added to the event
  newOrganiser: AdminSelectType;

  // Boolean to track if the new organiser modal is open or not
  isRegisterModalOpen: boolean;
}

/**
 * This component renders an organiser list on the administrators tab of an event
 */
export default class OrganiserList extends React.Component<OrganiserListProps, OrganiserListState> {
  state: Readonly<OrganiserListState> = {
    newOrganiser: null,
    isRegisterModalOpen: false,
  };

  /**
   * Update the components newOrganiser state to the new data
   *
   * @param {AdminSelectType} newOrganiser the new organiser to be set
   */
  changeNewOrganiser = (newOrganiser: AdminSelectType) =>
    this.setState({
      newOrganiser,
    });

  /**
   * Add an (existing organiser) to the system from the dropdown
   */
  onAddNewOrganiser = () => {
    const {newOrganiser} = this.state;

    this.props.addNewOrganiser(newOrganiser);

    this.changeNewOrganiser(null);
  };

  /**
   * Create a new organiser in the system and and close the modal.
   *
   * @param {NewAdminModalFormData} values the new admin to be created in the system
   */
  onRegisterModalSubmit = (values: NewAdminModalFormData) => {
    this.props.registerNewOrganiser(values);

    this.toggleRegisterModal();
  };

  /**
   * Toggle the react state to show the modal or not.
   */
  toggleRegisterModal = () => this.setState({
    isRegisterModalOpen: !this.state.isRegisterModalOpen,
  });

  render() {
    const {organisers} = this.props;
    const {newOrganiser} = this.state;

    return (
      <div className="organiser-list">
        <div className="row">
          <div className="col">
            <h2>Organisers</h2>
          </div>
          <div className="col-auto">
            <button
              className={`rounded-button rounded-button--small rounded-button--secondary px-2`}
              onClick={this.toggleRegisterModal}
            >
              <FA name="plus" /> New
            </button>
          </div>
        </div>
        <ul className="list-group mb-1">
          {organisers.map(organiser => (
            <li
              className="list-group-item organiser-list__username d-flex justify-content-between align-items-center"
              key={organiser.username}
            >
              {organiser.username}
              <div>
                {organiser.checkin && <span className="badge badge-pill">
                  Checkin Account
                </span>}
                <span className={`badge badge-${RolesColors[organiser.role]}`}>
                  {organiser.role}
                </span>
              </div>
            </li>
          ))}
        </ul>
        <div className="row no-gutters align-items-center">
          <div className="col pr-1">
            <OrganiserSelect
              value={newOrganiser}
              onChange={this.changeNewOrganiser}
              exclude={organisers}
            />
          </div>
          <div className="col-auto">
            <button
              className="rounded-button rounded-button--small rounded-button--short"
              onClick={this.onAddNewOrganiser}
              disabled={newOrganiser === null}
              title={newOrganiser ? `Add ${newOrganiser.label}` : ''}
            >
              <FA name="plus" />
            </button>
          </div>
        </div>

        <NewAdminModal
          toggle={this.toggleRegisterModal}
          open={this.state.isRegisterModalOpen}
          onSubmit={this.onRegisterModalSubmit}
          lockRole={Role.ROLE_ADMIN}
          formName="newOrganiser"
        />
      </div>
    );
  }
}
