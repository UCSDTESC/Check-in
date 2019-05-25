import { EventStatistics } from '@Shared/api/Responses';
import React from 'react';
import { VictoryPie, VictoryTooltip, VictoryTheme } from 'victory';

import EventStatisticsComponent from './EventStatisticsComponent';

const PIE_CHART_COLOURS =
  ['#8E44AD', '#43D2F0', '#AEF9D6', '#EF767A', '#7D7ABC'];

/**
 * This component renders a statistics pie chart for the gender breakdown of an event
 */
export default class GenderStatistics extends EventStatisticsComponent {

  /**
   * Render the gender breakdown in text form 
   * 
   * @param {EventStatistics} statistics The statistics of the event
   */
  renderStats(statistics: EventStatistics) {
    return [
      <dt key="genderTag" className="col-12">Gender Distribution</dt>,
      ...Object.keys(statistics.genders).map(gender =>
        ([
          (
          <dt key={gender + 'Tag'} className="col-5 offset-1">
            {gender}
          </dt>
          ),
          (
          <dd key={gender + 'Value'} className="col-5">
            {statistics.genders[gender]}
          </dd>
          ),
        ])
      ),
    ];
  }

  render() {
    const {statistics} = this.props;

    // Create the data array needed to make the pie chart
    const genderData = [];
    let totalNum = 0;
    for (const [key, value] of Object.entries(statistics.genders)) {
      genderData.push({gender: key, number: value});
      totalNum += value;
    }

    return (
      <div className="event-statistics event-page__card">
        <h2>Gender Breakdown</h2>
        <dl className="row">
          <div className="col-12 event-page__pie">

            <VictoryPie
              colorScale={PIE_CHART_COLOURS}
              labelComponent={<VictoryTooltip />}
              labelRadius={130}
              innerRadius={100}
              padAngle={3}
              labels={p => `${p.gender}: ${p.number} | ${(p.number /
                totalNum * 100).toFixed(2)}%`}
              data={genderData}
              x="gender"
              y="number"
              theme={VictoryTheme.material}
            />
          </div>
          {Object.keys(statistics).length !== 0 && this.renderStats(statistics)}
        </dl>
      </div>
    );
  }
}
