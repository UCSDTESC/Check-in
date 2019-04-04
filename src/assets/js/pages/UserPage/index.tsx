import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {UncontrolledAlert} from 'reactstrap';
import {showLoading, hideLoading} from 'react-redux-loading-bar';
import diff from 'object-diff';

import UserProfile from './components/UserProfile';
import RSVPConfirm from './components/RSVPConfirm';
import {getCurrentUser, updateCurrentUser} from './actions';

import NavHeader from '~/components/NavHeader';

import Loading from '~/components/Loading';

import {updateUserField, rsvpUser} from '~/data/User';
import { RouteComponentProps } from 'react-router-dom';
import { ApplicationState } from '~/reducers';
import { TESCUser } from '~/static/types';
import AlertPage, { AlertPageState, AlertType } from '../AlertPage';

interface StateProps {
  user: TESCUser;
}

interface DispatchProps {
  showLoading: () => void;
  hideLoading: () => void;
  getCurrentUser: (arg0: any) => Promise<any>;
  updateCurrentUser: (arg0: any) => Promise<any>;
}

interface UserPageProps {
}

type Props = RouteComponentProps<{
  eventAlias: string;
}> & StateProps & DispatchProps & UserPageProps;

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

    const {showLoading, hideLoading, getCurrentUser} = this.props;
    const {eventAlias} = this.props.match.params;

    showLoading();

    getCurrentUser(eventAlias)
      .catch(console.error)
      .finally(() => {
        hideLoading();
      });
  }

  componentWillUnmount() {
    document.body.classList.remove('user-page__body');
  }

  /**
   * Requests that the server update the current user to the new, given values.
   * @param {TESCUser} newUser The new user object to update to.
   */
  updateUser = (newUser: TESCUser) => {
    const {updateCurrentUser} = this.props;
    const {eventAlias} = this.props.match.params;
    const oldUser = this.props.user;
    // Delta is all the changed fields in the form
    const delta = diff(oldUser, newUser);

    updateUserField(delta, eventAlias)
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

  toggleRSVP = () => this.setState({showRSVP: !this.state.showRSVP});

  /**
   * Requests that the server RSVP the current user with the given values.
   * @param {Boolean} status True if the user has chosen to accept.
   * @param {Boolean} bussing True if the user will take the bus, null if no bus
   * option exists.
   */
  userRSVP = (status: boolean, bussing: boolean) => {
    const {user, updateCurrentUser} = this.props;
    if (user.status !== 'Unconfirmed') {
      return;
    }

    rsvpUser(this.props.match.params.eventAlias, status, bussing)
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
    const {alerts, showRSVP} = this.state;
    const {user} = this.props;

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
          <div className="user-page__alerts">
            {alerts.map((alert, index) => this.renderAlert(alert, index))}
          </div>

          <NavHeader title="Your Profile" />
        </div>

        <div className="user-page__container container">
          <UserProfile
            user={user}
            initialValues={user}
            onSubmit={this.updateUser}
            toggleRSVP={this.toggleRSVP}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: ApplicationState) => {
  return {
    user: state.user.current,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    showLoading: bindActionCreators(showLoading, dispatch),
    hideLoading: bindActionCreators(hideLoading, dispatch),
    getCurrentUser: bindActionCreators(getCurrentUser, dispatch),
    updateCurrentUser: bindActionCreators(updateCurrentUser, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserPage);
