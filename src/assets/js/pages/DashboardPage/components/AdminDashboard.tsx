import React from 'react';

import {Role, getRole} from '~/static/Roles';

import EventList from './EventList';
import { Admin, TESCEvent } from '~/static/types';

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