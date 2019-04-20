import { Role, RolesColors } from 'Shared/Roles';
import { Admin } from 'Shared/types';
import React from 'react';
import FA from 'react-fontawesome';
import { AdminSelectType } from '~/components/AdminSelect';
import NewAdminModal, { NewAdminModalFormData } from '~/components/NewAdminModal';
import OrganiserSelect from '~/components/OrganiserSelect';

interface OrganiserListProps {
  organisers: Admin[];
  addNewOrganiser: (toAdd: AdminSelectType) => void;
  registerNewOrganiser: (newOrganiser: NewAdminModalFormData) => void;
}

interface OrganiserListState {
  newOrganiser: AdminSelectType;
  isRegisterModalOpen: boolean;
}

export default class OrganiserList extends React.Component<OrganiserListProps, OrganiserListState> {
  state: Readonly<OrganiserListState> = {
    newOrganiser: null,
    isRegisterModalOpen: false,
  };

  changeNewOrganiser = (newOrganiser: AdminSelectType) =>
    this.setState({
      newOrganiser,
    });

  onAddNewOrganiser = () => {
    const {newOrganiser} = this.state;

    this.props.addNewOrganiser(newOrganiser);

    this.changeNewOrganiser(null);
  };

  onRegisterModalSubmit = (values: NewAdminModalFormData) => {
    this.props.registerNewOrganiser(values);

    this.toggleRegisterModal();
  };

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
