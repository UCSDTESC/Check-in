import { Admin } from '@Shared/ModelTypes';
import { Role, RolesColors } from '@Shared/Roles';
import React from 'react';
import FA from 'react-fontawesome';
import { AdminSelectType } from '~/components/AdminSelect';
import NewAdminModal, { NewAdminModalFormData } from '~/components/NewAdminModal';
import SponsorSelect from '~/components/SponsorSelect';

interface SponsorListProps {

  // the sponsors for this event
  sponsors: Admin[];

  // callback function to add an existing sponsor to the event
  addNewSponsor: (toAdd: AdminSelectType) => void;

  // function called to create a new sponsor in the system
  registerNewSponsor: (newSponsor: NewAdminModalFormData) => void;
}

interface SponsorListState {

  // the new sponsor to be added
  newSponsor: AdminSelectType;

  // boolean to track if the create sponsor modal is open or not.
  isRegisterModalOpen: boolean;
}

/**
 * This component renders a sponsor list on the administrators tab of an event
 */
export default class SponsorList extends React.Component<SponsorListProps, SponsorListState> {
  state: Readonly<SponsorListState> = {
    newSponsor: null,
    isRegisterModalOpen: false,
  };

  /**
   * Update the components newSponsor state to the new data
   *
   * @param {AdminSelectType} newOrganiser the new sponsor to be set
   */
  changeNewSponsor = (newSponsor: AdminSelectType) =>
    this.setState({
      newSponsor,
    });

  /**
   * Add an (existing sponsor) to the system from the dropdown
   */
  onAddNewSponsor = () => {
    const {newSponsor} = this.state;

    this.props.addNewSponsor(newSponsor);

    this.changeNewSponsor(null);
  };

  /**
   * Create a new sponsor in the system and and close the modal.
   *
   * @param {NewAdminModalFormData} values the new sponsor to be created in the system
   */
  onRegisterModalSubmit = (values: NewAdminModalFormData) => {
    this.props.registerNewSponsor(values);

    this.toggleRegisterModal();
  };

  /**
   * Toggle the react state to show the modal or not.
   */
  toggleRegisterModal = () => this.setState({
    isRegisterModalOpen: !this.state.isRegisterModalOpen,
  });

  render() {
    const {sponsors} = this.props;
    const {newSponsor} = this.state;

    return (
      <div className="sponsor-list">
        <div className="row">
          <div className="col">
            <h2>Sponsors</h2>
          </div>
          <div className="col-auto">
            <button
              className="rounded-button rounded-button--small rounded-button--secondary px-2"
              onClick={this.toggleRegisterModal}
            >
              <FA name="plus" /> New
            </button>
          </div>
        </div>
        <ul className="list-group mb-1">
          {sponsors.map(sponsor => (
            <li
              className="list-group-item sponsor-list__username d-flex justify-content-between align-items-center"
              key={sponsor.username}
            >
              {sponsor.username}
              <div>
                <span className={`badge badge-${RolesColors[sponsor.role]}`}>
                  {sponsor.role}
                </span>
              </div>
            </li>
          ))}
        </ul>
        <div className="row no-gutters align-items-center">
          <div className="col pr-1">
            <SponsorSelect
              value={newSponsor}
              onChange={this.changeNewSponsor}
              exclude={sponsors}
            />
          </div>
          <div className="col-auto">
            <button
              className="rounded-button rounded-button--small rounded-button--short"
              onClick={this.onAddNewSponsor}
              disabled={newSponsor === null}
              title={newSponsor ? `Add ${newSponsor.label}` : ''}
            >
              <FA name="plus" />
            </button>
          </div>
        </div>

        <NewAdminModal
          toggle={this.toggleRegisterModal}
          open={this.state.isRegisterModalOpen}
          onSubmit={this.onRegisterModalSubmit}
          lockRole={Role.ROLE_SPONSOR}
          formName="newSponsor"
        />
      </div>
    );
  }
}
