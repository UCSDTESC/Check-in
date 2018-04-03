import PropTypes from 'prop-types';
import React from 'react';
import {Link} from 'react-router-dom';

export default class CheckinStatistics extends React.Component {
  static propTypes = {
    event: PropTypes.object.isRequired,
    statistics: PropTypes.object
  };

  render() {
    let {event, statistics} = this.props;

    return (
      <div className="event-statistics">
        <h2>Check-In</h2>
        <h3>{statistics.checkedIn} Checked In</h3>
        <Link to={`/admin/checkin/${event.alias}`}>Check-In Page</Link>
      </div>
    );
  }
}
