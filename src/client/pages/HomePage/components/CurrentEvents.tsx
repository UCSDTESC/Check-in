import { TESCEvent } from 'Shared/types';
import React from 'react';
import EventCard from '~/components/EventCard';

interface CurrentEventProps {
  events: TESCEvent[];
}

export default class CurrentEvents extends React.Component<CurrentEventProps> {
  render() {
    const {events} = this.props;
    const highlightEvent = (o: string) => (o !== 'TESC');

    return (
    <div className="about">
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
              <EventCard
                to={`/register/${event.alias}`}
                highlighted={highlightEvent(event.organisedBy)}
                header={`Organized By ${event.organisedBy}`}
                image={event.logo.url}
                title={event.name}
                subtext={`Registration Closes ${new Date(event.closeTime)
                  .toLocaleDateString()}`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
    );
  }
}
