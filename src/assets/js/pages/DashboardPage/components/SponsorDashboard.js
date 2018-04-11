import PropTypes from 'prop-types';
import React from 'react';

import {Event as EventPropTypes} from '~/proptypes';

import EventList from './EventList';

export default class SponsorDashboard extends React.Component {
  static propTypes = {
    events: PropTypes.arrayOf(PropTypes.shape(
      EventPropTypes
    ).isRequired).isRequired
  };

  render() {
    let {events} = this.props;

    return (
      <EventList events={events} resumeLink />
    );
  }
}
