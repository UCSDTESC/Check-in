import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {showLoading, hideLoading} from 'react-redux-loading-bar';
import {Button} from 'reactstrap';

import {replaceAdmins} from './actions';
import AdminList from './components/AdminList';
import RegisterModal from './components/RegisterModal';

import {loadAllAdmins, registerAdmin, deleteAdmin} from '~/data/Api';

import {Admin as AdminPropTypes} from '~/proptypes';

class AdminsPage extends React.Component {
  static propTypes = {
    admins: PropTypes.arrayOf(PropTypes.shape(
      AdminPropTypes
    ).isRequired).isRequired,
    showLoading: PropTypes.func.isRequired,
    hideLoading: PropTypes.func.isRequired,
    replaceAdmins: PropTypes.func.isRequired,
    editing: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      isRegisterModalOpen: false
    };
  }

  loadAdmins = () =>
    loadAllAdmins()
      .then(res => {
        this.props.hideLoading();
        return this.props.replaceAdmins(res);
      })
      .catch(console.error);

  componentWillMount() {
    this.props.showLoading();

    this.loadAdmins();
  }

  toggleRegisterModal = () => this.setState({
    isRegisterModalOpen: !this.state.isRegisterModalOpen
  });

  registerNewAdmin = (newAdmin) =>
    registerAdmin(newAdmin)
      .then(this.loadAdmins)
      .catch(console.error);

  onDeleteAdmin = (adminId) =>
    deleteAdmin(adminId)
      .then(this.loadAdmins)
      .catch(console.error);

  render() {
    let {editing, admins} = this.props;

    return (
      <div>
        <RegisterModal toggle={this.toggleRegisterModal}
          open={this.state.isRegisterModalOpen}
          onSubmit={this.registerNewAdmin} />
        <AdminList admins={admins}
          onDeleteAdmin={this.onDeleteAdmin}
          editing={editing} />
        {editing && <Button className="ml-2" color="primary"
          onClick={this.toggleRegisterModal}>
          Register New Admin
        </Button>}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    admins: state.admin.admins,
    editing: state.admin.general.editing
  };
};

function mapDispatchToProps(dispatch) {
  return {
    replaceAdmins: bindActionCreators(replaceAdmins,dispatch),
    showLoading: bindActionCreators(showLoading, dispatch),
    hideLoading: bindActionCreators(hideLoading, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminsPage);
