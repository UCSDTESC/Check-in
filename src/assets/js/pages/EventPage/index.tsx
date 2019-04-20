import React from 'react';
import FA from 'react-fontawesome';
import { connect } from 'react-redux';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Alert, Nav, NavItem, NavLink, UncontrolledTooltip } from 'reactstrap';
import { bindActionCreators, AnyAction } from 'redux';
import { loadAllAdminEvents, ApplicationDispatch } from '~/actions';
import Loading from '~/components/Loading';
import { loadEventStatistics } from '~/data/Api';
import { ApplicationState } from '~/reducers';

import TabularPage, { TabularPageState, TabularPageProps, TabPage, TabularPageNav } from '../TabularPage';

import { addEventAlert, removeEventAlert, updateEventStatistics, addEventSuccessAlert,
  addEventDangerAlert } from './actions';
import CheckinStatistics from './components/CheckinStatistics';
import ResumeStatistics from './components/ResumeStatistics';
import ActionsTab from './tabs/ActionsTab';
import AdministratorsTab from './tabs/AdministratorsTab';
import SettingsTab from './tabs/SettingsTab';
import StatisticsTab from './tabs/StatisticsTab';

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
      state.admin.eventAlerts[eventAlias] : [],
  };
};

const mapDispatchToProps = (dispatch: ApplicationDispatch) => bindActionCreators({
  showLoading,
  hideLoading,
  loadAllAdminEvents,
  updateEventStatistics,
  addEventAlert,
  removeEventAlert,
  addEventSuccessAlert,
  addEventDangerAlert,
}, dispatch);

interface EventPageProps extends TabularPageProps {
}

export type Props = RouteProps & ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> & EventPageProps;

interface EventPageState extends TabularPageState {
}

class EventPage extends TabularPage<Props, EventPageState> {
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
    alerts: [],
  };

  /**
   * Dismisses a visible alert and removes from redux store.
   * @param {Date} timestamp The timestamp key associated with the alert.
   */
  dismissAlert = (timestamp: Date) => {
    const {event, removeEventAlert} = this.props;
    removeEventAlert(event.alias, timestamp);
  };

  componentDidMount() {
    super.componentDidMount();
    const {eventAlias} = this.props.match.params;

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
        {this.renderAlerts()}

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

          <TabularPageNav
            tabPages={this.tabPages}
            activeTab={activeTab}
          >
            {isThirdParty &&
            <div className="ml-auto event-page__third-party my-auto">
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
          </TabularPageNav>

          {this.renderActiveTab()}
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventPage);
