import { TESCUser, TESCEvent } from '@Shared/ModelTypes';
import React from 'react';
import ReactTable from 'react-table';
import User from '~/components/User';

import { AutofillColumn } from '..';

import AlertPage, { AlertPageState, PageAlert, AlertType } from '../../AlertPage';

// tslint:disable-next-line
const styles = require('react-table/react-table.css');

interface UserListProps {
  users: TESCUser[];
  columns: AutofillColumn[];
  event: TESCEvent;
  createAlert: (message: string, type: AlertType, title: string) => void;
  onUserUpdate: (newUser: TESCUser) => void;
}

class UserList extends React.Component<UserListProps> {
  expandComponent = (row: TESCUser) => (
    <div className="user-list__child">
      <User
        user={row}
        event={this.props.event}
        initialValues={row}
        onSubmit={this.props.onUserUpdate}
        createAlert={this.props.createAlert}
      />
    </div>
  );

  render() {
    return (
      <ReactTable
        data={this.props.users}
        columns={this.props.columns}
        defaultPageSize={10}
        className="-striped -highlight user-list"
        SubComponent={({ original }) => this.expandComponent(original)}
        filterable={true}
        defaultFilterMethod={(filter, row) =>
          String(row[filter.id]).indexOf(filter.value) !== -1}
      />
    );
  }
}

export default UserList;
