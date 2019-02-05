import PropTypes from 'prop-types';
import React from 'react';

import EventStatistics from '../components/EventStatistics';

import {Event as EventPropType} from '~/proptypes';

export default class StatisticsTab extends React.Component {
  static propTypes = {
    event: PropTypes.shape(EventPropType).isRequired,
    statistics: PropTypes.object
  };

  constructor(props) {
    super(props);
  }

  render() {
    let {event, statistics} = this.props;

    return (
      <div className="event-tab">
        <div className="row">
          <div className="col-lg-4 col-md-6">
            <EventStatistics event={event} statistics={statistics} />
          </div>
        </div>
      </div>
    );
  }
}
