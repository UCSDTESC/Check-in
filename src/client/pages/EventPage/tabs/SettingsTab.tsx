import { TESCEventOptions, Question } from '@Shared/ModelTypes';
import { QuestionType } from '@Shared/Questions';
import React from 'react';
import {
  updateOptions, addCustomQuestion, updateCustomQuestion,
  deleteCustomQuestion
} from '~/data/AdminApi';

import CustomQuestionsEdit from '../components/CustomQuestionsEdit';
import EventOptionsEdit from '../components/EventOptionsEdit';

import EventPageTab from './EventPageTab';

interface SettingsTabProps {
}

interface SettingsTabState {
  customQuestionsRequests: number;
}

export default class SettingsTab extends EventPageTab<SettingsTabProps, SettingsTabState> {
  state: Readonly<SettingsTabState> = {
    customQuestionsRequests: 0,
  };

  /**
   * Handles the EventOptions callback for when options should be updated.
   * @param {Object} options The new options to send to the server.
   */
  onOptionsUpdate = (options: TESCEventOptions) => {
    const { event, addEventSuccessAlert, addEventDangerAlert } = this.props;

    updateOptions(event.alias, options)
      .then(() => {
        addEventSuccessAlert(event.alias, 'Successfully updated options!',
          'Event Options');
      })
      .catch((err) => {
        addEventDangerAlert(event.alias, err.message, 'Event Options');
        console.error(err);
      });
  };

  startCustomQuestionsLoading = () => {
    this.setState({
      customQuestionsRequests: this.state.customQuestionsRequests + 1,
    });
  };

  stopCustomQuestionsLoading = () => {
    this.setState({
      customQuestionsRequests: this.state.customQuestionsRequests - 1,
    });
  };

  onAddCustomQuestion = (type: QuestionType, question: Question) => {
    const { event, loadAllAdminEvents, addEventDangerAlert } = this.props;

    this.startCustomQuestionsLoading();

    addCustomQuestion(event.alias, question, type)
      .then(loadAllAdminEvents)
      .catch((err) => {
        addEventDangerAlert(event.alias, err.message, 'Adding Custom Question');
        console.error(err);
      })
      .finally(this.stopCustomQuestionsLoading);
  };

  onUpdateCustomQuestion = (question: Question) => {
    const { event, loadAllAdminEvents, addEventDangerAlert } = this.props;

    this.startCustomQuestionsLoading();

    updateCustomQuestion(event.alias, question)
      .then(loadAllAdminEvents)
      .catch((err) => {
        addEventDangerAlert(event.alias, err.message, 'Adding Custom Question');
        console.error(err);
      })
      .finally(this.stopCustomQuestionsLoading);
  };

  onDeleteCustomQuestion = (type: QuestionType, question: Question) => {
    const { event, loadAllAdminEvents, addEventDangerAlert } = this.props;

    this.startCustomQuestionsLoading();

    deleteCustomQuestion(event.alias, question, type)
      .then(loadAllAdminEvents)
      .catch((err) => {
        addEventDangerAlert(event.alias, err.message, 'Adding Custom Question');
        console.error(err);
      })
      .finally(this.stopCustomQuestionsLoading);
  };

  render() {
    const { event } = this.props;
    const { customQuestionsRequests } = this.state;

    return (
      <div className="tab-page__contents">
        <div className="row">
          <div className="col-lg-5 col-md-5">
            <EventOptionsEdit
              options={event.options}
              event={event}
              onOptionsUpdate={this.onOptionsUpdate}
            />
          </div>
          <div className="col-lg-6 col-md-6 offset-md-1 offset-lg-1">
            <CustomQuestionsEdit
              onAddCustomQuestion={this.onAddCustomQuestion}
              onUpdateCustomQuestion={this.onUpdateCustomQuestion}
              onDeleteCustomQuestion={this.onDeleteCustomQuestion}
              customQuestions={event.customQuestions}
              isLoading={customQuestionsRequests !== 0}
            />
          </div>
        </div>
      </div>
    );
  }
}
