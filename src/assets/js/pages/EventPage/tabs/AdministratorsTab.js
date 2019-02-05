import PropTypes from 'prop-types';
import React from 'react';

import OrganiserList from '../components/OrganiserList';
import SponsorList from '../components/SponsorList';

import {Event as EventPropType} from '~/proptypes';

export default class AdministratorsTab extends React.Component {
  static propTypes = {
    event: PropTypes.shape(EventPropType).isRequired
  };

  render() {
    let {event} = this.props;

    return (
      <div className="event-tab">
        <div className="row">
          <div className="col-lg-4 col-md-6">
            <OrganiserList organisers={event.organisers} />
          </div>
          <div className="col-lg-4 col-md-6">
            <SponsorList sponsors={event.sponsors} />
          </div>
        </div>
      </div>
    );
  }
}
