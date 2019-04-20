import { Role, getRole } from 'Shared/Roles';
import { Admin, TESCEvent } from 'Shared/types';
import React from 'react';

import EventList from './EventList';

interface AdminDashboardProps {
  events: TESCEvent[];
  user: Admin;
}

export default class AdminDashboard extends React.Component<AdminDashboardProps> {

  render() {
    const {events, user} = this.props;
    return (
      <EventList
        events={events}
        canCreate={getRole(user.role) >= getRole(Role.ROLE_ADMIN)}
      />
    );
  }
}
