import PropTypes from 'prop-types';
import React from 'react';
import {Link} from 'react-router-dom';
import {UncontrolledTooltip} from 'reactstrap';
import FA from 'react-fontawesome';

export default class ResumeStatistics extends React.Component {
  static propTypes = {
    event: PropTypes.object.isRequired,
    statistics: PropTypes.object
  };

  /**
   * Renders the tooltip that explains how to approve resumes.
   */
  renderHelpTooltip() {
    return (<span>
      <a href="#" id="resumesHelp">
        <FA name="question-circle" className="text-white" style={{fontSize: '1em'}} />
      </a>
      <UncontrolledTooltip target="resumesHelp" placement="bottom">
        This only accounts for users that have been sanitised and agree to share
        their resumes.
      </UncontrolledTooltip>
    </span>);
  }

  render() {
    let {event, statistics} = this.props;
    let resumes = statistics.resumes;

    return (
        <Link to={`/admin/resumes/${event.alias}`} 
          className="btn event-page__btn rounded-button rounded-button--small">
          {resumes} Available Resume{resumes === 1 ? ' ' : 's '} 
          {this.renderHelpTooltip()}
        </Link>
    );
  }
}
