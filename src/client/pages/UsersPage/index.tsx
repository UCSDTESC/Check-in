import { TESCUser } from '@Shared/ModelTypes';
import React from 'react';
import { connect } from 'react-redux';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { Link, RouteComponentProps } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { loadAllAdminEvents, ApplicationDispatch } from '~/actions';
import Loading from '~/components/Loading';
import { loadAllUsers, loadColumns } from '~/data/AdminApi';
import { ApplicationState } from '~/reducers';
import { Column } from '~/static/Types';

import { addColumn, updateUser, removeColumn, addAvailableColumns } from './actions';
import ColumnEditor from './components/ColumnEditor';
import UserList from './components/UserList';

const mapStateToProps = (state: ApplicationState, ownProps: RouteProps) => ({
  availableColumns: state.admin.userColumns.available,
  activeColumns: state.admin.userColumns.active,
  loadedAvailableColumns: state.admin.userColumns.loadedAvailable,
  event: state.admin.events[ownProps.match.params.eventAlias],
});

const mapDispatchToProps = (dispatch: ApplicationDispatch) => bindActionCreators({
  updateUser,
  addColumn,
  removeColumn,
  addAvailableColumns,
  showLoading,
  hideLoading,
  loadAllAdminEvents,
}, dispatch);

interface UsersPageProps {
}

type RouteProps = RouteComponentProps<{
  eventAlias: string;
}>;

type Props = RouteProps & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & UsersPageProps;

interface UsersPageState {
  users: TESCUser[];
}

class UsersPage extends React.Component<Props, UsersPageState> {
  state: Readonly<UsersPageState> = {
    users: [],
  };

  componentDidMount() {
    const { event, loadedAvailableColumns } = this.props;

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
        const newColumns: Column[] = Object.entries(columns)
          .reduce((acc, [key, value]) => {
            acc.push({
              Header: value,
              accessor: key,
            } as Column);
            return acc;
          }, []);
        this.props.addAvailableColumns(newColumns);
      });
  }

  /**
   * Loads all the users into the redux state.
   */
  loadUsers = () => {
    const { showLoading, hideLoading } = this.props;
    const eventAlias = this.props.match.params.eventAlias;

    showLoading();
    loadAllUsers(eventAlias)
      .then((res: TESCUser[]) => {
        hideLoading();
        return this.setState({ users: res });
      });
  }

  /**
   * Handles an update to a user in the list.
   */
  onUserUpdate = (user: TESCUser) => {
    this.props.updateUser(user)
      .then(() => {
        const { users } = this.state;

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
    const { event, activeColumns, availableColumns } = this.props;
    const { users } = this.state;

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

export default connect(mapStateToProps, mapDispatchToProps)(UsersPage);
