import React, { ChangeEvent } from 'react';
import QrReader from 'react-qr-reader';
import Q from 'q';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import {showLoading, hideLoading} from 'react-redux-loading-bar';

import Loading from '~/components/Loading';

import {addUsers} from '../UsersPage/actions';

import {loadAllAdminEvents} from '~/actions';

import {loadAllUsers} from '~/data/Api';

import {userCheckin} from './actions';

import { RouteComponentProps } from 'react-router-dom';
import { TESCUser, Admin, TESCEvent } from '~/static/types';
import { ApplicationState } from '~/reducers';
import { AdminAuthState } from '~/auth/admin/reducers/types';

interface StateProps {
  auth: AdminAuthState;
  user: {} | Admin;
  users: TESCUser[];
  event: TESCEvent;
}

interface DispatchProps {
  showLoading: () => void;
  hideLoading: () => void;
  addUsers: (arg0: any) => Promise<any>;
  loadAllAdminEvents: () => Promise<any>;
  userCheckin: (arg0: any, arg1: any) => Promise<any>;
}

interface CheckinPageProps {
}

type Props = RouteComponentProps<{
  eventAlias: string;
}> & StateProps & DispatchProps & CheckinPageProps;

interface CheckinPageState {
  isProcessing: boolean;
  wasSuccessful: boolean;
  errorMessage: string;
  isModalShowing: boolean;
  lastUser: string;
  lastName: string;
  nameApplicants: TESCUser[];
}

class CheckinPage extends React.Component<Props, CheckinPageState> {
  state: Readonly<CheckinPageState> = {
    isProcessing: false,
    wasSuccessful: false,
    errorMessage: '',
    isModalShowing: false,
    lastUser: '',
    lastName: '',
    nameApplicants: []
  };

  componentDidMount() {
    const {users, event} = this.props;

    if (!users.length) {
      this.loadUsers();
    }

    if (!event) {
      showLoading();

      this.props.loadAllAdminEvents()
        .catch(console.error)
        .finally(hideLoading);
    }
  }

  /**
   * Loads all the users into the redux state.
   */
  loadUsers = () => {
    const {showLoading, hideLoading, addUsers} = this.props;

    showLoading();

    loadAllUsers(this.props.match.params.eventAlias)
      .then(res => {
        hideLoading();
        return addUsers(res);
      });
  }

  validateUser = (user: TESCUser) =>
    Q.promise((resolve, reject) => {
      // Ensure they're eligible
      if (user.status !== 'Confirmed') {
        switch (user.status) {
        case ('Declined'):
          return reject('User marked as rejecting invitation');
        case ('Unconfirmed'):
          return reject('User never confirmed their invitation');
        case ('Rejected'):
          return reject('User was rejected from ' + user.event.name);
        default:
          return reject('User was not invited to event');
        }
      }
      if (user.checkedIn) {
        return reject('User has already checked in');
      }

      return resolve(user);
    })

  checkinById = (id: string) =>
    Q.promise((resolve, reject) => {
      let {users, event} = this.props;

      // Filter by given ID
      let eligibleUsers = users.filter((user) => user._id === id);

      if (eligibleUsers.length !== 1) {
        return reject(id);
        return reject('User not found');
      }

      // Get the particular user
      const user = eligibleUsers[0];

      this.validateUser(user)
        .then(() => {
          this.props.userCheckin(user, event.alias)
            .then(() => {
              resolve(user);
            })
            .catch(reject);
        })
        .catch(reject);
    });

  onScan = (data: string) => {
    if (data === null || this.state.isProcessing) {
      return;
    }

    if (data === this.state.lastUser) {
      return this.setState({
        errorMessage: 'User has already checked in',
        wasSuccessful: false,
      });
    }

    this.setState({
      isProcessing: true,
      wasSuccessful: false,
      errorMessage: '',
      lastUser: data,
      lastName: '',
    });

    this.toggleModal();
  }

  nameApplicants = (event: {target: HTMLInputElement}) => {
    const {users} = this.props;

    const name = event.target.value;
    if (name.length < 3) {
      return;
    }

    // Filter by given name
    const eligibleUsers = users.filter((user) =>
      (`${user.firstName} ${user.lastName}`).indexOf(name) !== -1);
    this.setState({
      nameApplicants: eligibleUsers,
    });
  }

  selectApplicant = (id: string) => {
    this.onScan(id);

    this.setState({
      nameApplicants: [],
    });
  }

  toggleModal = () =>
    this.setState({
      isModalShowing: !this.state.isModalShowing,
    });

  startCheckin = () => {
    this.setState({
      isModalShowing: false,
    });

    this.checkinById(this.state.lastUser)
      .then((user) => {
        this.setState({
          wasSuccessful: true,
          lastName: `${user.firstName} ${user.lastName}`,
        });
      })
      .catch((err: string) => {
        this.setState({
          wasSuccessful: false,
          errorMessage: err,
        });
      })
      .finally(() => this.setState({
        isProcessing: false,
      }))
      .catch((err: string) => {
        this.setState({
          wasSuccessful : false,
          errorMessage : err,
        });
      });
  }

  render() {
    const {users, event} = this.props;
    const {errorMessage, wasSuccessful, lastName, nameApplicants, isModalShowing}
      = this.state;

    const previewStyle = {
      maxWidth: '100%',
      maxHeight: '50vh',
      display: 'inline',
    };

    if (!users.length) {
      return (
        <Loading />
      );
    }

    return (

      <div className="full-height">
        <Modal
          isOpen={isModalShowing}
          toggle={this.toggleModal}
          className="modal-lg"
        >
          <ModalHeader toggle={this.toggleModal}>Liability Waiver</ModalHeader>
          <ModalBody>
            <object
              width="100%"
              height="500px"
              data={event.checkinWaiver}
            />
          </ModalBody>t
          <ModalFooter>
            <Button color="primary" onClick={this.startCheckin}>I agree</Button>
            {' '}
            <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
          </ModalFooter>
        </Modal>
        <div className="checkin container">
          <div className="row">
            <div className="col-12 text-center">
              <h1>{event.name} Checkin</h1>
              <h2>Scan QR</h2>
              {errorMessage && <h2 className="checkin__error text-danger">
                {JSON.stringify(errorMessage)}
              </h2>}
              {wasSuccessful &&
                <h2 className="checkin__success">Checked In&nbsp;
                  <span className="checkin__name">{lastName}</span>!
                </h2>
              }
              <QrReader
                delay={200}
                style={previewStyle}
                onError={console.error}
                onScan={this.onScan}
                playsinline="true"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-12 text-center">
              <h2>Manual Checkin</h2>
              <input
                type="text"
                placeholder="Name"
                className="rounded-input"
                onChange={this.nameApplicants}
              />
              <ul className="checkin__list">
                {nameApplicants.map((app) => (
                  <li className="checkin__list-user" key={app._id}>
                    <button
                      className="rounded-button rounded-button--small"
                      onClick={() => this.selectApplicant(app._id)}
                    >
                      {app.firstName} {app.lastName}<br/>
                      <small>{app.account.email}</small>
                    </button>
                  </li>)
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: ApplicationState, ownProps: Props) {
  return {
    auth: state.admin.auth,
    user: state.admin.auth.user,
    users: state.admin.users,
    event: state.admin.events[ownProps.match.params.eventAlias],
  };
}

function mapDispatchToProps(dispatch) {
  return {
    showLoading: bindActionCreators(showLoading, dispatch),
    hideLoading: bindActionCreators(hideLoading, dispatch),
    addUsers: bindActionCreators(addUsers, dispatch),
    loadAllAdminEvents: bindActionCreators(loadAllAdminEvents, dispatch),
    userCheckin: bindActionCreators(userCheckin, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CheckinPage);
