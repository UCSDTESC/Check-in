import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router-dom';
import {showLoading, hideLoading} from 'react-redux-loading-bar';

import {loadAllEvents} from '~/actions';

import Loading from '~/components/Loading';

import OrganiserList from './components/OrganiserList';

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
    loadAllEvents: PropTypes.func.isRequired,
    event: PropTypes.shape(EventPropType)
  };

  componentDidMount() {
    if (!this.props.event) {
      showLoading();

      this.props.loadAllEvents()
      .catch(console.error)
      .finally(hideLoading);
    }
  };

  render() {
    let {event} = this.props;

    if (!event) {
      return (
        <Loading />
      );
    }

    return (
      <div className="page page--admin event-page d-flex flex-column h-100">
        <div className="container-fluid">
          <div className="row">
            <div className={'col-12 d-flex align-items-center' +
              ' event-page__header'}>
              <img className="event-page__logo" src={event.logo} />
              <h1 className="event-page__title">{event.name}</h1>
              <Link to={'/register/' + event.alias}>Go To Form</Link>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-4 col-md-6">
              <OrganiserList organisers={event.organisers} />
            </div>
            <div className="col-lg-4 col-md-6">
              <h2>Total Users</h2>
              <div>Information Currently Unavailable</div>
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
    loadAllEvents: bindActionCreators(loadAllEvents, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EventPage);
