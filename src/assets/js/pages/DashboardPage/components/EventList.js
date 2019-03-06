import PropTypes from 'prop-types';
import React from 'react';
import {Link} from 'react-router-dom';
import FA from 'react-fontawesome';

import {Event as EventPropTypes} from '~/proptypes';

import EventCard from '~/components/EventCard';

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
    const highlightEvent = (o) => (o !== 'TESC');

    return (
      <div className="event-list">
        <h2>Your Events</h2>
        <div className="row">
          {events
          .sort((a, b) => a.name.toUpperCase() < b.name.toUpperCase() ? -1 : 1)
          .map((event) => (
            <div className="col-xl-3 col-lg-4 col-md-6 mb-3" key={event._id}>
              <EventCard to={`/admin/${resumeLink ? 'resumes' :
                  'events'}/${event.alias}`}
                highlighted={highlightEvent(event.organisedBy)}
                header={`Organised By ${event.organisedBy}`}
                image={event.logo.url}
                title={event.name}
                subtext={`${event.users} Registered ${event.users === 1 ?
                  'User' : 'Users'}`}
                className="h-100"
                />
            </div>)
          )}
          {canCreate && <div className="col-xl-3 col-lg-4 col-md-6 mb-3">
            <Link to="/admin/new" className={`card h-100 d-flex
            align-items-center justify-content-center dashboard-page__plus`}>
              <div><FA name="plus" /></div>
              <div className="dashboard-page__plus-sm">
                  Create Event
              </div>
            </Link>
          </div>}
        </div>
      </div>
    );
  }
}
