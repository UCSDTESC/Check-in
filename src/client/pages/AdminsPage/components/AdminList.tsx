import { Admin } from 'Shared/types';
import React from 'react';
import { Button } from 'reactstrap';

interface AdminListProps {
  admins: Admin[];
  onDeleteAdmin: (adminId: string) => void;
  editing: boolean;
}

interface DisplayColumnMap {
  [AdminPropertyName: string]: string;
}

interface AdminListState {
  columns: DisplayColumnMap;
}

export default class AdminList extends React.Component<AdminListProps, AdminListState> {
  state: Readonly<AdminListState> = {
    columns: {
      username: 'Username',
      role: 'Role',
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
              {Object.keys(columns).map(column => (
                <td key={column} className="admin-list__value">
                  {/*
                  // TODO: Fix accessing dynamic properties
                  // @ts-ignore */}
                  {admin[column]}
                </td>)
              )}
            </tr>)
          )}
        </tbody>
      </table>
    );
  }
}
