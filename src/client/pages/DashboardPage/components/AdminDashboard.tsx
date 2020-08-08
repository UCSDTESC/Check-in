import { Admin, TESCEvent } from '@Shared/ModelTypes';
import { Role, getRoleRank } from '@Shared/Roles';
import { JWTAdminAuthToken } from '@Shared/api/Responses';
import React from 'react';

import EventList from './EventList';

interface AdminDashboardProps {

  // events that the admin is permitted to see
  events: TESCEvent[];

  // The current user (aka admin) requesting the page
  user: JWTAdminAuthToken;
}

/**
 * This is the admin dashboard. It is primarily a wrapper around EventList for now.
 */
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
