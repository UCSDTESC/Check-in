import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {showLoading, hideLoading} from 'react-redux-loading-bar';

import NavHeader from '~/components/NavHeader';
import Form from './components/Form';
import Loading from '~/components/Loading';

import {loadResumeEvent} from '~/actions';

class DropFormPage extends React.Component {
  static propTypes = {
    event: PropTypes.array.isRequired,
    match: PropTypes.object.isRequired,
    loadResumeEvent: PropTypes.func.isRequired,
    showLoading: PropTypes.func.isRequired,
    hideLoading: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      event: {},
      error: '',
      success: ''
    };
  }

  componentWillMount() {
    this.props.showLoading();

    this.props.loadResumeEvent(this.props.match.params.eventAlias)
      .catch(console.error)
      .finally(this.props.hideLoading);
  }

  render() {

    if (!this.props.event) {
      return (<Loading />)
    }

    let event = this.props.event[0];

    return (
      <div>
        <NavHeader />
        <div className="container">
          <div className="col-12">
            <Form event={event} />
          </div>
        </div>
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    event: state.events.drop
  };
};

function mapDispatchToProps(dispatch) {
  return {
    showLoading: bindActionCreators(showLoading, dispatch),
    hideLoading: bindActionCreators(hideLoading, dispatch),
    loadResumeEvent: bindActionCreators(loadResumeEvent, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DropFormPage);
