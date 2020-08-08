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

// TODO: not sure why this exists as opposed to a boolean?
interface SettingsTabState {
  customQuestionsRequests: number;
}

/**
 * This is the settings tag for an event. This tab currently has:
 *
 * - Toggling event options
 * - Add custom question
 * - Update custom question
 * - Delete custom question
 */
export default class SettingsTab extends EventPageTab<SettingsTabProps, SettingsTabState> {
  state: Readonly<SettingsTabState> = {
    customQuestionsRequests: 0,
  };

  /**
   * Handles the EventOptions callback for when options should be updated.
   * @param {TESCEventOptions} options The new options to send to the server.
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

  /**
   * Set React state to show a loader when waiting for server response
   * after a custom questions action.
   */
  startCustomQuestionsLoading = () => {
    this.setState({
      customQuestionsRequests: this.state.customQuestionsRequests + 1,
    });
  };

  /**
   * Set React state to hide loader after server response has been seen.
   */
  stopCustomQuestionsLoading = () => {
    this.setState({
      customQuestionsRequests: this.state.customQuestionsRequests - 1,
    });
  };

  /**
   * Handles the CustomQuestions callback for when custom questions should be added.
   *
   * @param {QuestionType} type The type of question being added
   * @param {Question} question The new question to send to the server.
   */
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

  /**
   * Handles the CustomQuestion callback for when questions should be updated.
   *
   * @param {QuestionType} type The type of question being updated
   * @param {Question} question The new question to send to the server.
   */
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

  /**
   * Handles the CustomQuestion callback for when questions should be deleted.
   *
   * @param {QuestionType} type The type of question being deleted
   * @param {Question} question The new question to send to the server.
   */
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
