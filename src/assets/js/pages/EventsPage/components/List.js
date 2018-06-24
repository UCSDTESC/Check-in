import PropTypes from 'prop-types';
import React from 'react';
import {Link} from 'react-router-dom';

import {Event as EventPropTypes} from '~/proptypes';

export default class List extends React.Component {
  static propTypes = {
    events: PropTypes.arrayOf(PropTypes.shape(
      EventPropTypes
    ).isRequired).isRequired,
  };

  render() {
    let {events} = this.props;

    return (
      <div className="event-list">
        <h2>Your Events</h2>
        <div className="row">
          {events.map((event) => (
            <div className="col-lg-2 col-md-6" key={event._id}>
              <div className="card">
                <img className="card__image card-img-top event-list__image"
                  src={event.logo} alt={event.name} />
                <div className="card-body">
                  <h2 className="card-text text-center">
                    {event.name}{' '}
                  </h2>
                  <Link to={'/user/' + event.alias}>
                    View Application
                  </Link>
                </div>
              </div>
            </div>)
          )}
        </div>
      </div>
    );
  }
}
