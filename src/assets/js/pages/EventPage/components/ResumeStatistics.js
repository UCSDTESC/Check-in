import PropTypes from 'prop-types';
import React from 'react';
import {Link} from 'react-router-dom';
import {UncontrolledTooltip} from 'reactstrap';
import FA from 'react-fontawesome';

export default class ResumeStatistics extends React.Component {
  static propTypes = {
    event: PropTypes.object.isRequired,
    statistics: PropTypes.object,
    className: PropTypes.string
  };

  /**
   * Renders the tooltip that explains how to approve resumes.
   */
  renderHelpTooltip() {
    return (<span>
      <span href="#" id="resumesHelp">
        <FA name="question-circle" className="text-white" style={{fontSize: '1em'}} />
      </span>
      <UncontrolledTooltip target="resumesHelp" placement="bottom">
        This only accounts for users that have been sanitised and agree to share
        their resumes.
      </UncontrolledTooltip>
    </span>);
  }

  render() {
    let {event, statistics, className} = this.props;
    let resumes = statistics.resumes;

    return (
      <Link to={`/admin/resumes/${event.alias}`}
        className={`btn event-page__btn rounded-button
          rounded-button--small pr-xl-4 ${className}`}>
        {resumes} Available Resume{resumes === 1 ? ' ' : 's '}
        <span className="rounded-button__right">
          {this.renderHelpTooltip()}
        </span>
      </Link>
    );
  }
}
