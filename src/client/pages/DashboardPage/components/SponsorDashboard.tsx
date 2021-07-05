import { TESCEvent } from '@Shared/ModelTypes';
import React from 'react';

import EventList from './EventList';

interface SponsorDashboardProps {

  // Events that this sponsor is allowed to see
  events: TESCEvent[];
}

/**
 * This is the sponsor's event list. It uses EventList's resumeLink prop to
 * enforce a link to the sponsor portal on clicking the card.
 */
export default class SponsorDashboard extends React.Component<SponsorDashboardProps> {
  render() {
    const {events} = this.props;

    return (
      <EventList events={events} resumeLink={true} />
    );
  }
}
