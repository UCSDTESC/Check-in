import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators, AnyAction} from 'redux';
import {Link, RouteComponentProps} from 'react-router-dom';
import FA from 'react-fontawesome';
import {Alert, Nav, NavItem, NavLink, UncontrolledTooltip} from 'reactstrap';
import {showLoading, hideLoading} from 'react-redux-loading-bar';

import {loadEventStatistics} from '~/data/Api';

import {loadAllAdminEvents, ApplicationDispatch} from '~/actions';

import {addEventAlert, removeEventAlert, updateEventStatistics, addEventSuccessAlert,
  addEventDangerAlert} from './actions';

import Loading from '~/components/Loading';

import CheckinStatistics from './components/CheckinStatistics';
import ResumeStatistics from './components/ResumeStatistics';
import ActionsTab from './tabs/ActionsTab';
import StatisticsTab from './tabs/StatisticsTab';
import AdministratorsTab from './tabs/AdministratorsTab';
import SettingsTab from './tabs/SettingsTab';

import { ApplicationState } from '~/reducers';
import { EventAlert } from './reducers/types';

type RouteProps = RouteComponentProps<{
  eventAlias: string;
}>;

const mapStateToProps = (state: ApplicationState, ownProps: RouteProps) => {
  const eventAlias = ownProps.match.params.eventAlias;
  return {
    event: state.admin.events[eventAlias],
    statistics: eventAlias in state.admin.eventStatistics ?
      state.admin.eventStatistics[eventAlias] : null,
    alerts: eventAlias in state.admin.eventAlerts ?
      state.admin.eventAlerts[eventAlias] : [] as EventAlert[],
  };
};

const mapDispatchToProps = (dispatch: ApplicationDispatch) =>
  bindActionCreators({
    showLoading,
    hideLoading,
    loadAllAdminEvents,
    updateEventStatistics,
    addEventAlert,
    removeEventAlert,
    addEventSuccessAlert,
    addEventDangerAlert,
  }, dispatch);

interface EventPageProps {
}

export type Props = RouteProps & ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> & EventPageProps;

interface TabPage {
  icon: string;
  name: string;
  anchor: string;
  render: (props: Props) => JSX.Element;
}

interface EventPageState {
  activeTab: TabPage;
}

class EventPage extends React.Component<Props, EventPageState> {
  tabPages: Readonly<TabPage[]> = [
    {
      icon: 'wrench',
      name: 'Actions',
      anchor: 'actions',
      render: this.renderActions,
    } as TabPage,
    {
      icon: 'bar-chart',
      name: 'Statistics',
      anchor: 'statistics',
      render: this.renderStatistics,
    } as TabPage,
    {
      icon: 'star',
      name: 'Administrators',
      anchor: 'administrators',
      render: this.renderAdministrators,
    } as TabPage,
    {
      icon: 'cog',
      name: 'Settings',
      anchor: 'settings',
      render: this.renderSettings,
    } as TabPage,
  ];

  state: Readonly<EventPageState> = {
    activeTab: this.tabPages[0],
  };

  componentDidUpdate() {
    this.changeTab();
  }

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
      const matchingTab = this.tabPages.find((page) => page.anchor === hash);
      if (matchingTab === undefined) {
        return;
      }
      this.setState({activeTab: matchingTab});
    }
  };

  /**
   * Renders the alerts for the current event.
   * @param {EventAlert} alert The alert to render.
   * @returns {Component}
   */
  renderAlert = (alert: EventAlert) => {
    const {message, severity, title, timestamp} = alert;
    if (message) {
      return (
        <div className="event-page__error" key={timestamp.toString()}>
          <Alert
            color={severity}
            toggle={() => this.dismissAlert(timestamp)}
            key={timestamp.toString()}
          >
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
   * @param {Date} timestamp The timestamp key associated with the alert.
   */
  dismissAlert = (timestamp: Date) => {
    const {event, removeEventAlert} = this.props;
    removeEventAlert(event.alias, timestamp);
  };

  componentDidMount() {
    const {eventAlias} = this.props.match.params;

    this.changeTab();
    loadEventStatistics(eventAlias)
      .then(res => {
        this.props.updateEventStatistics(eventAlias, res);
      })
      .catch(console.error);

    if (!this.props.event) {
      showLoading();

      this.props.loadAllAdminEvents()
        .catch(console.error)
        .finally(hideLoading);
    }
  }

  /**
   * Renders the event tab for actions.
   * @returns {Component} The action tab.
   */
  renderActions(props: Props) {
    return (<ActionsTab {...props} />);
  }

  /**
   * Renders the event tab for statistics.
   * @returns {Component} The statistics tab.
   */
  renderStatistics(props: Props) {
    return (<StatisticsTab {...props} />);
  }

  /**
   * Renders the event tab for administrators.
   * @returns {Component} The administrators tab.
   */
  renderAdministrators(props: Props) {
    return (<AdministratorsTab {...props} />);
  }

  /**
   * Renders the event tab for settings.
   * @returns {Component} The settings tab.
   */
  renderSettings(props: Props) {
    return (<SettingsTab {...props} />);
  }

  render() {
    const {event, statistics, alerts} = this.props;
    const {activeTab} = this.state;
    if (!event || !statistics) {
      return (
        <Loading />
      );
    }

    const isThirdParty = !!event.thirdPartyText;

    return (
      <div className="page page--admin event-page d-flex flex-column h-100">
        <div className="event-page__above">
          {alerts.map(this.renderAlert)}
        </div>
        <div className="container-fluid">
          <div className="row event-page__header">
            <div
              className={`col-6 col-xl-auto d-flex flex-column flex-xl-row
              align-items-center justify-content-center`}
            >
              <img className="event-page__logo" src={event.logo.url} />
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={event.homepage}
              >
                <h1 className="event-page__title">{event.name}</h1>
              </a>
            </div>
            <div
              className={`col-6 col-xl-auto ml-auto d-flex flex-column
              flex-xl-row align-items-center justify-content-center`}
            >
              <Link
                to={`/admin/users/${event.alias}`}
                className={`btn event-page__btn rounded-button
                rounded-button--small d-none d-md-block`}
              >
                View All Users
              </Link>

              <CheckinStatistics event={event} statistics={statistics}/>
              <ResumeStatistics
                event={event}
                statistics={statistics}
                className="d-none d-md-block"
              />

              <Link
                to={`/register/${event.alias}`}
                className={`btn event-page__btn rounded-button
                rounded-button--small rounded-button--arrow`}
              >
                Go To Form
              </Link>
            </div>
          </div>

          <div className="row event-tab__container">
            <div className="col-12 col-lg">
              <Nav tabs={true} className="event-tab__tabs">
                {this.tabPages.map((page) => (
                  <NavItem key={page.anchor} className="event-tab__nav">
                    <NavLink
                      href={`#${page.anchor}`}
                      className="event-tab__link"
                      active={page === activeTab}
                    >
                      <FA
                        name={page.icon}
                        className="event-tab__icon"
                      /> {page.name}
                    </NavLink>
                  </NavItem>
                ))}
              </Nav>
            </div>
            <div className="order-first order-lg-last col-auto">
              {isThirdParty &&
              <div className="ml-auto event-tab__alert my-auto">
                    Third Party Event
                <span className="m-2">
                  <FA name="question-circle" id={'ThirdPartyTooltip'} />
                  <UncontrolledTooltip
                    placement="right"
                    target={'ThirdPartyTooltip'}
                  >
                    This event is not run by TESC.
                  </UncontrolledTooltip>
                </span>
              </div>}
            </div>
          </div>

          {activeTab.render(this.props)}
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventPage);
