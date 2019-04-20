import { EventStatistics } from '@Shared/Types';
import React from 'react';
import { VictoryPie, VictoryTooltip, VictoryTheme } from 'victory';

import EventStatisticsComponent from './EventStatisticsComponent';

const PIE_CHART_COLOURS =
  ['#8E44AD', '#43D2F0', '#AEF9D6', '#EF767A', '#7D7ABC'];

export default class EventStatisticsCharts extends EventStatisticsComponent {
  renderStats(statistics: EventStatistics) {
    return [
      <dt key="universityTag" className="col-6">Unique Universities</dt>,
      (
      <dd key="universityValue" className="col-6">
        {statistics.universities}
      </dd>
      ),
      <dt key="statusTag" className="col-12">Status Breakdown</dt>,
      ...Object.keys(statistics.status).map(key =>
        ([
          (
          <dt key={key + 'Tag'} className="col-5 offset-1">
            {(key === 'null') ? 'No Status' : key}
          </dt>
          ),
          (
          <dd key={key + 'Value'} className="col-5">
            {statistics.status[key]}
          </dd>
          ),
        ])
      ),
    ];
  }

  render() {
    const {event, statistics} = this.props;

    // Create the data array needed to make the pie chart
    const statusData = [];
    let totalNum = 0;
    for (const [key, value] of Object.entries(statistics.status)) {
      if (key === 'null') {
        statusData.push({status: 'No Status', number: value});
      } else {
        statusData.push({status: key, number: value});
      }
      totalNum += value;
    }

    return (
      <div className="event-statistics event-page__card">
        <h2>Status Breakdown</h2>
        <div className="row">
          <div className="col-12 event-page__pie">
            <VictoryPie
              colorScale={PIE_CHART_COLOURS}
              labelComponent={<VictoryTooltip />}
              labelRadius={130}
              innerRadius={100}
              padAngle={3}
              labels={p => `${p.status}: ${p.number} | ${(p.number /
                totalNum * 100).toFixed(2)}%`}
              data={statusData}
              x="status"
              y="number"
              theme={VictoryTheme.material}
            />
          </div>
          <dt className="col-6">Total Applicants</dt>
          <dd className="col-6">
            {event.users}
          </dd>
          {Object.keys(statistics).length !== 0 && this.renderStats(statistics)}
        </div>
      </div>
    );
  }
}
