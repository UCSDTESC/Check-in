import PropTypes from 'prop-types';
import React from 'react';

import {
  Event as EventPropTypes,
  User as UserPropTypes
} from '~/proptypes';

import {Roles, getRole} from '~/static/Roles';

import EventList from './EventList';

export default class AdminDashboard extends React.Component {
  static propTypes = {
    events: PropTypes.arrayOf(PropTypes.shape(
      EventPropTypes
    ).isRequired).isRequired,
    user: PropTypes.shape(
      UserPropTypes
    ).isRequired
  };

  render() {
    let {events, user} = this.props;
    return (
      <EventList events={events} canCreate={getRole(user.role) >=
        getRole(Roles.ROLE_ADMIN)} />
    );
  }
}
