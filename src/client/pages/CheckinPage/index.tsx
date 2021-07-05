import { TESCUser } from '@Shared/ModelTypes';
import { UserStatus } from '@Shared/UserStatus';
import React from 'react';
import { connect } from 'react-redux';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { RouteComponentProps } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { loadAllAdminEvents, ApplicationDispatch } from '~/actions';
import Loading from '~/components/Loading';
import { loadAllUsers } from '~/data/AdminApi';
import { ApplicationState } from '~/reducers';

import { AlertType } from '../AlertPage';
import TabularPage, { TabularPageState, TabularPageProps, TabPage, TabularPageNav } from '../TabularPage';
import { addUsers } from '../UsersPage/actions';

import { userCheckin } from './actions';
import KeyboardScanner from './components/KeyboardScanner';
import LiabilityWaiverModal from './components/LiabilityWaiverModal';
import ManualScanner from './components/ManualScanner';
import WebcamScanner from './components/WebcamScanner';

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

interface CheckinPageProps extends TabularPageProps {
}

type Props = RouteProps & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & CheckinPageProps;

interface CheckinPageState extends TabularPageState {
  isProcessing: boolean;
  isLiabilityShowing: boolean;
  lastUser?: TESCUser;
}

const CheckinTab: React.StatelessComponent = (props) => {
  return (
    <div className="tab-page__contents">
      {props.children}
    </div>
  );
};

class CheckinPage extends TabularPage<Props, CheckinPageState> {
  tabPages: Readonly<TabPage[]> = [
    {
      icon: 'qrcode',
      name: 'Scanner',
      anchor: 'scanner',
      render: this.renderKeyboardTab.bind(this),
    } as TabPage,
    {
      icon: 'video-camera',
      name: 'Webcam',
      anchor: 'webcam',
      render: this.renderWebcamTab.bind(this),
    } as TabPage,
    {
      icon: 'search',
      name: 'Manual',
      anchor: 'manual',
      render: this.renderManualTab.bind(this),
    } as TabPage,
  ];

  state: Readonly<CheckinPageState> = {
    isProcessing: false,
    isLiabilityShowing: false,
    lastUser: null,
    activeTab: this.tabPages[0],
    alerts: [],
  };

  componentDidMount() {
    super.componentDidMount();
    const { users, event } = this.props;

    showLoading();

    if (!event) {
      this.props.loadAllAdminEvents()
        .catch(console.error)
        .then(this.loadUsers)
        .finally(hideLoading);
    } else {
      this.loadUsers()
        .finally(hideLoading);
    }
  }

  /**
   * Show error when checkin fails
   * 
   * @param {String} error the error message to show.
   */
  onCheckinError = (error: string) => {
    this.clearAlerts();
    this.createAlert(error, AlertType.Danger);
  };

  /**
   * Show success message when checkin is successful
   */
  onCheckinSuccessful = () => {
    const { lastUser } = this.state;

    this.clearAlerts();
    this.createAlert(`Checked in ${lastUser.firstName}`, AlertType.Success);
  };

  /**
   * Loads all the users into the redux state.
   */
  loadUsers = () => {
    const { addUsers } = this.props;
    const { event } = this.props;

    return loadAllUsers(event._id)
      .then(addUsers);
  }

  /**
   * Logic flow to determine whether the user should be allowed into the event.
   * 
   * @param {TESCUser} user The user being checked.
   */
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

  /**
   * Make network request to check in the user.
   * 
   * @param {TESCUser} user the user to be checked in.
   */
  checkinUser = (user: TESCUser): Promise<TESCUser> =>
    new Promise((resolve, reject) => {
      const { event } = this.props;

      this.validateUser(user)
        .then(() =>
          this.props.userCheckin(user, event._id)
        )
        .then(() => resolve(user))
        .catch(reject);
    });

  /**
   * Callback to prep the component for validating the user.
   * 
   * @param {String} userId the userId scanned from the QR code.
   */
  onScan = (userId: string) => {
    const { lastUser } = this.state;

    if (lastUser && userId === lastUser._id) {
      this.onCheckinError('User has already checked in');

      return this.setState({
        isProcessing: false,
      });
    }

    // Filter by given ID
    const eligibleUsers = this.props.users.filter((user) => user._id === userId);

    if (eligibleUsers.length !== 1) {
      this.onCheckinError(`User not found with ID ${userId}`);

      return this.setState({
        isProcessing: false,
      });
    }

    this.setState({
      isProcessing: true,
      lastUser: eligibleUsers[0],
    });

    this.toggleModal();
  }

  /**
   * Toggle liability waiver modal visibility state.
   */
  toggleModal = () =>
    this.setState({
      isLiabilityShowing: !this.state.isLiabilityShowing,
    });

  /**
   * Higher level flow for the checkin process.
   */
  callCheckin = () => {
    this.setState({
      isLiabilityShowing: false,
    });

    this.checkinUser(this.state.lastUser)
      .then((user) => {
        this.onCheckinSuccessful();
      })
      .catch((err: string) => {
        this.onCheckinError(err);
      })
      .finally(() => this.setState({
        isProcessing: false,
      }))
      .catch((err: string) => {
        this.onCheckinError(err);
      });
  }

  /**
   * Render tab where the user can use a scanner to scan in a user id from a QR code.
   * @param props {Props} Not used in this function.
   */
  renderKeyboardTab(props: Props) {
    return (
      <CheckinTab>
        <KeyboardScanner onUserScanned={this.onScan} />
      </CheckinTab>
    );
  }

  /**
   * Render tab where the application can scan a QR code.
   * @param props {Props} Not used in this function.
   */
  renderWebcamTab(props: Props) {
    return (
      <CheckinTab>
        <WebcamScanner onUserScanned={this.onScan} />
      </CheckinTab>
    );
  }

  /**
   * Render tab where the user can type in an email / name to check in a user.
   * @param props {Props} Not used in this function.
   */
  renderManualTab() {
    return (
      <CheckinTab>
        <ManualScanner onUserScanned={this.onScan} users={this.props.users} />
      </CheckinTab>
    );
  }

  render() {
    const { users, event } = this.props;
    const { isLiabilityShowing, activeTab } = this.state;

    if (!users.length) {
      return (
        <Loading />
      );
    }

    return (
      <div className="page page--admin checkin-page d-flex flex-column h-100">
        {this.renderAlerts()}

        <LiabilityWaiverModal
          isOpen={isLiabilityShowing}
          onWaiverAgree={this.callCheckin}
          toggleModal={this.toggleModal}
          event={event}
        />

        <div className="checkin container-fluid">
          <TabularPageNav
            tabPages={this.tabPages}
            activeTab={activeTab}
          />

          {this.renderActiveTab()}
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckinPage);
