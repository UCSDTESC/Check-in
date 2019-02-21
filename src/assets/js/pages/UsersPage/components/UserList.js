import PropTypes from 'prop-types';
import React from 'react';
import ReactTable from 'react-table';

import 'react-table/react-table.css';

import {Column as ColumnPropTypes, User as UserPropTypes} from '~/proptypes';

import User from '~/components/User';

class UserList extends React.Component {
  static propTypes = {
    users: PropTypes.arrayOf(PropTypes.shape(
      UserPropTypes
    ).isRequired).isRequired,
    columns: PropTypes.arrayOf(PropTypes.shape(
      ColumnPropTypes
    ).isRequired).isRequired,
    onUserUpdate: PropTypes.func.isRequired
  };

  renderPaginationPanel = (props) =>
    (<div className="col">
      <div>
        <span>{props.components.totalText}</span>
        {props.components.pageList}
      </div>
    </div>
    );

  expandComponent = (row) => (
    <div className="user-list__child">
      <User user={row} initialValues={row}
        onSubmit={this.props.onUserUpdate.bind(this)} />
    </div>);

  render() {
    console.log(this.props.users);
    return (
      <ReactTable
        data={this.props.users}
        columns={this.props.columns}
        defaultPageSize={10}
        className="-striped -highlight user-list"
        SubComponent={({original}) => this.expandComponent(original)}
        filterable
        defaultFilterMethod={(filter, row) =>
          String(row[filter.id]).indexOf(filter.value) !== -1}>
      </ReactTable>
    );
  }
}

export default UserList;

