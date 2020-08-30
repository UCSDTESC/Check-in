import { Admin } from '@Shared/ModelTypes';
import moment from 'moment';
import React from 'react';
import { Button } from 'reactstrap';

interface AdminListProps {

  // The admins in the system
  admins: Admin[];

  // Function to be called when the delete button is pressed
  onDeleteAdmin: (adminId: string) => void;

  // Is the admin in editing mode
  // TODO: remove - legacy feature
  editing: boolean;
}

interface DisplayColumnMap {
  username: string;
  role: string;
  lastAccessed: string;
}

interface AdminListState {
  columns: DisplayColumnMap;
}

/**
 * This component renders a list of admins on the admins page
 */
export default class AdminList extends React.Component<AdminListProps, AdminListState> {
  state: Readonly<AdminListState> = {
    columns: {
      username: 'Username',
      role: 'Role',
      lastAccessed: 'Last Accessed',
    },
  };

  /**
   * Creates a header by the given name.
   * @param {String} name The name of the column to display.
   * @returns {Component} The header component to render.
   */
  renderHeader = (name: string) => (
    <th key={name} className="admin-list__header">
      {name}
    </th>
  );

  /**
   * Creates the rows for the admin entry
   * @returns {Component} The row to be rendered
   */
  renderAdmin = (admin: Admin) => {
    const {columns} = this.state;

    const adminToBeRendered = {...admin,
                               lastAccessed: admin.lastAccessed
        ? moment(admin.lastAccessed).fromNow()
        : 'Never Logged In',
    };
    return Object.keys(columns).map(column => (
      <td key={column} className="admin-list__value">
        {/*
        // TODO: Fix accessing dynamic properties
        // @ts-ignore */}
        {adminToBeRendered[column]}
      </td>)
    );
  }

  render() {
    const {columns} = this.state;
    const {admins, onDeleteAdmin, editing} = this.props;

    return (
      <table className="admin-list table">
        <thead>
          <tr className="admin-list__row">
            <th className="admin-list__header admin-list__header--small"/>

            {Object.values(columns).map(name => this.renderHeader(name))}
          </tr>
        </thead>

        <tbody>
          {admins && admins.map(admin =>
            (<tr key={admin.username} className="admin-list__row">
              <td className="admin-list__value admin-list__value--small">
                {editing && <Button
                  color="danger"
                  outline={true}
                  onClick={() => onDeleteAdmin(admin._id)}
                >
                  <i className="fa fa-ban"/>
                </Button>}
              </td>
              {this.renderAdmin(admin)}
            </tr>)
          )}
        </tbody>
      </table>
    );
  }
}
