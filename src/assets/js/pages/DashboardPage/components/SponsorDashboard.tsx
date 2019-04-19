import React from 'react';
import { TESCEvent } from '~/static/types';

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
