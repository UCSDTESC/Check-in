import React from 'react';
import QrReader from 'react-qr-reader';
import { connect } from 'react-redux';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { RouteComponentProps } from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { bindActionCreators } from 'redux';
import { loadAllAdminEvents, ApplicationDispatch } from '~/actions';
import Loading from '~/components/Loading';
import { loadAllUsers } from '~/data/Api';
import { ApplicationState } from '~/reducers';
import { TESCUser, UserStatus } from '~/static/types';

import { addUsers } from '../UsersPage/actions';

import { userCheckin } from './actions';

import {loadAllUsers} from '~/data/Api';

import {userCheckin} from './actions';

import { RouteComponentProps } from 'react-router-dom';
import { TESCUser, UserStatus } from '~/static/types';
import { ApplicationState } from '~/reducers';
import { bindActionCreators } from 'redux';
import WebcamScanner from './components/WebcamScanner';
import ManualScanner from './components/ManualScanner';
import LiabilityWaiverModal from './components/LiabilityWaiverModal';
import ScannerSelector from './components/ScannerSelector';
import KeyboardScanner from './components/KeyboardScanner';

// Length of _id in MongoDB
export const USER_ID_LENGTH = 24;

type RouteProps = RouteComponentProps<{
  eventAlias: string;
}>;

const mapStateToProps = (state: ApplicationState, ownProps: RouteProps) => ({
  auth: state.admin.auth,
  user: state.admin.auth.user,
  users: state.admin.users,
  event: state.admin.events[ownProps.match.params.eventAlias],
});

const mapDispatchToProps = (dispatch: ApplicationDispatch) => bindActionCreators({
  showLoading,
  hideLoading,
  addUsers,
  loadAllAdminEvents,
  userCheckin,
}, dispatch);

interface CheckinPageProps {
}

type Props = RouteProps & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & CheckinPageProps;

interface CheckinPageState {
  isProcessing: boolean;
  wasSuccessful: boolean;
  errorMessage: string;
  isLiabilityShowing: boolean;
  lastUser?: TESCUser;
  lastName: string;
  activeScanner: ScannerType;
}

export enum ScannerType {
  Keyboard = 1,
  Webcam = 2,
  Manual = 3,
}

class CheckinPage extends React.Component<Props, CheckinPageState> {
  state: Readonly<CheckinPageState> = {
    isProcessing: false,
    wasSuccessful: false,
    errorMessage: '',
    isLiabilityShowing: false,
    lastUser: null,
    lastName: '',
    activeScanner: ScannerType.Manual,
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
    new Promise((resolve, reject) => {
      // Ensure they're eligible
      if (user.status !== UserStatus.Confirmed) {
        switch (user.status) {
        case (UserStatus.Declined):
          return reject('User marked as rejecting invitation');
        case (UserStatus.Unconfirmed):
          return reject('User never confirmed their invitation');
        case (UserStatus.Rejected):
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

  checkinUser = (user: TESCUser): Promise<TESCUser> =>
    new Promise((resolve, reject) => {
      const {event} = this.props;

      this.validateUser(user)
        .then(() =>
          this.props.userCheckin(user, event.alias)
        )
        .then(() => resolve(user))
        .catch(reject);
    });

  onScan = (userId: string) => {
    const {lastUser} = this.state;

    if (lastUser && userId === lastUser._id) {
      return this.setState({
        errorMessage: 'User has already checked in',
        wasSuccessful: false,
        isProcessing: false,
      });
    }

    // Filter by given ID
    const eligibleUsers = this.props.users.filter((user) => user._id === userId);

    if (eligibleUsers.length !== 1) {
      return this.setState({
        errorMessage: `User not found with ID ${userId}`,
        wasSuccessful: false,
        isProcessing: false,
      });
    }

    this.setState({
      isProcessing: true,
      wasSuccessful: false,
      errorMessage: '',
      lastUser: eligibleUsers[0],
      lastName: '',
    });

    this.toggleModal();
  }

  toggleModal = () =>
    this.setState({
      isLiabilityShowing: !this.state.isLiabilityShowing,
    });

  callCheckin = () => {
    this.setState({
      isLiabilityShowing: false,
    });

    this.checkinUser(this.state.lastUser)
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

  renderActiveScanner = () => {
    switch (this.state.activeScanner) {
      case (ScannerType.Keyboard):
        return <KeyboardScanner onUserScanned={this.onScan} />;
      case (ScannerType.Webcam):
        return <WebcamScanner onUserScanned={this.onScan} />;
      case (ScannerType.Manual):
        return <ManualScanner onUserScanned={this.onScan} users={this.props.users} />;
    }
  }

  render() {
    const {users, event} = this.props;
    const {errorMessage, wasSuccessful, lastName, isLiabilityShowing,
      activeScanner} = this.state;

    if (!users.length) {
      return (
        <Loading />
      );
    }

    return (

      <div className="full-height">
        <LiabilityWaiverModal
          isOpen={isLiabilityShowing}
          onWaiverAgree={this.callCheckin}
          toggleModal={this.toggleModal}
          event={event}
        />
        <div className="checkin container">
          <div className="row align-items-center">
            <div className="col">
              <h1>{event.name} Checkin</h1>
              {errorMessage && <h2 className="checkin__error text-danger">
                {errorMessage}
              </h2>}
              {wasSuccessful &&
                <h2 className="checkin__success">Checked In&nbsp;
                  <span className="checkin__name">{lastName}</span>!
                </h2>
              }
            </div>
            <div className="col">
              <ScannerSelector
                selectedScanner={activeScanner}
                onSelectScanner={(newScanner) =>
                  this.setState({
                    activeScanner: newScanner,
                  })
                }
              />
            </div>
          </div>
          {this.renderActiveScanner()}
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckinPage);
