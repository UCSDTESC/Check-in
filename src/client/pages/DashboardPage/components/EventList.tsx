import { TESCEvent } from '@Shared/ModelTypes';
import React from 'react';
import FA from 'react-fontawesome';
import { Link } from 'react-router-dom';
import EventCard from '~/components/EventCard';

interface EventListProps {

  //events to be rendered in the list
  events: TESCEvent[];
  
  //track if we need a direct link to the resume page
  resumeLink?: boolean;

  //can this user create an event?
  canCreate?: boolean;
}

export default class EventList extends React.Component<EventListProps> {
  render() {
    const { events, resumeLink, canCreate } = this.props;
    const highlightEvent = (o: string) => (o !== 'TESC');

    return (
      <div className="event-list">
        <h2>Your Events</h2>
        <div className="row">
          {events
            .sort((a, b) => a.name.toUpperCase() < b.name.toUpperCase() ? -1 : 1)
            .map((event) => (
              <div className="col-xl-3 col-lg-4 col-md-6 mb-3" key={event._id}>
                <EventCard
                  to={`/admin/${resumeLink ? 'resumes' : 'events'}/${event.alias}`}
                  highlighted={highlightEvent(event.organisedBy)}
                  header={`Organized By ${event.organisedBy}`}
                  image={event.logo.url}
                  title={event.name}
                  subtext={<>
                    {event.users} Registered User{event.users === 1 ? '' : 's'}
                  </>}
                  className="h-100"
                />
              </div>)
            )}
          {canCreate && <div className="col-xl-3 col-lg-4 col-md-6 mb-3">
            <Link
              to="/admin/new"
              className="card h-100 d-flex align-items-center justify-content-center dashboard-page__plus"
            >
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
