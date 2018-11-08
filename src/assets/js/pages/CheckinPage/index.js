import PropTypes from 'prop-types';
import React from 'react';
import QrReader from 'react-qr-reader';
import Q from 'q';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import {showLoading, hideLoading} from 'react-redux-loading-bar';

import Loading from '~/components/Loading';

import {addUsers} from '../UsersPage/actions';

import {loadAllAdminEvents} from '~/actions';

import {loadAllUsers, checkinUser} from '~/data/Api';

import {userCheckin} from './actions';

import {User as UserPropTypes, Event as EventPropType} from '~/proptypes';

class CheckinPage extends React.Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        eventAlias: PropTypes.string.isRequired
      }).isRequired
    }).isRequired,

    auth: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    users: PropTypes.arrayOf(PropTypes.shape(
      UserPropTypes
    ).isRequired).isRequired,
    event : PropTypes.shape(EventPropType),

    showLoading: PropTypes.func.isRequired,
    hideLoading: PropTypes.func.isRequired,
    addUsers: PropTypes.func.isRequired,
    loadAllAdminEvents: PropTypes.func.isRequired,
    userCheckin: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      isProcessing: false,
      wasSuccessful: false,
      errorMessage: '',
      isModalShowing: false,
      lastUser: '',
      lastName: '',
      nameApplicants: []
    };
  }

  componentWillMount() {
    let {users, event} = this.props;

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
    let {showLoading, hideLoading, addUsers} = this.props;

    showLoading();

    loadAllUsers(this.props.match.params.eventAlias)
      .then(res => {
        hideLoading();
        return addUsers(res);
      });
  }

  validateUser = (user) =>
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

  checkinById = (id) =>
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

  onScan = (data) => {
    if (data === null || this.state.isProcessing) {
      return;
    }

    if (data === this.state.lastUser) {
      return this.setState({errorMessage: 'User has already checked in', wasSuccessful: false});
    }

    this.setState({
      isProcessing: true,
      wasSuccessful: false,
      errorMessage: '',
      lastUser: data,
      lastName: ''
    });

    this.toggleModal(data);
  }

  nameApplicants = (event) => {
    let {users} = this.props;

    const name = event.target.value;
    if (name.length < 3) {
      return;
    }

    // Filter by given name
    let eligibleUsers = users.filter((user) =>
      (user.firstName + ' ' + user.lastName).indexOf(name) !== -1);
    this.setState({
      nameApplicants: eligibleUsers
    });
  }

  selectApplicant = (id) => {
    this.onScan(id);

    this.setState({
      nameApplicants: []
    });
  }

  toggleModal = () =>
    this.setState({
      isModalShowing: !this.state.isModalShowing
    });

  startCheckin = () => {
    this.setState({
      isModalShowing: false
    });

    this.checkinById(this.state.lastUser)
      .then((user) => {
        this.setState({
          wasSuccessful: true,
          lastName: user.firstName + ' ' + user.lastName
        });
      })
      .catch((err) => {
        this.setState({
          wasSuccessful: false,
          errorMessage: err
        });
      })
      .finally(() => this.setState({
        isProcessing: false
      }))
      .catch((err) => {
        this.setState({
          wasSuccessful : false,
          errorMessage : err
        });
      });
  }

  render() {
    let {users, event} = this.props;
    let {errorMessage, wasSuccessful, lastName, nameApplicants, isModalShowing}
      = this.state;

    const previewStyle = {
      maxWidth: '100%',
      maxHeight: '50vh',
      display: 'inline'
    };

    if (!users.length) {
      return (
        <Loading />
      );
    }

    return (

      <div className="full-height">
        <Modal isOpen={isModalShowing} toggle={this.toggleModal}
          className="modal-lg">
          <ModalHeader toggle={this.toggleModal}>Liability Waiver</ModalHeader>
          <ModalBody>
            <object width="100%" height="500px"
              data={event.checkinWaiver}></object>
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
              <input type="text" placeholder="Name" className="rounded-input"
                onChange={this.nameApplicants} />
              <ul className="checkin__list">
                {nameApplicants.map((app) => (
                  <li className="checkin__list-user" key={app._id}>
                    <button className="rounded-button rounded-button--small"
                      onClick={() => this.selectApplicant(app._id)}>
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

function mapStateToProps(state, ownProps) {
  return {
    auth: state.admin.auth,
    user: state.admin.auth.user,
    users: state.admin.users,
    event: state.admin.events[ownProps.match.params.eventAlias]
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
