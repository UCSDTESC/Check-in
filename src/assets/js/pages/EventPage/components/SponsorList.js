import PropTypes from 'prop-types';
import React from 'react';
import FA from 'react-fontawesome';

import SponsorSelect from '~/components/SponsorSelect';

import {Admin as AdminPropTypes} from '~/proptypes';

import NewAdminModal from '~/components/NewAdminModal';

import {Roles} from '~/static/Roles';

export default class SponsorList extends React.Component {
  static propTypes = {
    sponsors: PropTypes.arrayOf(PropTypes.shape(
      AdminPropTypes
    ).isRequired).isRequired,
    addNewSponsor: PropTypes.func.isRequired,
    registerNewSponsor: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      newSponsor: null,
      isRegisterModalOpen: false
    };
  }

  changeNewSponsor = (newSponsor) =>
    this.setState({
      newSponsor
    });

  onAddNewSponsor = () => {
    let {newSponsor} = this.state;

    this.props.addNewSponsor(newSponsor);

    this.changeNewSponsor(null);
  };

  onRegisterModalSubmit = (values) => {
    this.props.registerNewSponsor(values);

    this.toggleRegisterModal();
  };

  toggleRegisterModal = () => this.setState({
    isRegisterModalOpen: !this.state.isRegisterModalOpen
  });

  render() {
    let {sponsors} = this.props;
    let {newSponsor} = this.state;

    return (
      <div className="sponsor-list">
        <h2>Sponsors</h2>
        <ul className="list-group mb-1">
          {sponsors.map(sponsor => (
            <li className="list-group-item sponsor-list__username"
              key={sponsor.username}>
              {sponsor.username}
            </li>
          ))}
        </ul>
        <div className="row no-gutters align-items-center">
          <div className="col-10 pr-1">
            <SponsorSelect value={newSponsor} onChange={this.changeNewSponsor}
              exclude={sponsors} />
          </div>
          <div className="col-2">
            <button className={`rounded-button rounded-button--small
              rounded-button--full`} onClick={this.toggleRegisterModal}>
              <FA name="plus" />
            </button>
          </div>
        </div>
        {newSponsor !== null && <button className={`btn event-page__btn
          rounded-button rounded-button--small mt-1`}
          onClick={this.onAddNewSponsor}>
            Add {newSponsor.label}
          </button>}

        <NewAdminModal toggle={this.toggleRegisterModal}
          open={this.state.isRegisterModalOpen}
          onSubmit={this.onRegisterModalSubmit}
          lockRole={Roles.ROLE_SPONSOR}
          formName="newSponsor" />
      </div>
    );
  }
}
