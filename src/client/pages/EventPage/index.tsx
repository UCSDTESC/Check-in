import { TESCTeam } from '@Shared/ModelTypes';
import React from 'react';
import FA from 'react-fontawesome';
import { connect } from 'react-redux';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { UncontrolledTooltip } from 'reactstrap';
import { bindActionCreators } from 'redux';
import { loadAllAdminEvents, ApplicationDispatch, loadAvailableColumns } from '~/actions';
import Loading from '~/components/Loading';
import { loadEventStatistics, loadAllTeams, editExistingEvent } from '~/data/AdminApi';
import { ApplicationState } from '~/reducers';

import EventForm, { EventFormData } from '../../components/EventForm';
import createValidator from '../NewEventPage/validate';
import TabularPage, { TabularPageState, TabularPageProps, TabPage, TabularPageNav } from '../TabularPage';

import {
  addEventAlert, removeEventAlert, updateEventStatistics, addEventSuccessAlert,
  addEventDangerAlert
} from './actions';
import CheckinStatistics from './components/CheckinStatistics';
import ResumeStatistics from './components/ResumeStatistics';
import ViewApplication from './components/ViewApplication';
import ActionsTab from './tabs/ActionsTab';
import AdministratorsTab from './tabs/AdministratorsTab';
import SettingsTab from './tabs/SettingsTab';
import StatisticsTab from './tabs/StatisticsTab';
import TeamsTab from './tabs/TeamsTab';

type RouteProps = RouteComponentProps<{

  // The eventAlias for the event we want to render the dashboard for
  eventAlias: string;
}>;

const mapStateToProps = (state: ApplicationState, ownProps: RouteProps) => {
  const eventAlias = ownProps.match.params.eventAlias;
  return {
    columns: state.admin.availableColumns,
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
  loadAvailableColumns,
  updateEventStatistics,
  addEventAlert,
  removeEventAlert,
  addEventSuccessAlert,
  addEventDangerAlert,
}, dispatch);

interface EventPageProps extends TabularPageProps {
}

/**
 * This component receives props in 3 ways -
 * 1) The explicit props provied to it by EventPageProps
 * 2) The redux state provided to it by mapStateToProps
 * 3) The dispatch functions provided to it by mapDispatchToProps
 *
 * So, the props of this component is the union of the return types of mapStateToProps,
 * mapDispatchToProps and EventPageProps
 */
export type Props = RouteProps & ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> & EventPageProps;

interface EventPageState extends TabularPageState {
  teams: TESCTeam[];
}

/**
 * This page renders the main page for an event.
 * It has tabs and links to the other pages related to this event.
 *
 * This component is extending from TabularPage, which has the tabbing functionality abstracted away
 */
class EventPage extends TabularPage<Props, EventPageState> {
  tabPages: Readonly<TabPage[]> = [
    {
      icon: 'wrench',
      name: 'Actions',
      anchor: 'actions',
      render: this.renderActions.bind(this),
    } as TabPage,
    {
      icon: 'bar-chart',
      name: 'Statistics',
      anchor: 'statistics',
      render: this.renderStatistics.bind(this),
    } as TabPage,
    {
      icon: 'users',
      name: 'Teams',
      anchor: 'teams',
      render: this.renderTeams.bind(this),
      onTabOpen: () => this.loadTeams(),
      onTabClose: () => this.setState({ teams: [] }),
    },
    {
      icon: 'star',
      name: 'Administrators',
      anchor: 'administrators',
      render: this.renderAdministrators.bind(this),
    } as TabPage,
    {
      icon: 'edit',
      name: 'Edit',
      anchor: 'edit',
      render: this.renderEditForm.bind(this),
    } as TabPage,
    {
      icon: 'cog',
      name: 'Settings',
      anchor: 'settings',
      render: this.renderSettings.bind(this),
    } as TabPage,
  ];

  state: Readonly<EventPageState> = {
    activeTab: this.tabPages[0],
    alerts: [],
    teams: [],
  };

  static getDerivedStateFromProps(props: Props, state: EventPageState) {
    if (props.alerts !== state.alerts) {
      return {
        alerts: props.alerts,
      };
    }
  }

  /**
   * Dismisses a visible alert and removes from redux store.
   * @param {Date} timestamp The timestamp key associated with the alert.
   */
  dismissAlert = (timestamp: Date) => {
    const { event, removeEventAlert } = this.props;
    removeEventAlert(event.alias, timestamp);
  };

  componentDidMount() {
    super.componentDidMount();
    const { columns } = this.props;
    const { eventAlias } = this.props.match.params;

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

    if (Object.keys(columns).length === 0) {
      this.props.loadAvailableColumns();
    }
  }

  /**
   * Loads all the teams for the current event into the state.
   */
  loadTeams = () => {
    const { event } = this.props;
    if (!event) {
      // Force load event again
      this.props.loadAllAdminEvents()
        .then(this.loadTeams);
      return;
    }

    return loadAllTeams(event._id)
      .then(teams => {
        this.setState({ teams: teams });
      });
  }

  /**
   * Renders the event tab for actions.
   * @returns {Component} The action tab.
   */
  renderActions() {
    return (<ActionsTab {...this.props} />);
  }

  /**
   * Renders the event tab for statistics.
   * @returns {Component} The statistics tab.
   */
  renderStatistics() {
    return (<StatisticsTab {...this.props} />);
  }

  /**
   * Renders the event tab for editing teams.
   * @returns {Component} The teams tab.
   */
  renderTeams() {
    const { teams } = this.state;

    return (<TeamsTab onTeamsUpdate={() => this.loadTeams()} teams={teams} {...this.props} />);
  }

  /**
   * Renders the event tab for administrators.
   * @returns {Component} The administrators tab.
   */
  renderAdministrators() {
    return (<AdministratorsTab {...this.props} />);
  }

  /**
   * Renders the event tab for settings.
   * @returns {Component} The settings tab.
   */
  renderSettings() {
    return (<SettingsTab {...this.props} />);
  }

  /**
   * Renders the event tab for editing the event.
   * @returns {Component} The edit tab
   */
  renderEditForm() {
    const validator = createValidator(false, true);
    const eventDate = new Date(this.props.event.closeTime);
    const initialValues: Partial<EventFormData> = {
      ...this.props.event,
      closeTimeDay: eventDate.getDate(),
      closeTimeMonth: eventDate.getMonth(),
      closeTimeYear: eventDate.getFullYear(),
      logo: undefined,
    };

    const editEvent = async (eventData: EventFormData) => {
      try {
        await editExistingEvent(this.props.event._id, eventData);
        this.props.addEventSuccessAlert(eventData.alias, `Successfully edited ${eventData.name}`, 'Edit Event');
        await this.props.loadAllAdminEvents();
        if (eventData.alias !== this.props.match.params.eventAlias) {
          this.props.history.replace(`/admin/events/${eventData.alias}#edit`);
        }
      } catch (e) {
        this.props.addEventDangerAlert(eventData.alias, e.message, 'Edit Event');
      }
    };

    return (
        <div className="sd-form event-page__edit-form">
          <EventForm
            editing={true}
            validate={validator}
            onSubmit={editEvent}
            initialValues={initialValues}
          />
        </div>
    );
  }

  render() {
    const { event, statistics, alerts } = this.props;
    const { activeTab } = this.state;
    if (!event || !statistics) {
      return (
        <Loading title="Event" />
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
                <h3 className="event-page__description">{event.description}</h3>
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

              <CheckinStatistics event={event} statistics={statistics} />
              <ResumeStatistics
                event={event}
                statistics={statistics}
                className="d-none d-md-block"
              />

              <ViewApplication event={event} />
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

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(EventPage)
);
