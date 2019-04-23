import { TESCEvent } from '@Shared/Types';
import React from 'react';

import EventList from './EventList';

interface SponsorDashboardProps {
  events: TESCEvent[];
}

export default class SponsorDashboard extends React.Component<SponsorDashboardProps> {
  render() {
    const {events} = this.props;

    return (
      <EventList events={events} resumeLink={true} />
    );
  }
}