import { TESCUser } from '@Shared/ModelTypes';
import { UserStatus } from '@Shared/UserStatus';
import diff from 'object-diff';
import React from 'react';
import { connect } from 'react-redux';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { RouteComponentProps } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { ApplicationDispatch } from '~/actions';
import Loading from '~/components/Loading';
import NavHeader from '~/components/NavHeader';
import { updateUserField, rsvpUser } from '~/data/UserApi';
import { ApplicationState } from '~/reducers';

import AlertPage, { AlertPageState, AlertType } from '../AlertPage';

import { getCurrentUser, getCurrentTeam, updateCurrentUser } from './actions';
import RSVPConfirm from './components/RSVPConfirm';
import UserProfile, { UserProfileFormData } from './components/UserProfile';

const mapStateToProps = (state: ApplicationState) => ({
  user: state.user.current,
});

const mapDispatchToProps = (dispatch: ApplicationDispatch) => bindActionCreators({
  showLoading,
  hideLoading,
  getCurrentUser,
  getCurrentTeam,
  updateCurrentUser,
}, dispatch);

interface UserPageProps {
}

type Props = RouteComponentProps<{
  eventAlias: string;
}> & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & UserPageProps;

interface UserPageState extends AlertPageState {
  showRSVP: boolean;
}

class UserPage extends AlertPage<Props, UserPageState> {
  state: Readonly<UserPageState> = {
    alerts: [],
    showRSVP: false,
  };

  componentDidMount() {
    document.body.classList.add('user-page__body');

    const { showLoading, hideLoading, getCurrentUser, getCurrentTeam } = this.props;
    const { eventAlias } = this.props.match.params;

    showLoading();

    getCurrentUser(eventAlias)
      .catch(console.error)
      .then(user => user && getCurrentTeam(user._id))
      .finally(hideLoading);
  }

  componentWillUnmount() {
    document.body.classList.remove('user-page__body');
  }

  /**
   * Requests that the server update the current user to the new, given values.
   * @param {UserProfileFormData} newUser The new user object to update to.
   */
  updateUser = (newUser: UserProfileFormData) => {
    const { updateCurrentUser } = this.props;
    const oldUser = this.props.user;
    // Delta is all the changed fields in the form
    const delta = diff(oldUser, newUser);

    updateUserField(delta)
      .then((newUser) => {
        updateCurrentUser(newUser);
        this.createAlert('You have successfully updated your profile',
          AlertType.Success);
      })
      .catch((err) => {
        this.createAlert(err.message, AlertType.Danger, 'Something went wrong!');
        console.error(err);
      });
  }

  toggleRSVP = () => this.setState({ showRSVP: !this.state.showRSVP });

  /**
   * Requests that the server RSVP the current user with the given values.
   * @param {Boolean} status True if the user has chosen to accept.
   * @param {Boolean} bussing True if the user will take the bus, null if no bus
   * option exists.
   */
  userRSVP = (status: boolean, bussing: boolean) => {
    const { user, updateCurrentUser } = this.props;
    if (user.status !== UserStatus.Unconfirmed) {
      return;
    }

    rsvpUser(user._id, status, bussing)
      .then((newUser) => {
        updateCurrentUser(newUser);
        this.createAlert(`You have successfully RSVPed to ${user.event.name}`,
          AlertType.Success);
      })
      .catch((err) => {
        this.createAlert(err.message, AlertType.Danger, 'Something went wrong!');
        console.error(err);
      });
  }

  render() {
    const { alerts, showRSVP } = this.state;
    const { user } = this.props;

    if (!user || !user.event) {
      return <Loading />;
    }

    return (
      <div className="user-page">
        {showRSVP && <RSVPConfirm
          availableBus={user.availableBus}
          onUpdate={this.userRSVP}
          onClose={this.toggleRSVP}
          event={user.event}
        />}
        <div className="user-page__above">
          <div className="container">
            {this.renderAlerts(true)}
          </div>

          <NavHeader title="Your Profile" />
        </div>

        <div className="user-page__container container">
          <UserProfile
            user={user}
            initialValues={user}
            onSubmit={this.updateUser}
            toggleRSVP={this.toggleRSVP}
            event={user.event}
          />
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserPage);
