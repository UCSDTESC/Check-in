import React from 'react';
import {connect} from 'react-redux';
import {showLoading, hideLoading} from 'react-redux-loading-bar';
import {Button} from 'reactstrap';

import {replaceAdmins} from './actions';
import AdminList from './components/AdminList';

import NewAdminModal from '~/components/NewAdminModal';

import {loadAllAdmins, registerAdmin, deleteAdmin} from '~/data/Api';

import { Admin } from '~/static/types';
import { ApplicationState } from '~/reducers';

const mapStateToProps = (state: ApplicationState) => ({
  admins: state.admin.admins,
  editing: state.admin.general.editing,
});

const mapDispatchToProps = {
  replaceAdmins,
  showLoading,
  hideLoading,
};

interface AdminsPageProps {
}

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & AdminsPageProps;

interface AdminsPageState {
  isRegisterModalOpen: boolean;
}

class AdminsPage extends React.Component<Props, AdminsPageState> {
  state: Readonly<AdminsPageState> = {
    isRegisterModalOpen: false,
  };

  loadAdmins = () =>
    loadAllAdmins()
      .then(res => this.props.replaceAdmins(res))
      .catch(console.error);

  componentDidMount() {
    this.props.showLoading();

    this.loadAdmins()
      .then(() => this.props.hideLoading());
  }

  toggleRegisterModal = () => this.setState({
    isRegisterModalOpen: !this.state.isRegisterModalOpen,
  });

  registerNewAdmin = (newAdmin: Admin) =>
    registerAdmin(newAdmin)
      .then(this.loadAdmins)
      .then(this.toggleRegisterModal)
      .catch(console.error);

  onDeleteAdmin = (adminId: string) =>
    deleteAdmin(adminId)
      .then(this.loadAdmins)
      .catch(console.error);

  render() {
    const {editing, admins} = this.props;

    return (
      <div>
        <NewAdminModal
          toggle={this.toggleRegisterModal}
          open={this.state.isRegisterModalOpen}
          onSubmit={this.registerNewAdmin}
        />
        <AdminList
          admins={admins}
          onDeleteAdmin={this.onDeleteAdmin}
          editing={editing}
        />
        {editing && <Button
          className="ml-2"
          color="primary"
          onClick={this.toggleRegisterModal}
        >
          Register New Admin
        </Button>}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminsPage);
