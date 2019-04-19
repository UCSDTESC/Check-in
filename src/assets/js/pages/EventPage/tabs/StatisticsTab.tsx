import React from 'react';
import { EventStatistics } from '~/static/types';

import EventStatisticsCharts from '../components/EventStatisticsCharts';
import GenderStatistics from '../components/GenderStatistics';

import EventPageTab from './EventPageTab';

interface StatisticsTabProps {
  statistics: EventStatistics | null;
}

export default class StatisticsTab extends EventPageTab<StatisticsTabProps> {

  render() {
    const {event, statistics} = this.props;
    if (statistics === null) {
      return <></>;
    }

    return (
      <div className="event-tab">
        <div className="row">
          <div className="col-lg-4 col-md-6">
            <EventStatisticsCharts event={event} statistics={statistics} />
          </div>
          <div className="col-lg-4 col-md-6">
            <GenderStatistics event={event} statistics={statistics} />
          </div>
        </div>
      </div>
    );
  }
}
