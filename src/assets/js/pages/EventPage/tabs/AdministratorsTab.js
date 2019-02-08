import PropTypes from 'prop-types';
import React from 'react';

import OrganiserList from '../components/OrganiserList';
import SponsorList from '../components/SponsorList';

import {Event as EventPropType} from '~/proptypes';

import {addNewSponsor, addNewOrganiser} from '~/data/Api';

export default class AdministratorsTab extends React.Component {
  static propTypes = {
    event: PropTypes.shape(EventPropType).isRequired,
    addEventAlert: PropTypes.func.isRequired,
    loadAllAdminEvents: PropTypes.func.isRequired
  };

  onAddNewSponsor = (newSponsor) => {
    let {event, addEventAlert, loadAllAdminEvents} = this.props;

    addNewSponsor(event.alias, newSponsor.value)
      .then(loadAllAdminEvents)
      .catch(err => addEventAlert(event.alias, err, 'danger',
        `Error Adding ${newSponsor.label}`));
  };

  onAddNewOrganiser = (newOrganiser) => {
    let {event, addEventAlert, loadAllAdminEvents} = this.props;

    addNewOrganiser(event.alias, newOrganiser.value)
      .then(loadAllAdminEvents)
      .catch(err => addEventAlert(event.alias, err, 'danger',
        `Error Adding ${newOrganiser.label}`));
  };

  render() {
    let {event} = this.props;

    return (
      <div className="event-tab">
        <div className="row">
          <div className="col-lg-4 col-md-6">
            <OrganiserList organisers={event.organisers}
              addNewOrganiser={this.onAddNewOrganiser} />
          </div>
          <div className="col-lg-4 col-md-6">
            <SponsorList sponsors={event.sponsors}
              addNewSponsor={this.onAddNewSponsor} />
          </div>
        </div>
      </div>
    );
  }
}
