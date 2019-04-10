import React from 'react';
import ReactTable from 'react-table';

// tslint:disable-next-line
const styles = require('react-table/react-table.css');

import User from '~/components/User';
import { TESCUser, Column, TESCEvent } from '~/static/types';

interface UserListProps {
  users: TESCUser[];
  columns: Column[];
  event: TESCEvent;
  onUserUpdate: (newUser: any) => void;
}

class UserList extends React.Component<UserListProps> {
  expandComponent = (row: TESCUser) => (
    <div className="user-list__child">
      <User
        user={row}
        event={this.props.event}
        initialValues={row}
        onSubmit={this.props.onUserUpdate}
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
        SubComponent={({original}) => this.expandComponent(original)}
        filterable={true}
        defaultFilterMethod={(filter, row) =>
          String(row[filter.id]).indexOf(filter.value) !== -1}
      />
    );
  }
}

export default UserList;
