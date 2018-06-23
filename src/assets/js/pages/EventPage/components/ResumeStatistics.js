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
        <FA name="question-circle" style={{fontSize: '0.6em'}} />
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
      <div className="resume-statistics">
        <h2>Resumes{' '}
          {this.renderHelpTooltip()}
        </h2>
        <h3>{resumes} Available Resume{resumes === 1 ? '' : 's'}</h3>
        <Link to={`/admin/resumes/${event.alias}`}>View Resumes</Link>
      </div>
    );
  }
}
