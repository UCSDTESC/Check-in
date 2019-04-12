import React from 'react';
import {connect} from 'react-redux';

import {toggleEditing, ApplicationDispatch} from '~/actions';

import {loginAdmin} from '~/auth/admin/actions';

import Login, { LoginFormData } from '~/auth/admin/Login';

import Sidebar from './components/AdminSidebar';
import { ApplicationState } from '~/reducers';
import { bindActionCreators } from 'redux';

const mapStateToProps = (state: ApplicationState) => ({
  isAuthenticated: state.admin.auth.authenticated,
  user: state.admin.auth.user,
  loginError: state.admin.auth.error,
  isEditing: state.admin.general.editing,
  events: state.admin.events,
});

const mapDispatchToProps = (dispatch: ApplicationDispatch) => bindActionCreators({
  loginAdmin,
  toggleEditing,
}, dispatch);

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

interface AdminLayoutState {
  isSidebarOpen: boolean;
}

class AdminLayout extends React.Component<Props, AdminLayoutState> {
  state: Readonly<AdminLayoutState> = {
    isSidebarOpen: false,
  };

  componentDidUpdate() {
    if (this.state.isSidebarOpen) {
      this.setState({
        isSidebarOpen: false,
      });
    }
  }

  /**
   * Toggles the visibility of the sidebar.
   */
  toggleSidebar() {
    this.setState({
      isSidebarOpen: !this.state.isSidebarOpen,
    });
  }

  render() {
    const {isAuthenticated, user, events, isEditing} = this.props;

    const containerState = 'admin-sidebar__container--' +
      (isAuthenticated ? 'authenticated' : 'logged-out');

    const contentState = 'admin-body__content--' +
      (isAuthenticated ? 'authenticated' : 'logged-out');

    const login = (
      <Login
        loginUser={this.props.loginAdmin}
        errorMessage={this.props.loginError}
      />
    );

    return (
      <div className="admin-body d-flex flex-column">

        <div className="container-fluid p-0 w-100 max-height">
          <div className="d-flex flex-column flex-md-row h-100">
            <div className={`admin-sidebar__container ${containerState}`}>
              <Sidebar
                isEditing={isEditing}
                isAuthenticated={isAuthenticated}
                user={user}
                onEditChange={this.props.toggleEditing}
                events={events}
              >
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
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminLayout);
