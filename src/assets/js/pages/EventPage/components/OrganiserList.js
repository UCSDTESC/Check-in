import PropTypes from 'prop-types';
import React from 'react';
import FA from 'react-fontawesome';

import {Admin as AdminPropTypes} from '~/proptypes';

import OrganiserSelect from '~/components/OrganiserSelect';

import NewAdminModal from '~/components/NewAdminModal';

import {Roles, RolesColors} from '~/static/Roles';

export default class OrganiserList extends React.Component {
  static propTypes = {
    organisers: PropTypes.arrayOf(PropTypes.shape(
      AdminPropTypes
    ).isRequired).isRequired,
    addNewOrganiser: PropTypes.func.isRequired,
    registerNewOrganiser: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      newOrganiser: null,
      isRegisterModalOpen: false
    };
  }

  changeNewOrganiser = (newOrganiser) =>
    this.setState({
      newOrganiser
    });

  onAddNewSponsor = () => {
    let {newOrganiser} = this.state;

    this.props.addNewOrganiser(newOrganiser);

    this.changeNewOrganiser(null);
  };

  onRegisterModalSubmit = (values) => {
    this.props.registerNewOrganiser(values);

    this.toggleRegisterModal();
  };

  toggleRegisterModal = () => this.setState({
    isRegisterModalOpen: !this.state.isRegisterModalOpen
  });

  render() {
    let {organisers} = this.props;
    let {newOrganiser} = this.state;

    return (
      <div className="organiser-list">
        <h2>Organisers</h2>
        <ul className="list-group mb-1">
          {organisers.map(organiser => (
            <li className={`list-group-item organiser-list__username d-flex
              justify-content-between align-items-center`}
              key={organiser.username}>
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
          <div className="col-10 pr-1">
            <OrganiserSelect value={newOrganiser}
              onChange={this.changeNewOrganiser}
              exclude={organisers} />
          </div>
          <div className="col-2">
            <button className={`rounded-button rounded-button--small
              rounded-button--full`} onClick={this.toggleRegisterModal}>
              <FA name="plus" />
            </button>
          </div>
        </div>
        {newOrganiser !== null && <button className={`btn event-page__btn
          rounded-button rounded-button--small mt-1`}
          onClick={this.onAddNewSponsor}>
            Add {newOrganiser.label}
          </button>}

        <NewAdminModal toggle={this.toggleRegisterModal}
          open={this.state.isRegisterModalOpen}
          onSubmit={this.onRegisterModalSubmit}
          lockRole={Roles.ROLE_ADMIN}
          formName="newOrganiser" />
      </div>
    );
  }
}
