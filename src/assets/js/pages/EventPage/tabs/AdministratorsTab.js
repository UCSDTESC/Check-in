import PropTypes from 'prop-types';
import React from 'react';

import OrganiserList from '../components/OrganiserList';
import SponsorList from '../components/SponsorList';

import {Event as EventPropType} from '~/proptypes';

import {addNewSponsor, addNewOrganiser, registerAdmin} from '~/data/Api';

export default class AdministratorsTab extends React.Component {
  static propTypes = {
    event: PropTypes.shape(EventPropType).isRequired,
    addEventAlert: PropTypes.func.isRequired,
    loadAllAdminEvents: PropTypes.func.isRequired
  };

  /**
   * Parses from a react-select element into an admin object.
   * @param {Object} newAdmin The react-select admin values.
   * @returns An admin object with username and _id values based off the
   * react-select element.
   */
  parseNewAdmin = (newAdmin) => {
    return {
      username: newAdmin.label,
      _id: newAdmin.value
    };
  };

  /**
   * Handles adding a new sponsor to the event and refreshing the list.
   * @param {Object} newSponsor The new admin object to add as a sponsor.
   */
  onAddNewSponsor = (newSponsor) => {
    let {event, addEventAlert, loadAllAdminEvents} = this.props;

    return addNewSponsor(event.alias, newSponsor._id)
      .then(loadAllAdminEvents)
      .catch(err => addEventAlert(event.alias, err.message, 'danger',
        `Error Adding ${newSponsor.username}`));
  };

  /**
   * Handles adding a new organiser to the event and refreshing the list.
   * @param {Object} newSponsor The new admin object to add as a organiser.
   */
  onAddNewOrganiser = (newOrganiser) => {
    let {event, addEventAlert, loadAllAdminEvents} = this.props;

    return addNewOrganiser(event.alias, newOrganiser._id)
      .then(loadAllAdminEvents)
      .catch(err => addEventAlert(event.alias, err.message, 'danger',
        `Error Adding ${newOrganiser.username}`));
  };

  /**
   * Handles registering a new sponsor in the system and adding them as an
   * sponsor to the current event.
   * @param {Object} newSponsor The new admin object to add as a sponsor.
   */
  registerNewSponsor = (newAdmin) => {
    let {event, addEventAlert} = this.props;

    return registerAdmin(newAdmin)
      .catch(err => addEventAlert(event.alias, err.message,
        'danger', `Error Creating '${newAdmin.username}'`))
      .then((admin) => this.onAddNewSponsor(admin));
  };

  /**
   * Handles registering a new organiser in the system and adding them as an
   * organiser to the current event.
   * @param {Object} newSponsor The new admin object to add as a organiser.
   */
  registerNewOrganiser = (newAdmin) => {
    let {event, addEventAlert} = this.props;

    return registerAdmin(newAdmin)
      .catch(err => addEventAlert(event.alias, err.message,
        'danger', `Error Creating '${newAdmin.username}'`))
      .then((admin) => this.onAddNewOrganiser(admin));
  };

  render() {
    let {event} = this.props;

    return (
      <div className="event-tab">
        <div className="row">
          <div className="col-lg-4 col-md-6">
            <OrganiserList organisers={event.organisers}
              addNewOrganiser={(admin) =>
                this.onAddNewOrganiser(this.parseNewAdmin(admin))}
              registerNewOrganiser={this.registerNewOrganiser} />
          </div>
          <div className="col-lg-4 col-md-6">
            <SponsorList sponsors={event.sponsors}
              addNewSponsor={(admin) =>
                this.onAddNewSponsor(this.parseNewAdmin(admin))}
              registerNewSponsor={this.registerNewSponsor} />
          </div>
        </div>
      </div>
    );
  }
}
