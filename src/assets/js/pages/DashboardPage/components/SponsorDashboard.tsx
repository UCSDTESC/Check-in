import React from 'react';

import EventList from './EventList';
import { TESCEvent } from '~/static/types';

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
