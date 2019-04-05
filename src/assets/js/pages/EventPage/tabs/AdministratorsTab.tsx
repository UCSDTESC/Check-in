import React from 'react';

import OrganiserList from '../components/OrganiserList';
import SponsorList from '../components/SponsorList';

import {addNewSponsor, addNewOrganiser, registerAdmin} from '~/data/Api';
import EventPageTab from './EventPageTab';
import { AdminSelectType } from '~/components/AdminSelect';
import { Admin } from '~/static/types';

interface AdministratorsTabProps {
}

interface AdminReference {
  _id: string;
  username: string;
}

export default class AdministratorsTab extends EventPageTab<AdministratorsTabProps> {
  /**
   * Parses from a react-select element into an admin object.
   * @param {Object} newAdmin The react-select admin values.
   * @returns An admin object with username and _id values based off the
   * react-select element.
   */
  parseNewAdmin = (newAdmin: AdminSelectType): AdminReference => {
    return {
      username: newAdmin.label,
      _id: newAdmin.value,
    } as AdminReference;
  };

  /**
   * Handles adding a new sponsor to the event and refreshing the list.
   * @param {Object} newSponsor The new admin object to add as a sponsor.
   */
  onAddNewSponsor = (newSponsor: AdminReference) => {
    const {event, addEventDangerAlert, loadAllAdminEvents} = this.props;

    return addNewSponsor(event.alias, newSponsor._id)
      .then(loadAllAdminEvents)
      .catch(err => addEventDangerAlert(event.alias, err.message,
        `Error Adding ${newSponsor.username}`));
  };

  /**
   * Handles adding a new organiser to the event and refreshing the list.
   * @param {Object} newSponsor The new admin object to add as a organiser.
   */
  onAddNewOrganiser = (newOrganiser: AdminReference) => {
    const {event, addEventDangerAlert, loadAllAdminEvents} = this.props;

    return addNewOrganiser(event.alias, newOrganiser._id)
      .then(loadAllAdminEvents)
      .catch(err => addEventDangerAlert(event.alias, err.message,
        `Error Adding ${newOrganiser.username}`));
  };

  /**
   * Handles registering a new sponsor in the system and adding them as an
   * sponsor to the current event.
   * @param {Object} newSponsor The new admin object to add as a sponsor.
   */
  registerNewSponsor = (newAdmin: Admin) => {
    const {event, addEventDangerAlert} = this.props;

    return registerAdmin(newAdmin)
      .then((admin) => this.onAddNewSponsor({
        _id: admin._id,
        username: admin.username,
      }))
      .catch(err => addEventDangerAlert(event.alias, err.message, `Error Creating '${newAdmin.username}'`));
  };

  /**
   * Handles registering a new organiser in the system and adding them as an
   * organiser to the current event.
   * @param {Object} newSponsor The new admin object to add as a organiser.
   */
  registerNewOrganiser = (newAdmin: Admin) => {
    const {event, addEventDangerAlert} = this.props;

    return registerAdmin(newAdmin)
      .then((admin) => this.onAddNewOrganiser({
        _id: admin._id,
        username: admin.username,
      }))
      .catch(err => addEventDangerAlert(event.alias, err.message, `Error Creating '${newAdmin.username}'`));
  };

  render() {
    const {event} = this.props;

    return (
      <div className="event-tab">
        <div className="row">
          <div className="col-12 col-md-6">
            <OrganiserList
              organisers={event.organisers}
              addNewOrganiser={(admin) =>
                this.onAddNewOrganiser(this.parseNewAdmin(admin))}
              registerNewOrganiser={this.registerNewOrganiser}
            />
          </div>
          <div className="col-12 col-md-6">
            <SponsorList
              sponsors={event.sponsors}
              addNewSponsor={(admin) =>
                this.onAddNewSponsor(this.parseNewAdmin(admin))}
              registerNewSponsor={this.registerNewSponsor}
            />
          </div>
        </div>
      </div>
    );
  }
}
