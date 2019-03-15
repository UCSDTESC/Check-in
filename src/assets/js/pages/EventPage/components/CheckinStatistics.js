import PropTypes from 'prop-types';
import React from 'react';
import FA from 'react-fontawesome';
import {Link} from 'react-router-dom';

export default class CheckinStatistics extends React.Component {
  static propTypes = {
    event: PropTypes.object.isRequired,
    statistics: PropTypes.object
  };

  render() {
    let {event, statistics} = this.props;

    return (
      <Link to={`/admin/checkin/${event.alias}`}
        className={`btn event-page__btn rounded-button
          rounded-button--small rounded-button--arrow`}>
        {statistics.checkedIn} Checked In
      </Link>
    );
  }
}
