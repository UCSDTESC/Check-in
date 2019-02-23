import PropTypes from 'prop-types';
import React from 'react';
import {VictoryPie, VictoryTooltip} from 'victory';

export default class GenderStatistics extends React.Component {

  static propTypes = {
    event: PropTypes.object.isRequired,
    statistics: PropTypes.object,
  };

  renderStats(statistics) {
    return [
      <dt key="genderTag" className="col-12">Gender Distribution</dt>,
      ...Object.keys(statistics.genders).map(gender =>
        ([
          <dt key={gender + 'Tag'} className="col-5 offset-1">
            {gender}
          </dt>,
          <dd key={gender + 'Value'} className="col-5">
            {statistics.genders[gender]}
          </dd>
        ])
      )
    ];
  }

  render() {
    let {event, statistics} = this.props;

    // Create the data array needed to make the pie chart
    var genderData = [];
    var totalNum = 0;
    for (const [key, value] of Object.entries(statistics.genders)) {
      genderData.push({gender: key, number: value});
      totalNum += value;
    }

    return (
      <div className="event-statistics event-page__card">
        <h2>Gender Breakdown</h2>
        <dl className="row">

          <VictoryPie
            colorScale={['#8E44AD', '#43D2F0', '#AEF9D6', '#EF767A', '#7D7ABC']}
            labelComponent={<VictoryTooltip />}
            labelRadius={130}
            labels={p => `${p.gender}: ${p.number} | ${(p.number / totalNum * 100).toFixed(2)}%`}
            data={genderData}
            x="gender"
            y="number"
        />
          {Object.keys(statistics).length !== 0 && this.renderStats(statistics)}
        </dl>
      </div>
    );
  }
}
