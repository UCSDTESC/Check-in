import { TESCUser } from '@Shared/ModelTypes';
import React from 'react';
import { connect } from 'react-redux';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { Link, RouteComponentProps } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { loadAllAdminEvents, ApplicationDispatch, loadAvailableColumns } from '~/actions';
import Loading from '~/components/Loading';
import { loadAllUsers, loadColumns } from '~/data/AdminApi';
import { ApplicationState } from '~/reducers';
import { ColumnDefinitions } from '~/static/Types';

import AlertPage, { AlertPageState, AlertType } from '../AlertPage';

import { addColumn, updateUser, removeColumn } from './actions';
import ColumnEditor from './components/ColumnEditor';
import UserList from './components/UserList';

export interface AutofillColumn {
  Header: string;
  accessor: string;
}

const mapStateToProps = (state: ApplicationState, ownProps: RouteProps) => ({
  availableColumns: state.admin.availableColumns,
  activeColumns: state.admin.userPageColumns.active,
  event: state.admin.events[ownProps.match.params.eventAlias],
});

const mapDispatchToProps = (dispatch: ApplicationDispatch) => bindActionCreators({
  updateUser,
  addColumn,
  removeColumn,
  loadAvailableColumns,
  showLoading,
  hideLoading,
  loadAllAdminEvents,
}, dispatch);

interface UsersPageProps {
}

type RouteProps = RouteComponentProps<{
  eventAlias: string;
}>;

//the props of this page is the union of the react-router, redux and explicit props
type Props = RouteProps & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & UsersPageProps;

interface UsersPageState extends AlertPageState {
  users: TESCUser[];
  autofillColumns: AutofillColumn[];
}

class UsersPage extends AlertPage<Props, UsersPageState> {
  state: Readonly<UsersPageState> = {
    users: [],
    autofillColumns: [
      {
        Header: 'Email',
        accessor: 'account.email',
      },
    ],
    alerts: [],
  };

  componentDidMount() {
    const { event } = this.props;

    showLoading();

    if (!event) {
      this.props.loadAllAdminEvents()
        .catch(console.error)
        .then(this.loadUsers)
        .finally(hideLoading);
    } else if (!this.state.users.length) {
      this.loadUsers()
        .finally(hideLoading);
    }

    this.ensureAvailableColumns()
      .then(this.loadAutofillColumns.bind(this));
  }

  /**
   * Loads any available columns, if needed.
   */
  ensureAvailableColumns() {
    if (Object.keys(this.props.availableColumns).length > 0) {
      return Promise.resolve(this.props.availableColumns);
    }

    return this.props.loadAvailableColumns();
  }

  /**
   * Loads the available column definitions into the autofill state.
   */
  loadAutofillColumns(availableColumns: ColumnDefinitions) {
    // Create the new columns based off the current set.
    const newColumns: AutofillColumn[] = Object.entries(availableColumns)
      .reduce((acc, [key, value]) => {
        // Ensure we're not doubling up.
        if (acc.some(col => col.accessor === key)) {
          return acc;
        }

        acc.push({
          Header: value,
          accessor: key,
        } as AutofillColumn);
        return acc;
      }, this.state.autofillColumns);

    this.setState({
      autofillColumns: newColumns,
    });
  }

  /**
   * Loads all the users into the redux state.
   */
  loadUsers = () => {
    const { event } = this.props;

    return loadAllUsers(event._id)
      .then((res: TESCUser[]) => {
        return this.setState({ users: res });
      });
  }

  /**
   * Handles an update to a user in the list.
   * 
   * @param {TESCUser} user the user to be updated
   */
  onUserUpdate = (user: TESCUser) => {
    this.props.updateUser(user)
      .then(() => {
        const { users } = this.state;

        this.createAlert(
          `Successfully updated ${user.account.email}'s ${this.props.event.name} Application`,
          AlertType.Success,
          'UsersPage'
        );

        this.setState({
          users: [
            ...users.filter((curr) => curr._id !== user._id),
            user,
          ],
        });
      })
      .catch(() => {
        this.createAlert(`Something went wrong with user update`, AlertType.Danger, 'UsersPage');
      });
  }

  onAddColumn = (column: AutofillColumn) =>
    this.props.addColumn(column)

  onRemoveColumn = (column: AutofillColumn) =>
    this.props.removeColumn(column)

  render() {
    const { event, activeColumns } = this.props;
    const { users, autofillColumns } = this.state;

    if (!event) {
      return (
        <Loading />
      );
    }

    return (
      <div className="d-flex flex-column h-100 p-3">
        <div className="align-self-top">
          <div className="container">
            {this.renderAlerts(true)}
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <h1>
              <Link to={`/admin/events/${event.alias}`}>
                {event.name}
              </Link> Users</h1>
          </div>
          <div className="col-md-6">
            <ColumnEditor
              available={autofillColumns}
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
          createAlert={this.createAlert}
          event={event}
        />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersPage);
