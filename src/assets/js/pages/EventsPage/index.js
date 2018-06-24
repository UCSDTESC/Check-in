import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router-dom';
import FA from 'react-fontawesome';
import {UncontrolledAlert} from 'reactstrap';
import {showLoading, hideLoading} from 'react-redux-loading-bar';

import { loadAllUserEvents } from './actions';

import NavHeader from '~/components/NavHeader.js';
import List from './components/List'

import Loading from '~/components/Loading';

class EventsPage extends React.Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
      }).isRequired
    }).isRequired,

    showLoading: PropTypes.func.isRequired,
    hideLoading: PropTypes.func.isRequired,
    loadAllUserEvents: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      events: [],
    };
  }

  componentWillMount() {
    this.props.loadAllUserEvents();
  };

  render() {
    let {events} = this.props;

    return (
      <div>
        <NavHeader />
        <div className="container">
          <List events={Object.values(events)} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    events: state.user.events
  }
};

function mapDispatchToProps(dispatch) {
  return {
    showLoading: bindActionCreators(showLoading, dispatch),
    hideLoading: bindActionCreators(hideLoading, dispatch),
    loadAllUserEvents: bindActionCreators(loadAllUserEvents, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EventsPage);
