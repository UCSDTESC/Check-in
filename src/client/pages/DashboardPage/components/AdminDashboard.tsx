import { Role, getRole } from '@Shared/Roles';
import { Admin, TESCEvent } from '@Shared/Types';
import React from 'react';
import { JWTAuthAdmin } from '~/data/AdminAuth';

import EventList from './EventList';

interface AdminDashboardProps {
  events: TESCEvent[];
  user: JWTAuthAdmin;
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
