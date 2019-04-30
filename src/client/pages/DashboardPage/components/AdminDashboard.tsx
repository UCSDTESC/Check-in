import { Admin, TESCEvent } from '@Shared/ModelTypes';
import { Role, getRoleRank } from '@Shared/Roles';
import { JWTAdminAuthToken } from '@Shared/api/Responses';
import React from 'react';

import EventList from './EventList';

interface AdminDashboardProps {
  events: TESCEvent[];
  user: JWTAdminAuthToken;
}

export default class AdminDashboard extends React.Component<AdminDashboardProps> {

  render() {
    const {events, user} = this.props;
    return (
      <EventList
        events={events}
        canCreate={getRoleRank(user.role) >= getRoleRank(Role.ROLE_ADMIN)}
      />
    );
  }
}
