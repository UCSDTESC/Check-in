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

class UserPage extends React.Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        eventAlias: PropTypes.string.isRequired
      }).isRequired
    }).isRequired,

    getCurrentUser: PropTypes.func.isRequired,
    updateCurrentUser: PropTypes.func.isRequired,
    showLoading: PropTypes.func.isRequired,
    hideLoading: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      alerts: [],
      showRSVP: false
    };
  }

  componentWillMount() {
    document.body.classList.add('user-page__body');

    let {showLoading, hideLoading, getCurrentUser} = this.props;
    let {eventAlias} = this.props.match.params;

    showLoading();

    getCurrentUser(eventAlias)
      .catch(console.error)
      .finally(() => {
        hideLoading();
      });
  }

  componentWillUnmount () {
    document.body.classList.remove('user-page__body');
  }

  /**
   * Creates a new alert to render to the top of the screen.
   * @param {String} message The message to display in the alert.
   * @param {String} type The type of alert to show.
   * @param {String} title The title of the alert.
   */
  createAlert(message, type='danger', title) {
    this.setState({
      alerts: [...this.state.alerts, {
        message,
        type,
        title
      }]
    });
  }

  /**
   * Creates a new error alert if there was a login error.
   * @param {String} message The message to display in the alert.
   * @param {String} type The type of alert to show.
   * @param {String} title The title of the alert.
   * @param {String} key The given key for the element.
   * @returns {Component}
   */
  renderAlert(message, type='danger', title, key='0') {
    if (message) {
      return (
        <div className="user-page__error" key={key}>
          <UncontrolledAlert color={type}>
            <div className="container">
              <strong>{title}</strong> {message}
            </div>
          </UncontrolledAlert>
        </div>
      );
    }
  }

  /**
   * Requests that the server update the current user to the new, given values.
   * @param {Object} newUser The new user object to update to.
   */
  updateUser = (newUser) => {
    let {updateCurrentUser} = this.props;
    let {eventAlias} = this.props.match.params;
    let oldUser = this.props.user;
    // Delta is all the changed fields in the form
    const delta = diff(oldUser, newUser);

    updateUserField(delta, eventAlias)
      .then((newUser) => {
        updateCurrentUser(newUser);
        this.createAlert('You have successfully updated your profile',
          'success');
      })
      .catch((err) => {
        this.createAlert(err.message, 'danger', 'Something went wrong!');
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
  userRSVP = (status, bussing) => {
    let {user, updateCurrentUser} = this.props;
    if (user.status !== 'Unconfirmed') {
      return;
    }

    rsvpUser(this.props.match.params.eventAlias, status, bussing)
      .then((newUser) => {
        updateCurrentUser(newUser);
        this.createAlert(`You have successfully RSVPed to ${user.event.name}`,
          'success');
      })
      .catch((err) => {
        this.createAlert(err.message, 'danger', 'Something went wrong!');
        console.error(err);
      });
  }

  render() {
    let {alerts, showRSVP} = this.state;
    let {user} = this.props;

    if (!user || !user.event) {
      return <Loading />;
    }

    return (
      <div className="user-page">
        {showRSVP && <RSVPConfirm availableBus={user.availableBus}
          onUpdate={this.userRSVP} onClose={this.toggleRSVP}
          event={user.event} />}
        <div className="user-page__above">
          <div className="user-page__alerts">
            {alerts.map(({message, type, title}, i) =>
              this.renderAlert(message, type, title, i))}
          </div>

          <NavHeader title="Your Profile" />
        </div>

        <div className="user-page__container container">
          <UserProfile user={user} initialValues={user}
            onSubmit={this.updateUser} toggleRSVP={this.toggleRSVP} />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user.current
  };
}

function mapDispatchToProps(dispatch) {
  return {
    showLoading: bindActionCreators(showLoading, dispatch),
    hideLoading: bindActionCreators(hideLoading, dispatch),
    getCurrentUser: bindActionCreators(getCurrentUser, dispatch),
    updateCurrentUser: bindActionCreators(updateCurrentUser, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserPage);
