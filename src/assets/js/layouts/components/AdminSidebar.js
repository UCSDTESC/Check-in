import React from 'react';
import PropTypes from 'prop-types';
import {NavbarToggler} from 'reactstrap';

import Link from './Link';
import Section from './Section';

import ToggleSwitch from '~/components/ToggleSwitch';

import {Roles, getRole} from '~/static/Roles';

class AdminSidebar extends React.Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    onEditChange: PropTypes.func.isRequired,
    isEditing: PropTypes.bool.isRequired,
    user: PropTypes.object,
    isHidden: PropTypes.bool,
    events: PropTypes.object.isRequired,
    children: PropTypes.node,
  };

  constructor(props) {
    super(props);

    this.state = {
      isHidden: this.props.isHidden ? this.props.isHidden : true
    };
  }

  /**
   * Toggles whether the menu is hidden on small devices
   */
  toggleHidden() {
    this.setState({
      isHidden: !this.state.isHidden
    });
  }

  developerTools = () =>
    (<Section name='Developer Tools'>
      <Link dest='/admins'>Admins</Link>
    </Section>);

  eventTools = (events, resumeLink) =>
    (<Section name='Your Events'>
      {Object.keys(events).map((eventAlias) => (
        <Link key={eventAlias} dest={resumeLink ? `/resumes/${eventAlias}` :
          `/events/${eventAlias}`}>
          {events[eventAlias].name}
        </Link>))}
    </Section>);

  /**
   * Creates the menu based off user role and authentication
   */
  renderMenu() {
    let {events} = this.props;
    let auth = this.props.isAuthenticated;

    let role = this.props.user ?
      getRole(this.props.user.role) :
      getRole(Roles.ROLE_MEMBER);

    let checkinAdmin = this.props.user ? !!this.props.user.checkin : false;

    if (checkinAdmin) {
      return (<div>
        {auth && <Section name='Check In'>
          {Object.values(this.props.events).map((event, i) => {
            let alias = Object.keys(this.props.events)[i];
            return (<Link key={alias}
              dest={`/checkin/${alias}`}>{event.name}</Link>);
          })}

          {auth && <Section name='General'>
            <Link dest='/logout'>Logout</Link>
          </Section>}
        </Section>}
      </div>);
    }

    return (<div>
      {auth && role >= getRole(Roles.ROLE_DEVELOPER) && this.developerTools()}

      {auth && role >= getRole(Roles.ROLE_SPONSOR) &&
        this.eventTools(events, role === getRole(Roles.ROLE_SPONSOR))}

      {auth && <Section name='General'>
        <Link dest='/' exact>Dashboard</Link>
        <Link dest='/logout'>Logout</Link>
      </Section>}
    </div>);
  }

  /**
   * Creates the user menu for the authenticated user
   */
  renderUser() {
    let {user, isEditing} = this.props;
    let auth = this.props.isAuthenticated;
    let role = this.props.user ?
      getRole(this.props.user.role) :
      getRole(Roles.ROLE_MEMBER);
    let checkinAdmin = this.props.user ? this.props.user.checkin : false;

    return (
      <div className="admin-sidebar__user-box admin-sidebar__dark">
        <div className="admin-sidebar__user-name text-uppercase">
          User: {user && user.username}
        </div>
        <div className="admin-sidebar__user-role">
          Your Role: {user && user.role}
        </div>
        {auth && !checkinAdmin && role >= getRole(Roles.ROLE_ADMIN) &&
        <div className="admin-sidebar__user-toggle">
          <ToggleSwitch onChange={this.props.onEditChange}
            checked={isEditing} />
          <div className="admin-sidebar__user-editing">
            Editing:&nbsp;
            <span className="text-uppercase">{isEditing ? 'ON' : 'OFF'}</span>
          </div>
        </div>}
      </div>
    );
  }

  render() {
    let auth = this.props.isAuthenticated;

    return (<div className="admin-sidebar">
      <div className={`admin-sidebar__header navbar-expand-md
        navbar-inverse`}>
        <img className="admin-sidebar__logo"
          src="/img/vectors/tesc-logo.svg"/>
        <span className="admin-sidebar__header-text">
          Admin Dashboard
        </span>
        <NavbarToggler right="true"
          className="admin-sidebar__toggler navbar-dark"
          onClick={this.toggleHidden.bind(this)} />
      </div>

      <div className={this.state.isHidden ? 'd-none d-md-block' : ''}>
        {auth && this.renderUser()}

        {this.renderMenu()}
      </div>

      {this.props.children &&
      <div className="admin-sidebar__children">
        {this.props.children}
      </div>}
    </div>);
  };
};



export default AdminSidebar;
