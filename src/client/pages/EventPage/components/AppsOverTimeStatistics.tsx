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

    // Lastest applicants vs time data
    const latest = appsTimeData[appsTimeData.length - 1];

    const axisStyles = {
      tickLabels: { fontSize: 5, padding: 5 },
      ticks: { size: 2 },
      grid: { opacity: 0 },
      axisLabel: { fontSize: 8, padding: 20 },
    };

    return (
      <div className="event-statistics event-page__card">
        <h2>Applicants Over Time</h2>
        <div className="row">
          <div className="col-12">
            <VictoryChart
              theme={VictoryTheme.material}
              minDomain={{ y: 0 }}
              maxDomain={{ y: latest.appCount + 3, x: appsTimeData.length + 1 }}
              height={150}
              padding={{ top: 10, bottom: 45, left: 35, right: 35 }}
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
                animate={{
                  duration: 1000,
                  easing: "cubic"
                }}
                style={{
                  data: {
                    strokeWidth: 2,
                    strokeLinecap: "round"
                  },
                }}
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
