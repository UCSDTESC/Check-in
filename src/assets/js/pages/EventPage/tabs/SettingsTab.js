import PropTypes from 'prop-types';
import React from 'react';

import {updateOptions, addCustomQuestion, updateCustomQuestion,
  deleteCustomQuestion} from '~/data/Api';

import EventOptions from '../components/EventOptions';
import CustomQuestions from '../components/CustomQuestions';

import {Event as EventPropType} from '~/proptypes';

export default class ActionsTab extends React.Component {
  static propTypes = {
    event: PropTypes.shape(EventPropType).isRequired,
    addEventAlert: PropTypes.func.isRequired,
    loadAllAdminEvents: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      customQuestionsRequests: 0
    };
  };

  /**
   * Handles the EventOptions callback for when options should be updated.
   * @param {Object} options The new options to send to the server.
   */
  onOptionsUpdate = (options) => {
    let {event, addEventAlert} = this.props;

    updateOptions(event.alias, options)
      .then(() => {
        addEventAlert(event.alias, 'Successfully updated options!', 'success',
          'Event Options');
      })
      .catch((err) => {
        addEventAlert(event.alias, err.message, 'danger', 'Event Options');
        console.error(err);
      });
  };

  startCustomQuestionsLoading = () => {
    this.setState({
      customQuestionsRequests: this.state.customQuestionsRequests + 1
    });
  };

  stopCustomQuestionsLoading = () => {
    this.setState({
      customQuestionsRequests: this.state.customQuestionsRequests - 1
    });
  };

  onAddCustomQuestion = (type, question) => {
    const {event, loadAllAdminEvents} = this.props;

    this.startCustomQuestionsLoading();

    addCustomQuestion(event.alias, question, type)
      .then(loadAllAdminEvents)
      .catch((err) => {
        addEventAlert(event.alias, err.message, 'danger',
          'Adding Custom Question');
        console.error(err);
      })
      .finally(this.stopCustomQuestionsLoading);
  };

  onUpdateCustomQuestion = (question) => {
    const {event, loadAllAdminEvents} = this.props;

    this.startCustomQuestionsLoading();

    updateCustomQuestion(event.alias, question)
      .then(loadAllAdminEvents)
      .catch((err) => {
        addEventAlert(event.alias, err.message, 'danger',
          'Adding Custom Question');
        console.error(err);
      })
      .finally(this.stopCustomQuestionsLoading);
  };

  onDeleteCustomQuestion = (type, question) => {
    const {event, loadAllAdminEvents} = this.props;

    this.startCustomQuestionsLoading();

    deleteCustomQuestion(event.alias, question, type)
      .then(loadAllAdminEvents)
      .catch((err) => {
        addEventAlert(event.alias, err.message, 'danger',
          'Adding Custom Question');
        console.error(err);
      })
      .finally(this.stopCustomQuestionsLoading);
  };

  render() {
    let {event} = this.props;
    const {customQuestionsRequests} = this.state;

    return (
      <div className="event-tab">
        <div className="row">
          <div className="col-lg-5 col-md-5">
            <EventOptions options={event.options}
              onOptionsUpdate={this.onOptionsUpdate} />
          </div>
          <div className="col-lg-6 col-md-6 offset-md-1 offset-lg-1">
            <CustomQuestions
              onAddCustomQuestion={this.onAddCustomQuestion}
              onUpdateCustomQuestion={this.onUpdateCustomQuestion}
              onDeleteCustomQuestion={this.onDeleteCustomQuestion}
              customQuestions={event.customQuestions}
              isLoading={customQuestionsRequests !== 0} />
          </div>
        </div>
      </div>
    );
  }
}
