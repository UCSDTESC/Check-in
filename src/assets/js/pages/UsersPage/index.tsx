import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Link, RouteComponentProps} from 'react-router-dom';
import {showLoading, hideLoading} from 'react-redux-loading-bar';

import {loadAllAdminEvents, ApplicationDispatch} from '~/actions';

import {addColumn, updateUser, removeColumn, addAvailableColumns} from './actions';

import {loadAllUsers, loadColumns} from '~/data/Api';

import Loading from '~/components/Loading';

import ColumnEditor from './components/ColumnEditor';
import UserList from './components/UserList';
import { ApplicationState } from '~/reducers';
import { Column, TESCEvent, TESCUser } from '~/static/types';

interface StateProps {
  availableColumns: Column[];
  activeColumns: Column[];
  loadedAvailableColumns: boolean;
  event: TESCEvent;
}

interface DispatchProps {
  showLoading: () => void;
  hideLoading: () => void;
  updateUser: (...args: any) => Promise<any>;
  addColumn: (...args: any) => Promise<any>;
  removeColumn: (...args: any) => Promise<any>;
  addAvailableColumns: (...args: any) => Promise<any>;
  loadAllAdminEvents: (...args: any) => Promise<any>;
}

interface UsersPageProps {
}

type Props = RouteComponentProps<{
  eventAlias: string;
}> & StateProps & DispatchProps & UsersPageProps;

interface UsersPageState {
  users: TESCUser[];
}

class UsersPage extends React.Component<Props, UsersPageState> {
  state: Readonly<UsersPageState> = {
    users: [],
  };

  componentDidMount() {
    const {event, loadedAvailableColumns} = this.props;

    if (!event) {
      showLoading();

      this.props.loadAllAdminEvents()
        .catch(console.error)
        .finally(hideLoading);
    }

    if (!this.state.users.length) {
      this.loadUsers();
    }

    if (!loadedAvailableColumns) {
      this.loadAvailableColumns();
    }
  }

  /**
   * Loads the column definitions from the server.
   */
  loadAvailableColumns() {
    loadColumns()
      .then(columns => {
        const newColumns = Object.entries(columns)
          .reduce((acc, [key, value]) => {
            acc.push({
              Header: value,
              accessor: key,
            });
            return acc;
          }, []);
        this.props.addAvailableColumns(newColumns);
      });
  }

  /**
   * Loads all the users into the redux state.
   */
  loadUsers = () => {
    const {showLoading, hideLoading} = this.props;
    const eventAlias = this.props.match.params.eventAlias;

    showLoading();
    loadAllUsers(eventAlias)
      .then((res: TESCUser[]) => {
        hideLoading();
        return this.setState({users: res});
      });
  }

  /**
   * Handles an updated user.
   * @param {Object} user The updated user.
   */
  onUserUpdate = (user: TESCUser) => {
    this.props.updateUser(user)
      .then(() => {
        const {users} = this.state;

        this.setState({
          users: [
            ...users.filter((curr) => curr._id !== user._id),
            user,
          ],
        });
      });
  }

  onAddColumn = (column: Column) =>
    this.props.addColumn(column)

  onRemoveColumn = (column: Column) =>
    this.props.removeColumn(column)

  render() {
    const {event, activeColumns, availableColumns} = this.props;
    const {users} = this.state;

    if (!event) {
      return (
        <Loading />
      );
    }

    return (
      <div className="d-flex flex-column h-100 p-3">
        <div className="row">
          <div className="col-12">
            <h1>
              <Link to={`/admin/events/${event.alias}`}>
                {event.name}
              </Link> Users</h1>
          </div>
          <div className="col-md-6">
            <ColumnEditor
              available={availableColumns}
              columns={activeColumns}
              onAddColumn={this.onAddColumn}
              onDeleteColumn={this.onRemoveColumn}
            />
          </div>
          <div className="col-md-6">
            <h4>Tools</h4>
            <button
              className="btn rounded-button rounded-button--small"
              onClick={this.loadUsers}
            >
              <i className="fa fa-refresh" />&nbsp;Refresh
            </button>
          </div>
        </div>
        <UserList
          users={users}
          columns={activeColumns}
          onUserUpdate={this.onUserUpdate}
          event={event}
        />
      </div>
    );
  }
}

const mapStateToProps = (state: ApplicationState, ownProps: Props) => ({
  availableColumns: state.admin.userColumns.available,
  activeColumns: state.admin.userColumns.active,
  loadedAvailableColumns: state.admin.userColumns.loadedAvailable,
  event: state.admin.events[ownProps.match.params.eventAlias],
});

const mapDispatchToProps = (dispatch: ApplicationDispatch) => {
  return {
    updateUser: bindActionCreators(updateUser, dispatch),
    addColumn: bindActionCreators(addColumn, dispatch),
    removeColumn: bindActionCreators(removeColumn, dispatch),
    addAvailableColumns: bindActionCreators(addAvailableColumns, dispatch),
    showLoading: bindActionCreators(showLoading, dispatch),
    hideLoading: bindActionCreators(hideLoading, dispatch),
    loadAllAdminEvents: bindActionCreators(loadAllAdminEvents, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UsersPage);
