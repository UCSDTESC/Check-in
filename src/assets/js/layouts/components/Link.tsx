import React, { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

interface LinkProps {
  dest: string;
  exact?: boolean;
  children: ReactNode;
}

export default class Link extends React.Component<LinkProps> {
  render() {
    const {children, dest, exact} = this.props;

    return (
      <NavLink
        className="admin-sidebar__section-link"
        to={`/admin${dest}`}
        activeClassName="admin-sidebar__section-link--active"
        exact={exact}
      >
        {children}
      </NavLink>
    );
  }
}
