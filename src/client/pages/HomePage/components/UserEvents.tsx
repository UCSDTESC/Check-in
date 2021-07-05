import { TESCEvent } from '@Shared/ModelTypes';
import React from 'react';
import { Link } from 'react-router-dom';

interface UserEventsProps {

  // The events that the user has applied to
  events: TESCEvent[];
}

/**
 * This component shows all existing applications for the user.
 */
export default class UserEvents extends React.Component<UserEventsProps> {
  render() {
    const { events } = this.props;

    return (
      <div className="about">
        <div className="container">
          <div className="row">

            <div className="col-md-12 text center">
              <h1>Your Events</h1>
            </div>

            {events.map(event => (
              <div key={event._id} className="col-12">
                <Link to={`/user/${event.alias}`}>
                  <div className="card mb-4 box-shadow container event-card event-card--mini">
                    <div className="row">
                      <div className="col-4">
                        <img src={event.logo.url} className="card-img-top" />
                      </div>
                      <div className="col-8 d-flex align-items-center">
                        <h4 className="mb-0">{event.name}</h4>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
