import { Role, getRole } from '@Shared/Roles';
import { Admin } from '@Shared/Types';
import React from 'react';
import { NavbarToggler } from 'reactstrap';
import ToggleSwitch from '~/components/ToggleSwitch';
import { JWTAuthAdmin } from '~/data/AdminAuth';
import { EventsState } from '~/reducers/Admin/types';

import Link from './Link';
import Section from './Section';

interface AdminSidebarProps {
  isAuthenticated: boolean;
  user?: JWTAuthAdmin;
  isHidden?: boolean;
  events: EventsState;
  children: JSX.Element;
}

interface AdminSidebarState {
  isHidden: boolean;
}

export default class AdminSidebar extends React.Component<AdminSidebarProps, AdminSidebarState> {
  state: Readonly<AdminSidebarState> = {
    isHidden: this.props.isHidden ? this.props.isHidden : true,
  };

  /**
   * Toggles whether the menu is hidden on small devices
   */
  toggleHidden = () => {
    this.setState({
      isHidden: !this.state.isHidden,
    });
  }

  developerTools = () =>
    (
      <Section name="Developer Tools">
        <Link dest="/admins">Admins</Link>
      </Section>
    );

  eventTools = (events: EventsState, resumeLink: boolean) =>
    (
      <Section name="Your Events">
        {Object.keys(events)
        .sort()
        .map((eventAlias) => (
          <Link
            key={eventAlias}
            dest={resumeLink ? `/resumes/${eventAlias}` : `/events/${eventAlias}`}
          >
            {events[eventAlias].name}
          </Link>))}
      </Section>
    );

  /**
   * Creates the menu based off user role and authentication
   */
  renderMenu() {
    const {events} = this.props;
    const auth = this.props.isAuthenticated;

    const role = this.props.user ?
      getRole(this.props.user.role) :
      getRole(Role.ROLE_MEMBER);

    const checkinAdmin = this.props.user ? !!this.props.user.checkin : false;

    if (checkinAdmin) {
      return (
        <div>
          {auth && <Section name="Check In">
            {Object.keys(this.props.events)
            .sort()
            .map(alias => {
              const event = this.props.events[alias];
              return (<Link
                key={alias}
                dest={`/checkin/${alias}`}
              >
                {event.name}
              </Link>);
            })}

            {auth && <Section name="General">
              <Link dest="/logout">Logout</Link>
            </Section>}
          </Section>}
        </div>
      );
    }

    return (
      <div>
        {auth && role >= getRole(Role.ROLE_DEVELOPER) && this.developerTools()}

        {auth && role >= getRole(Role.ROLE_SPONSOR) &&
          this.eventTools(events, role === getRole(Role.ROLE_SPONSOR))}

        {auth && <Section name="General">
          <Link dest="/" exact={true}>Dashboard</Link>
          <Link dest="/logout">Logout</Link>
        </Section>}
      </div>
    );
  }

  /**
   * Creates the user menu for the authenticated user
   */
  renderUser() {
    const {user} = this.props;
    const auth = this.props.isAuthenticated;
    const role = this.props.user ?
      getRole(this.props.user.role) :
      getRole(Role.ROLE_MEMBER);
    const checkinAdmin = this.props.user ? this.props.user.checkin : false;

    return (
      <div className="admin-sidebar__user-box admin-sidebar__dark">
        <div className="admin-sidebar__user-name text-uppercase">
          User: {user && user.username}
        </div>
        <div className="admin-sidebar__user-role">
          Your Role: {user && user.role}
        </div>
      </div>
    );
  }

  render() {
    const auth = this.props.isAuthenticated;

    return (
      <div className="admin-sidebar">
        <div className="admin-sidebar__header navbar-expand-md navbar-inverse">
          <img
            className="admin-sidebar__logo"
            src="/img/vectors/tesc-logo.svg"
          />
          <span className="admin-sidebar__header-text">
            Admin Dashboard
          </span>
          <NavbarToggler
            right="true"
            className="admin-sidebar__toggler navbar-dark"
            onClick={this.toggleHidden}
          />
        </div>

        <div className={this.state.isHidden ? 'd-none d-md-block' : ''}>
          {auth && this.renderUser()}

          {this.renderMenu()}
        </div>

        {this.props.children &&
        <div className="admin-sidebar__children">
          {this.props.children}
        </div>}
      </div>
    );
  }
}
