import React from 'react';
import { connect } from 'react-redux';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { Button } from 'reactstrap';
import { bindActionCreators } from 'redux';
import { ApplicationDispatch } from '~/actions';
import NewAdminModal, { NewAdminModalFormData } from '~/components/NewAdminModal';
import { loadAllAdmins, registerAdmin, deleteAdmin } from '~/data/AdminApi';
import { ApplicationState } from '~/reducers';

import { replaceAdmins } from './actions';
import AdminList from './components/AdminList';

const mapStateToProps = (state: ApplicationState) => ({
  admins: state.admin.admins,
});

const mapDispatchToProps = (dispatch: ApplicationDispatch) => bindActionCreators({
  replaceAdmins,
  showLoading,
  hideLoading,
}, dispatch);

interface AdminsPageProps {
}

/**
 * This component receives props in 3 ways - 
 * 1) The explicit props provied to it by AdminsPageProps
 * 2) The redux state provided to it by mapStateToProps
 * 3) The dispatch functions provided to it by mapDispatchToProps
 * 
 * So, the props of this component is the union of the return types of mapStateToProps,
 * mapDispatchToProps and AdminsPageProps
 */
type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & AdminsPageProps;

interface AdminsPageState {

  //tracks whether the New Admin Modal is open or not
  isRegisterModalOpen: boolean;
}

/**
 * This pageshows a list of all admins in the system. It also can create and delete admins.
 * This page is locked to users with the Developer role (The logic for this is in AdminLayout).
 */
class AdminsPage extends React.Component<Props, AdminsPageState> {
  state: Readonly<AdminsPageState> = {
    isRegisterModalOpen: false,
  };

  /**
   * Get admins from the backend and put them into the redux state.
   */
  loadAdmins = () =>
    loadAllAdmins()
      .then(res => this.props.replaceAdmins(res))
      .catch(console.error);

  componentDidMount() {
    this.props.showLoading();

    //Hide loading state after the API returns the admins  
    this.loadAdmins()
      .then(() => this.props.hideLoading());
  }

  /**
   * Toggle the isRegisterModalOpen state variable to show or hide new admin modal
   */
  toggleRegisterModal = () => this.setState({
    isRegisterModalOpen: !this.state.isRegisterModalOpen,
  });

  /**
   * Create a new admin in the database and update the frontend to reflect the change
   * @param {NewAdminModalFormData} newAdmin the new admin to be added to the system
   */
  registerNewAdmin = (newAdmin: NewAdminModalFormData) => {
    registerAdmin(newAdmin)
      .then(this.loadAdmins)
      .then(this.toggleRegisterModal)
      .catch(console.error);
  }

  /**
   * Delete an admin from the system, and update the frontend to reflect the change
   * @param {String} adminId the admin to be deleted from the system
   */
  onDeleteAdmin = (adminId: string) =>
    deleteAdmin(adminId)
      .then(this.loadAdmins)
      .catch(console.error);

  render() {
    const { admins } = this.props;

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
          editing={true}
        />
        <Button
          className="ml-2"
          color="primary"
          onClick={this.toggleRegisterModal}
        >
          Register New Admin
        </Button>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminsPage);
