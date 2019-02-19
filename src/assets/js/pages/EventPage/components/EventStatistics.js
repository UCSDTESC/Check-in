import PropTypes from 'prop-types';
import React from 'react';

import {VictoryPie, VictoryTooltip} from 'victory';

export default class EventStatistics extends React.Component {

  static propTypes = {
    event: PropTypes.object.isRequired,
    statistics: PropTypes.object,
  };

  renderStats(statistics) {
    return [
      <dt key="universityTag" className="col-6">Unique Universities</dt>,
      <dd key="universityValue" className="col-6">
        {statistics.universities}
      </dd>,
      <dt key="statusTag" className="col-12">Status Breakdown</dt>,
      ...Object.keys(statistics.status).map(key =>
        ([
          <dt key={key + 'Tag'} className="col-5 offset-1">
            {(key === 'null') ? 'No Status' : key}
          </dt>,
          <dd key={key + 'Value'} className="col-5">
            {statistics.status[key]}
          </dd>
        ])
      )
    ];
  }

  render() {
    let {event, statistics} = this.props;

    // Create the data array needed to make the pie chart
    var statusData = []
    var totalNum = 0;
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
        <dl className="row">

          <VictoryPie
            colorScale={["#8E44AD", "#43D2F0", "#AEF9D6", "#EF767A", "#7D7ABC" ]}
            labelComponent={<VictoryTooltip />}
            labelRadius={130}
            labels={p => `${p.status}: ${p.number} | ${(p.number / totalNum * 100).toFixed(2)}%`} 
            data={statusData}
            x="status"
            y="number"
          />
          <dt className="col-6">Total Applicants</dt>
          <dd className="col-6">
            {event.users}
          </dd>
          {Object.keys(statistics).length !== 0 && this.renderStats(statistics)}

        </dl>
      </div>
    );
  }
}