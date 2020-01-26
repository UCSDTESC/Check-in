import React from 'react';
import { VictoryChart, VictoryAxis, VictoryLine, VictoryTheme, VictoryVoronoiContainer, VictoryTooltip } from 'victory';

import EventStatisticsComponent from './EventStatisticsComponent';

export default class AppsOverTimeStatistics extends EventStatisticsComponent {
  render() {
    const { statistics } = this.props;

    // Create the data array needed to make the line chart
    const appsTimeData: Array<{ date: string; appCount: number }> = [];

    // Push stats query data to array of data points
    for (const [key, value] of Object.entries(statistics.appsOverTime)) {
      appsTimeData.push({
        date: key,
        appCount: value,
      });
    }

    return (
      <div className="event-statistics event-page__card">
        <h2>Applicants Over Time</h2>
        <div className="row">
          <div className="col-12">
            <VictoryChart
              theme={VictoryTheme.material}
              width={475}
              minDomain={{ y: 0 }}
              containerComponent={
                <VictoryVoronoiContainer
                  labels={data => data.appCount}
                  labelComponent={
                    <VictoryTooltip
                      cornerRadius={2}
                      pointerLength={2}
                      style={{ fontSize: 5 }}
                      flyoutStyle={{ strokeWidth: .5 }}
                    />
                  }
                />
              }
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
