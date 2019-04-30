import { TESCEvent } from '@Shared/ModelTypes';
import React from 'react';
import { connect } from 'react-redux';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { bindActionCreators } from 'redux';
import { loadAllPublicEvents, loadUserEvents, ApplicationDispatch } from '~/actions';
import Hero from '~/components/Hero';
import { ApplicationState } from '~/reducers';

import CurrentEvents from './components/CurrentEvents';
import UserEvents from './components/UserEvents';

const mapStateToProps = (state: ApplicationState) => {
  return {
    events: state.events,
    userEvents: state.user.events,
    authenticated: state.user.auth.authenticated,
  };
};

const mapDispatchToProps = (dispatch: ApplicationDispatch) => bindActionCreators({
  showLoading,
  hideLoading,
  loadAllPublicEvents,
  loadUserEvents,
}, dispatch);

interface HomePageProps {
}

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & HomePageProps;

class HomePage extends React.Component<Props> {
  componentDidMount() {
    this.props.showLoading();

    this.props.loadAllPublicEvents()
      .then(this.optionalLoadUserEvents)
      .catch(console.error)
      .finally(this.props.hideLoading);
  }

  /**
   * Ensures the user is authenticated before trying to load their events.
   */
  optionalLoadUserEvents = () => {
    if (this.props.authenticated) {
      return this.props.loadUserEvents();
    }
    return true;
  }

  userEvents(events: TESCEvent[]) {
    return (
      <div className="col-md-4">
        <UserEvents events={events} />
      </div>
    );
  }

  currentEvents(events: TESCEvent[], small: boolean = false) {
    return (
    <div className={small ? 'col-md-8' : 'col-12'}>
      <CurrentEvents events={events} />
    </div>
    );
  }

  render() {
    const {events, userEvents} = this.props;

    const showSidebar = Object.values(userEvents).length > 0;

    let currentEvents: TESCEvent[] = [];
    if (events) {
      const userEventNames = Object.values(userEvents).map(event => event.name);
      currentEvents = Object.values(events).filter(event =>
        new Date(event.closeTime) > new Date() &&
        userEventNames.indexOf(event.name) === -1
      );
    }

    return (
      <div className="page home-page">
        <Hero />
        <div className="home-page__contents container">
          <div className="row">
            {showSidebar && this.userEvents(Object.values(userEvents))}
            {this.currentEvents(currentEvents, showSidebar)}
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
