import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router-dom';
import FA from 'react-fontawesome';
import {Alert, Nav, NavItem, NavLink} from 'reactstrap';
import {showLoading, hideLoading} from 'react-redux-loading-bar';

import {loadEventStatistics} from '~/data/Api';

import {loadAllAdminEvents} from '~/actions';

import {addEventAlert, removeEventAlert,
  updateEventStatistics} from './actions';

import Loading from '~/components/Loading';

import CheckinStatistics from './components/CheckinStatistics';
import ResumeStatistics from './components/ResumeStatistics';
import ActionsTab from './tabs/ActionsTab';
import InsightsTab from './tabs/InsightsTab';
import StatisticsTab from './tabs/StatisticsTab';
import AdministratorsTab from './tabs/AdministratorsTab';
import SettingsTab from './tabs/SettingsTab';

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
    updateEventStatistics: PropTypes.func.isRequired,
    addEventAlert: PropTypes.func.isRequired,
    removeEventAlert: PropTypes.func.isRequired,

    event: PropTypes.shape(EventPropType),
    statistics: PropTypes.object,
    alerts: PropTypes.array
  };

  constructor(props) {
    super(props);

    // List of possible tabs
    this.tabPages = [
      {
        icon: 'wrench',
        name: 'Actions',
        anchor: 'actions',
        render: this.renderActions
      },
      // Left blank until content is added.
      // {
      //   icon: 'pie-chart',
      //   name: 'Insights',
      //   anchor: 'insights',
      //   render: this.renderInsights
      // },
      {
        icon: 'bar-chart',
        name: 'Statistics',
        anchor: 'statistics',
        render: this.renderStatistics
      },
      {
        icon: 'star',
        name: 'Administrators',
        anchor: 'administrators',
        render: this.renderAdministrators
      },
      {
        icon: 'cog',
        name: 'Settings',
        anchor: 'settings',
        render: this.renderSettings
      }
    ];

    this.state = {
      activeTab: this.tabPages[0]
    };
  }

  componentDidUpdate() {
    this.changeTab();
  };

  /**
   * Changes the tab based on the URL hash.
   */
  changeTab = () => {
    let hash = window.location.hash;

    if (hash.length === 0) {
      return;
    }

    const {activeTab} = this.state;
    hash = hash.substring(1);

    if (hash !== activeTab.anchor) {
      let matchingTab = this.tabPages.find((page) => page.anchor === hash);
      if (matchingTab === undefined) {
        return;
      }
      this.setState({activeTab: matchingTab});
    }
  };

  /**
   * Renders the alerts for the current event.
   * @param {String} message The message to display in the alert.
   * @param {String} severity The severity of alert to show.
   * @param {String} title The title of the alert.
   * @param {String} timestamp The given timestamp for this alert.
   * @returns {Component}
   */
  renderAlert(message, severity='danger', title, timestamp) {
    if (message) {
      return (
        <div className="user-page__error" key={timestamp}>
          <Alert color={severity}
            toggle={() => this.dismissAlert(timestamp)}
            key={timestamp} >
            <div className="container">
              <strong>{title}</strong> {message}
            </div>
          </Alert>
        </div>
      );
    }
  }

  /**
   * Dismisses a visible alert and removes from redux store.
   * @param {Integer} timestamp The timestamp key associated with the alert.
   */
  dismissAlert = (timestamp) => {
    let {event, removeEventAlert} = this.props;
    removeEventAlert(event.alias, timestamp);
  };

  componentDidMount() {
    this.changeTab();
    loadEventStatistics(this.props.match.params.eventAlias)
      .catch(console.error)
      .then(res => {
        this.props.updateEventStatistics(this.props.match.params.eventAlias,
          res);
      });

    if (!this.props.event) {
      showLoading();

      this.props.loadAllAdminEvents()
        .catch(console.error)
        .finally(hideLoading);
    }
  };

  /**
   * Renders the event tab for actions.
   * @returns {Component} The action tab.
   */
  renderActions(props) {
    return (<ActionsTab {...props} />);
  }

  /**
   * Renders the event tab for insights.
   * @returns {Component} The insights tab.
   */
  renderInsights(props) {
    return (<InsightsTab {...props} />);
  }

  /**
   * Renders the event tab for statistics.
   * @returns {Component} The statistics tab.
   */
  renderStatistics(props) {
    return (<StatisticsTab {...props} />);
  }

  /**
   * Renders the event tab for administrators.
   * @returns {Component} The administrators tab.
   */
  renderAdministrators(props) {
    return (<AdministratorsTab {...props} />);
  }

  /**
   * Renders the event tab for settings.
   * @returns {Component} The settings tab.
   */
  renderSettings(props) {
    return (<SettingsTab {...props} />);
  }

  render() {
    let {event, statistics, alerts} = this.props;
    let {activeTab} = this.state;

    if (!event) {
      return (
        <Loading />
      );
    }

    return (
      <div className="page page--admin event-page d-flex flex-column h-100">
        <div className="event-page__above">
          {alerts.map(({message, severity, title, timestamp}) =>
            this.renderAlert(message, severity, title, timestamp))}
        </div>
        <div className="container-fluid">
          <div className="row event-page__header">
            <div className={`col-6 col-xl-auto d-flex flex-column flex-xl-row
              align-items-center justify-content-center`}>
              <img className="event-page__logo" src={event.logo.url} />
              <a target="_blank" rel="noopener noreferrer"
                href={event.homepage}>
                <h1 className="event-page__title">{event.name}</h1>
              </a>
            </div>
            <div className={`col-6 col-xl-auto ml-auto d-flex flex-column
              flex-xl-row align-items-center justify-content-center`}>
              <Link to={`/admin/users/${event.alias}`} className={`btn
                event-page__btn rounded-button rounded-button--small
                d-none d-md-block`}>
                View All Users
              </Link>

              <CheckinStatistics event={event} statistics={statistics}/>
              <ResumeStatistics event={event} statistics={statistics}
                className="d-none d-md-block" />

              <Link to={`/register/${event.alias}`} className={`btn
                event-page__btn rounded-button rounded-button--small
                rounded-button--arrow`}>
                Go To Form
              </Link>
            </div>
          </div>

          <div className="row event-tab__container">
            <div className="col">
              <Nav tabs className="event-tab__tabs">
                {this.tabPages.map((page) => (
                  <NavItem key={page.anchor} className="event-tab__nav">
                    <NavLink href={`#${page.anchor}`}
                      className="event-tab__link"
                      active={page === activeTab}>
                      <FA name={page.icon}
                        className="event-tab__icon" /> {page.name}
                    </NavLink>
                  </NavItem>
                ))}
              </Nav>
            </div>
          </div>

          {activeTab.render(this.props)}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const eventAlias = ownProps.match.params.eventAlias;
  return {
    event: state.admin.events[eventAlias],
    statistics: eventAlias in state.admin.eventStatistics ?
      state.admin.eventStatistics[eventAlias] : {},
    alerts: eventAlias in state.admin.eventAlerts ?
      state.admin.eventAlerts[eventAlias] : []
  };
};

function mapDispatchToProps(dispatch) {
  return {
    showLoading: bindActionCreators(showLoading, dispatch),
    hideLoading: bindActionCreators(hideLoading, dispatch),
    loadAllAdminEvents: bindActionCreators(loadAllAdminEvents, dispatch),
    updateEventStatistics: bindActionCreators(updateEventStatistics, dispatch),
    addEventAlert: bindActionCreators(addEventAlert, dispatch),
    removeEventAlert: bindActionCreators(removeEventAlert, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EventPage);
