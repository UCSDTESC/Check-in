import { EventStatistics } from '@Shared/api/Responses';
import React from 'react';
import Loading from '~/components/Loading';

import EventStatisticsCharts from '../components/EventStatisticsCharts';
import GenderStatistics from '../components/GenderStatistics';
import AppsOverTimeStatistics from '../components/AppsOverTimeStatistics';

import EventPageTab from './EventPageTab';

interface StatisticsTabProps {
  statistics: EventStatistics | null;
}

/**
 * This is the tab that shows the user statistics for an event. This tab currently has:
 * 
 * - Status Breakdown Piechart
 * - Gender Breakdown Piechart
 */
export default class StatisticsTab extends EventPageTab<StatisticsTabProps> {

  render() {
    const { event, statistics } = this.props;
    if (!statistics) {
      return <Loading />;
    }

    return (
      <div className="tab-page__contents">
        <div className="row">
          <div className="col-12">
            <AppsOverTimeStatistics event={event} statistics={statistics} />
          </div>
        </div>
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
