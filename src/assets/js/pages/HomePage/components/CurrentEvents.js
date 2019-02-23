import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

export default class CurrentEvents extends React.Component {
  static propTypes = {
    events: PropTypes.array.isRequired
  };

  render() {
    let {events} = this.props;
    const eventHeaderClass = (o) => (o !== 'TESC')
      ? 'event-card__header event-card__header--third-party'
      : 'event-card__header';
    return (<div className="about">
      <div className="container">
        <div className="row row-eq-height">

          <div className="col-md-12 text center">
            <h1>Current Events</h1>
          </div>

          {events.length === 0 && <div className="col-md-12">
            <h3>No New Upcoming Events</h3>
          </div>}

          {events.length !== 0 && events.map(event => (
            <div key={event._id} className="col-md-4">
              <Link to={`/register/${event.alias}`}>
                <div className="card mb-4 box-shadow event-card">
                  <div className={`card-header ${eventHeaderClass(event.organisedBy)}`}>
                    Organised By {event.organisedBy}
                  </div>
                  <img src={event.logo.url} className="card-img-top bg-white" />
                  <div className="card-body">
                    <h5 className="card-title">
                      {event.name}
                    </h5>
                    <p className="card-text">
                      Registration Closes{' '}
                      {new Date(event.closeTime).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>);
  }
};
