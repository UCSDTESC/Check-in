import React from 'react';
import { VictoryChart, VictoryAxis, VictoryLine, VictoryTheme } from 'victory';

import EventStatisticsComponent from './EventStatisticsComponent';

export default class AppsOverTimeStatistics extends EventStatisticsComponent {
  render() {
    const { statistics } = this.props;

    // Create the data array needed to make the line chart
    const appsTimeData: Array<{ date: string; appCount: number }> = [];

    Object.keys(statistics.appsOverTime).forEach(key => {
      if (key !== 'null') {
        appsTimeData.push({
          date: key,
          appCount: statistics.appsOverTime[key],
        });
      }
    });

    return (
      <div className="event-statistics event-page__card">
        <h2>Applicants Over Time</h2>
        <div className="row">
          <div className="col-12">
            <VictoryChart
              theme={VictoryTheme.material}
              width={475}
              minDomain={{ y: 0 }}
            >
              <VictoryLine
                data={appsTimeData}
                x="date"
                y="appCount"
              />
              <VictoryAxis tickCount={6} />
              <VictoryAxis dependentAxis={true} />
            </VictoryChart>
          </div>
        </div>
      </div>
    );
  }
}
