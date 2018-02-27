import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router-dom';
import FA from 'react-fontawesome';
import {showLoading, hideLoading} from 'react-redux-loading-bar';

import {loadEventStatistics} from '~/data/Api';

import {loadAllAdminEvents} from '~/actions';

import Loading from '~/components/Loading';

import OrganiserList from './components/OrganiserList';
import EventStatistics from './components/EventStatistics';

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
      statistics: {}
    };
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

  render() {
    let {event} = this.props;
    let {statistics} = this.state;

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
              <Link to={`/register/${event.alias}`}>Go To Form&nbsp;
                <FA name='arrow-right' />
              </Link>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-4 col-md-6">
              <OrganiserList organisers={event.organisers} />
            </div>
            <div className="col-lg-4 col-md-6">
              <EventStatistics event={event} statistics={statistics} />
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
