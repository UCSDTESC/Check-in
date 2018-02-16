import PropTypes from 'prop-types';
import React from 'react';
import {Link} from 'react-router-dom';

export default class EventList extends React.Component {
  static propTypes = {
    event: PropTypes.object.isRequired,
    statistics: PropTypes.object
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
      )
    ];
  }

  render() {
    let {event, statistics} = this.props;

    return (
      <div className="event-statistics">
        <h2>Statistics</h2>
        <dl className="row">
          <dt className="col-6">Total Users</dt>
          <dd className="col-6">
            {event.users}
          </dd>

          {Object.keys(statistics).length !== 0 && this.renderStats(statistics)}
        </dl>
        <Link to={`/admin/users/${event.alias}`}>View All Users</Link>
      </div>
    );
  }
}
