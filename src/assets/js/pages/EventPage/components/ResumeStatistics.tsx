import PropTypes from 'prop-types';
import React from 'react';
import {Link} from 'react-router-dom';
import {UncontrolledTooltip} from 'reactstrap';
import FA from 'react-fontawesome';
import EventStatisticsComponent from './EventStatisticsComponent';

interface ResumeStatisticsProps {
  className: string;
}

export default class ResumeStatistics extends EventStatisticsComponent<ResumeStatisticsProps> {
  /**
   * Renders the tooltip that explains how to approve resumes.
   */
  renderHelpTooltip() {
    return (
    <span>
      <span
        id="resumesHelp"
      >
        <FA
          name="question-circle"
          className="text-white"
          style={{fontSize: '1em'}}
        />
      </span>
      <UncontrolledTooltip target="resumesHelp" placement="bottom">
        This only accounts for users that have been sanitised and agree to share
        their resumes.
      </UncontrolledTooltip>
    </span>
    );
  }

  render() {
    const {event, statistics, className} = this.props;
    const resumes = statistics.resumes;

    return (
      <Link
        to={`/admin/resumes/${event.alias}`}
        className={`btn event-page__btn rounded-button rounded-button--small pr-xl-4 ${className}`}
      >
        {resumes} Available Resume{resumes === 1 ? ' ' : 's '}
        <span className="rounded-button__right">
          {this.renderHelpTooltip()}
        </span>
      </Link>
    );
  }
}
