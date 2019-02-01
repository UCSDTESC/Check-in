import PropTypes from 'prop-types';
import React from 'react';
import {Link} from 'react-router-dom';
import FA from 'react-fontawesome';

import {Event as EventPropTypes} from '~/proptypes';

export default class EventList extends React.Component {
  static propTypes = {
    events: PropTypes.arrayOf(PropTypes.shape(
      EventPropTypes
    ).isRequired).isRequired,
    resumeLink: PropTypes.bool,
    canCreate: PropTypes.bool
  };

  render() {
    let {events, resumeLink, canCreate} = this.props;

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
                  <h5 className="card-title">
                    <Link to={`/admin/${resumeLink ? 'resumes' :
                      'events'}/${event.alias}`}>
                      {event.name}
                    </Link>
                  </h5>
                  <p className="card-text">
                    {event.users}{' '}
                    Registered {event.users === 1 ? 'User' : 'Users'}
                  </p>
                </div>
              </div>
            </div>)
          )}
        </div>
      </div>
    );
  }
}
