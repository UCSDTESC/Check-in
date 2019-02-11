import PropTypes from 'prop-types';
import React from 'react';

import ReactDOM from 'react-dom';
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
      ),
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

    return (
      <div className="event-statistics event-page__card">
        <h2>Applicant Demographics</h2>
        <div className="row">
          <h5>Gender Statistics</h5>
          <VictoryPie
            colorScale={["#8E44AD", "#43D2F0", "#AEF9D6", "#EF767A", "#7D7ABC" ]}
            labelComponent={<VictoryTooltip />}
            labelRadius={130}
            labels={p => `${p.gender}: ${p.number}`} 
            data={[
              { gender: 'Male', number: statistics.genders['Male'] },
              { gender: 'Female', number: statistics.genders['Female'] },
              { gender: 'Non-Binary', number: statistics.genders['Non-Binary'] },
              { gender: 'I prefer not to say', number: statistics.genders['I prefer not to say'] },
              { gender: 'Other', number: statistics.genders['Other'] }
            ]}
            x="gender"
            y="number"
          />
        </div>
        <dl className="row">
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