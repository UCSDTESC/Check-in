import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {toggleEditing} from '~/actions';

import {loginUser} from '~/auth/actions';

import Login from '~/auth/Login';

import Sidebar from './components/AdminSidebar';

class AdminLayout extends React.Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    user: PropTypes.object.isRequired,
    children: PropTypes.object.isRequired,
    isEditing: PropTypes.bool.isRequired,

    loginUser: PropTypes.func.isRequired,
    loginError: PropTypes.string.isRequired,

    toggleEditing: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      isSidebarOpen: false
    };
  }

  componentDidUpdate() {
    if (this.state.isSidebarOpen) {
      this.setState({
        isSidebarOpen: false
      });
    }
  }

  /**
   * Toggles the visibility of the sidebar.
   */
  toggleSidebar() {
    this.setState({
      isSidebarOpen: !this.state.isSidebarOpen
    });
  }

  render() {
    let {isAuthenticated, user} = this.props;
    let {isEditing} = this.props;

    let containerState = 'admin-sidebar__container--' +
      (isAuthenticated ? 'authenticated' : 'logged-out');

    let contentState = 'admin-body__content--' +
      (isAuthenticated ? 'authenticated' : 'logged-out');

    let login = (<Login loginUser={this.props.loginUser}
      errorMessage={this.props.loginError} />);

    return (
      <div className="admin-body d-flex flex-column">

        <div className="container-fluid p-0 w-100 max-height">
          <div className="d-flex flex-column flex-md-row h-100">
            <div className={`admin-sidebar__container ${containerState}`}>
              <Sidebar isEditing={isEditing} isAuthenticated={isAuthenticated}
                user={user} onEditChange={this.props.toggleEditing}>
                {!isAuthenticated && login}
              </Sidebar>
            </div>

            <main className={`admin-body__content ${contentState}`}>
              {isAuthenticated && this.props.children}
            </main>
          </div>
        </div>
      </div>
    );
  }
};

function mapStateToProps(state) {
  return {
    isAuthenticated: state.admin.auth.authenticated,
    user: state.admin.auth.user,
    loginError: state.admin.auth.error,
    isEditing: state.admin.general.editing
  };
};

function mapDispatchToProps(dispatch) {
  return {
    loginUser: bindActionCreators(loginUser, dispatch),
    toggleEditing: bindActionCreators(toggleEditing, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminLayout);
