import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router-dom';
import {showLoading, hideLoading} from 'react-redux-loading-bar';

import {loadAllAdminEvents} from '~/actions';

import {addColumn, updateUser, removeColumn} from './actions';

import {loadAllUsers} from '~/data/Api';

import {Column as ColumnPropTypes, Event as EventPropType} from '~/proptypes';

import Loading from '~/components/Loading';

import ColumnEditor from './components/ColumnEditor';
import UserList from './components/UserList';

class UsersPage extends React.Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        eventAlias: PropTypes.string.isRequired
      }).isRequired
    }).isRequired,

    columns: PropTypes.arrayOf(PropTypes.shape(
      ColumnPropTypes
    ).isRequired).isRequired,
    event: PropTypes.shape(EventPropType),

    showLoading: PropTypes.func.isRequired,
    hideLoading: PropTypes.func.isRequired,
    addColumn: PropTypes.func.isRequired,
    removeColumn: PropTypes.func.isRequired,
    loadAllAdminEvents: PropTypes.func.isRequired,
    updateUser: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      users: []
    };
  }

  componentWillMount() {
    let {event} = this.props;

    if (!event) {
      showLoading();

      this.props.loadAllAdminEvents()
        .catch(console.error)
        .finally(hideLoading);
    }

    if (!this.state.users.length) {
      this.loadUsers();
    }
  }

  /**
   * Loads all the users into the redux state.
   */
  loadUsers = () => {
    let {showLoading, hideLoading} = this.props;
    let eventAlias = this.props.match.params.eventAlias;

    showLoading();

    loadAllUsers(eventAlias)
      .then(res => {
        hideLoading();
        return this.setState({users: res});
      });
  }

  /**
   * Handles an updated user.
   * @param {Object} user The updated user.
   */
  onUserUpdate = (user) =>
    this.props.updateUser(user);

  onAddColumn = (columnName) =>
    this.props.addColumn(columnName)

  onRemoveColumn = (columnName) =>
    this.props.removeColumn(columnName)

  render() {
    let {event, columns} = this.props;
    let {users} = this.state;

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
            <ColumnEditor columns={columns}
              onAddColumn={this.onAddColumn}
              onDeleteColumn={this.onRemoveColumn} />
          </div>
          <div className="col-md-6">
            <h4>Tools</h4>
            <button className="btn rounded-button rounded-button--small"
              onClick={this.loadUsers}>
              <i className="fa fa-refresh"></i>&nbsp;Refresh
            </button>
          </div>
        </div>
        <UserList users={users} columns={columns}
          onUserUpdate={this.onUserUpdate} />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  columns: state.admin.userColumns,
  event: state.admin.events[ownProps.match.params.eventAlias]
});

function mapDispatchToProps(dispatch) {
  return {
    updateUser: bindActionCreators(updateUser, dispatch),
    addColumn: bindActionCreators(addColumn, dispatch),
    removeColumn: bindActionCreators(removeColumn,dispatch),
    showLoading: bindActionCreators(showLoading, dispatch),
    hideLoading: bindActionCreators(hideLoading, dispatch),
    loadAllAdminEvents: bindActionCreators(loadAllAdminEvents, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UsersPage);
