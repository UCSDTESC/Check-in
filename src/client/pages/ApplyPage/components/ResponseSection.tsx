import { CustomQuestions } from '@Shared/ModelTypes';
import { QuestionType } from '@Shared/Questions';
import { RegisterUserResponseSectionRequest } from '@Shared/api/Requests';
import React from 'react';
import { Fields, reduxForm } from 'redux-form';
import * as FormFields from '~/components/Fields';
import TeamRegister from '~/components/TeamRegister';

import ApplyPageSection, { ApplyPageSectionProps } from './ApplyPageSection';

interface ResponseSectionProps extends ApplyPageSectionProps {
}

export interface ResponseSectionFormData extends RegisterUserResponseSectionRequest {
  outOfState?: boolean;
  city?: string;
  team1?: string;
  team2?: string;
  team3?: string;
}

class ResponseSection extends ApplyPageSection<ResponseSectionFormData, ResponseSectionProps> {
  /**
   * Create a new input field when user claims to be out of state.
   * @param {Object} values Information returned by the {@link Fields}
   * component.
   * @returns {Component}
   */
  showCity(values: any) {
    if (values.outOfState && values.outOfState.input.value === 'true') {
      return (
        FormFields.createRow(
          FormFields.createColumn('col-lg-6',
            FormFields.createLabel('If yes, from where?', false),
            FormFields.createInput('city', 'Which city?')
          )
        )
      );
    }
    return <span />;
  }

  // TODO: Make into a statically-typed method
  renderCustomQuestions(customQuestions: CustomQuestions, type: QuestionType) {
    let inputField: (fieldName: string, value: any, ...otherArgs: any[]) => JSX.Element | JSX.Element[] = null;

    switch (type) {
      case QuestionType.QUESTION_LONG:
        inputField = FormFields.createTextArea;
        break;
      case QuestionType.QUESTION_SHORT:
        inputField = FormFields.createInput;
        break;
      case QuestionType.QUESTION_CHECKBOX:
        inputField = (name: string) => [
          FormFields.createRadio(name, true, 'Yes'),
          FormFields.createRadio(name, false, 'No'),
        ];
        break;
    }

    return customQuestions[type].map(x => (
      FormFields.createColumn('col-sm-12',
        FormFields.createLabel(x.question, x.isRequired),
        inputField(`customQuestionResponses.${x._id}`,
          'Your Response...')
      )
    ));
  }

  render() {
    const { goToPreviousPage, handleSubmit, pristine, submitting, event } = this.props;
    const { options, customQuestions } = this.props.event;

    return (
      <form onSubmit={handleSubmit}>
        {options.foodOption && FormFields.createRow(
          FormFields.createColumn('col-sm-12',
            FormFields.createLabel('What kind of food would you like to see ' +
              'at the hackathon?', false),
            FormFields.createTextArea('food', 'Healthy Snacks and Drinks')
          )
        )}

        {FormFields.createRow(
          FormFields.createColumn('col-sm-12',
            FormFields.createLabel('Dietary Restrictions', false),
            FormFields.createTextArea('diet', 'Dietary Restrictions')
          )
        )}

        {options.requireWhyThisEvent &&
          FormFields.createColumn('col-sm-12',
            FormFields.createLabel(`Why Do You Want To Attend ${event.name}?`, true),
            FormFields.createTextArea('whyEventResponse', 'Your Response...')
          )
        }

        {options.allowOutOfState && FormFields.createRow(
          FormFields.createColumn('col-lg-12',
            FormFields.createLabel('I will be travelling from outside the ' +
              'San Diego county'),
            FormFields.createRadio('outOfState', true, 'Yes'),
            FormFields.createRadio('outOfState', false, 'No')
          )
        )}

        {options.allowOutOfState &&
          <Fields names={['outOfState']} component={this.showCity} />}

        {options.requireExtraCurriculars && FormFields.createRow(
          FormFields.createColumn('col-sm-12',
            FormFields.createLabel('Please put down any extra curriculars or Student'
              + ' Organizations you are affiliated with', true),
            FormFields.createTextArea('extraCurriculars', 'Extra Curriculars')
          )
        )}

        {FormFields.createRow(
          FormFields.createColumn('col-12',
            FormFields.createLabel('T-Shirt Size (Unisex)'),
            FormFields.createTShirtSizePicker()
          )
        )}

        {customQuestions && FormFields.createRow(
          this.renderCustomQuestions(customQuestions,
            QuestionType.QUESTION_LONG))}

        {options.requireClassRequirement && FormFields.createRow(
          FormFields.createColumn('col-lg-12',
            FormFields.createLabel('Have you taken an Advanced Data Structures ' +
              '(CSE 100) or equivalent class?'),
            FormFields.createRadio('classRequirement', true, 'Yes'),
            FormFields.createRadio('classRequirement', false, 'No')
          )
        )}

        {customQuestions && FormFields.createRow(
          this.renderCustomQuestions(customQuestions,
            QuestionType.QUESTION_SHORT))}

        {customQuestions && FormFields.createRow(
          this.renderCustomQuestions(customQuestions,
            QuestionType.QUESTION_CHECKBOX))}

        {options.allowTeammates && FormFields.createRow(
          FormFields.createColumn('col-sm-12',
            FormFields.createLabel('Join or Create a Team')
          ),
          FormFields.createColumn('col-sm-12',
            <TeamRegister />
          ),
        )}

        {FormFields.createRow(
          FormFields.createColumn('col-sm-12 col-md-4 text-center',
            <button
              className="btn rounded-button rounded-button--secondary"
              type="button"
              onClick={goToPreviousPage}
            >
              Go Back
            </button>
          ),
          FormFields.createColumn('col-sm-12 col-md-8 text-right',
            <button
              className="btn sd-form__nav-button rounded-button success button"
              type="submit"
              disabled={pristine || submitting}
            >
              Next!
            </button>
          )
        )}
      </form>
    );
  }
}

export default reduxForm<ResponseSectionFormData, ResponseSectionProps>({
  form: 'apply',
  destroyOnUnmount: false,
})(ResponseSection);
