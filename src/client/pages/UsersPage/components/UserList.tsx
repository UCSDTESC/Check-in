import { TESCUser, TESCEvent } from '@Shared/ModelTypes';
import React from 'react';
import ReactTable, { ReactTableDefaults } from 'react-table';
import User from '~/components/User';

import { AutofillColumn } from '..';
import { AlertType } from '../../AlertPage';

// tslint:disable-next-line
const styles = require('react-table/react-table.css');

interface UserListProps {

  //users that have applied to an event
  users: TESCUser[];
  columns: AutofillColumn[];
  event: TESCEvent;
  createAlert: (message: string, type: AlertType, title: string) => void;
  onUserUpdate: (newUser: TESCUser) => void;
}

/**
 * This renders the react-table for the users that have applied to an event
 */
class UserList extends React.Component<UserListProps> {

  /**
   * Render the User component, used by react-table's SubComponent
   * 
   * @param {TESCUser} row the user to be rendered
   * @returns {JSXElement}
   */
  expandComponent = (row: TESCUser) => (
    <div className="user-list__child">
      <User
        user={row}
        event={this.props.event}
        initialValues={row}
        form={row._id}
        onSubmit={this.props.onUserUpdate}
        createAlert={this.props.createAlert}
      />
    </div>
  );

  render() {
    return (
      <ReactTable
        data={this.props.users}
        column={{
          ...ReactTableDefaults.column,
          Cell: ({value}) => value ? String(value): value
        }}
        columns={this.props.columns}
        defaultPageSize={10}
        className="-striped -highlight user-list"
        SubComponent={({ original }) => this.expandComponent(original)}
        filterable={true}
        defaultFilterMethod={(filter, row) =>
          String(row[filter.id]).toLowerCase().indexOf(filter.value.toLowerCase()) !== -1}
      />
    );
  }
}

export default UserList;
