import React from 'react';
import {Link} from 'react-router-dom';
import EventStatisticsComponent from './EventStatisticsComponent';

export default class CheckinStatistics extends EventStatisticsComponent {
  render() {
    const {event, statistics} = this.props;

    return (
      <Link
        to={`/admin/checkin/${event.alias}`}
        className={`btn event-page__btn rounded-button
          rounded-button--small rounded-button--arrow`}
      >
        {statistics.checkedIn} Checked In
      </Link>
    );
  }
}
