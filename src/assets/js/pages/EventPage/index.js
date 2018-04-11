import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router-dom';
import FA from 'react-fontawesome';
import {UncontrolledAlert} from 'reactstrap';
import {showLoading, hideLoading} from 'react-redux-loading-bar';

import {loadEventStatistics, exportUsers, bulkChange} from '~/data/Api';

import {loadAllAdminEvents} from '~/actions';

import Loading from '~/components/Loading';

import EventStatistics from './components/EventStatistics';
import OrganiserList from './components/OrganiserList';
import SponsorList from './components/SponsorList';
import BulkChange from './components/BulkChange';
import CheckinStatistics from './components/CheckinStatistics';
import ResumeStatistics from './components/ResumeStatistics';

import {Event as EventPropType} from '~/proptypes';

class EventPage extends React.Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        eventAlias: PropTypes.string.isRequired
      }).isRequired
    }).isRequired,

    showLoading: PropTypes.func.isRequired,
    hideLoading: PropTypes.func.isRequired,
    loadAllAdminEvents: PropTypes.func.isRequired,
    event: PropTypes.shape(EventPropType)
  };

  constructor(props) {
    super(props);

    this.state = {
      statistics: {},
      alerts: []
    };
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

  componentWillMount() {
    loadEventStatistics(this.props.match.params.eventAlias)
      .catch(console.error)
      .then(res => {
        this.setState({
          statistics: res
        });
      });

    if (!this.props.event) {
      showLoading();

      this.props.loadAllAdminEvents()
        .catch(console.error)
        .finally(hideLoading);
    }
  };

  exportUsers = () => {
    let eventAlias = this.props.match.params.eventAlias;
    exportUsers(eventAlias)
      .end((err, res) => {
        // Download as file
        var blob = new Blob([res.text], {type: 'text/csv;charset=utf-8;'});
        var url = URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.href=url;
        link.setAttribute('download', `${eventAlias}-${Date.now()}.csv`);
        document.body.appendChild(link);

        link.click();
      });
  }

  onBulkChange = (values) => {
    let {users, status} = values;

    bulkChange(users, status)
      .then(() => {
        this.createAlert('Successfully updated users!', 'success',
          'Bulk Change');
      })
      .catch((err) => {
        this.createAlert(err.message, 'danger', 'Bulk Change');
        console.error(err);
      });
  };

  render() {
    let {event} = this.props;
    let {statistics, alerts} = this.state;

    if (!event) {
      return (
        <Loading />
      );
    }

    return (
      <div className="page page--admin event-page d-flex flex-column h-100">
        <div className="event-page__above">
          {alerts.map(({message, type, title}, i) =>
            this.renderAlert(message, type, title, i))}
        </div>
        <div className="container-fluid">
          <div className="row">
            <div className={'col-12 d-flex align-items-center' +
              ' event-page__header'}>
              <img className="event-page__logo" src={event.logo} />
              <h1 className="event-page__title">{event.name}</h1>
              <Link to={`/register/${event.alias}`}>Go To Form&nbsp;
                <FA name='arrow-right' />
              </Link>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-4 col-md-6">
              <OrganiserList organisers={event.organisers} />
              <SponsorList sponsors={event.sponsors} />
            </div>
            <div className="col-lg-4 col-md-6">
              <EventStatistics event={event} statistics={statistics}
                exportUsers={this.exportUsers}/>
            </div>
            <div className="col-lg-4 col-md-6">
              <CheckinStatistics event={event} statistics={statistics} />
              <ResumeStatistics event={event} statistics={statistics} />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-4 col-md-6">
              <BulkChange onSubmit={this.onBulkChange} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  event: state.admin.events[ownProps.match.params.eventAlias]
});

function mapDispatchToProps(dispatch) {
  return {
    showLoading: bindActionCreators(showLoading, dispatch),
    hideLoading: bindActionCreators(hideLoading, dispatch),
    loadAllAdminEvents: bindActionCreators(loadAllAdminEvents, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EventPage);
