import { CustomQuestions } from '@Shared/ModelTypes';
import { QuestionType } from '@Shared/Questions';
import { RegisterUserResponseSectionRequest } from '@Shared/api/Requests';
import React from 'react';
import { Fields, reduxForm, Field, WrappedFieldProps } from 'redux-form';
import * as FormFields from '~/components/Fields';
import { ApplicationRow, ApplicationCol, ApplicationLabel, ApplicationInput, ApplicationTextArea, ApplicationRadio, ApplicationTextAreaProps, ApplicationInputProps, ApplicationError } from '~/components/Fields';
import { createTeamCode } from '~/data/UserApi';

import ApplyPageSection, { ApplyPageSectionProps } from './ApplyPageSection';
import TeamRegister, { JoinCreateTeamState, TeamRegisterProps } from './TeamRegister';

interface ResponseSectionProps extends ApplyPageSectionProps {
}

interface ResponseSectionState {
  teamState?: JoinCreateTeamState;
}

export interface ResponseSectionFormData extends RegisterUserResponseSectionRequest {
  outOfState?: boolean;
  city?: string;
}

class ResponseSection extends ApplyPageSection<ResponseSectionFormData, ResponseSectionProps, ResponseSectionState> {
  state: Readonly<ResponseSectionState> = {
    teamState: undefined,
  };

  /**
   * Create a new input field when user claims to be out of state.
   * @param {Object} values Information returned by the {@link Fields}
   * component.
   * @returns {Component}
   */
  showCity(values: any) {
    if (values.outOfState && values.outOfState.input.value === 'true') {
      return (
        <ApplicationRow>
          <ApplicationCol className="col-lg-6">
            <ApplicationLabel required={false}>If yes, from where?</ApplicationLabel>
            <ApplicationInput name="city" placeholder="Which city?" />
          </ApplicationCol>
        </ApplicationRow>
      );
    }
    return <span />;
  }

  // TODO: Make into a statically-typed method
  renderCustomQuestions(customQuestions: CustomQuestions, type: QuestionType) {
    let InputField: React.FunctionComponent<
      { name: string }
      | ApplicationTextAreaProps
      | ApplicationInputProps
    > = null;

    switch (type) {
      case QuestionType.QUESTION_LONG:
        InputField = ApplicationTextArea;
        break;
      case QuestionType.QUESTION_SHORT:
        InputField = ApplicationInput;
        break;
      case QuestionType.QUESTION_CHECKBOX:
        InputField = ({name}) => (
          <>
            <ApplicationRadio name={name} value={true} label={'Yes'} />
            <ApplicationRadio name={name} value={false} label={'No'} />
          </>
        );
        break;
    }

    return customQuestions[type].map(x => (
      <ApplicationCol className="col-sm-12">
        <ApplicationLabel required={x.isRequired}>{x.question}</ApplicationLabel>
        {<InputField name={`customQuestionResponses.${x._id}`} placeholder={'Your Response...'}/>}
      </ApplicationCol>
    ));
  }

  /**
   * Handles the new values of the change/join team radio buttons.
   */
  onChangeTeamState = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newState: JoinCreateTeamState = Number(e.currentTarget.value);
    this.setState({
      teamState: newState,
    });
    this.props.change('createTeam', newState === JoinCreateTeamState.CREATE);
  };

  /**
   * Create a join or create team card.
   */
  createTeamStateCard(state: JoinCreateTeamState, id: string, label: string) {
    return (
      <div className="sd-form__team">
        <input
          type="radio"
          value={state}
          name="team-state"
          id={id}
          className="sd-form__team-input"
          onChange={this.onChangeTeamState}
        />
        <ApplicationLabel required={false} className="sd-form__team-label" forTag={id}>
          {label}
        </ApplicationLabel>
      </div>
    );
  }

  /**
   * Create the error for the join/create team field.
   */
  showTeamError(info: WrappedFieldProps) {
    // TODO: Fix fields info type
    const { touched, error } = info.meta;
    if (!touched || !error) {
      return <div />;
    }

    return (
      <ApplicationError>{error}</ApplicationError>
    );
  }

  /**
   * Renders the components necessary for creating or joining a team.
   */
  renderTeamOptions = (teamState?: JoinCreateTeamState) => {
    const { event } = this.props;

    return (
      <span>
        <ApplicationRow>
          <ApplicationCol className="col-sm-12 no-margin-bottom">
            <ApplicationLabel>Create or Join a Team</ApplicationLabel>
          </ApplicationCol>
          <ApplicationCol className="col-md">
            {this.createTeamStateCard(JoinCreateTeamState.CREATE, 'create-team',
              'Create')}
          </ApplicationCol>
          <ApplicationCol className="col-md">
            {this.createTeamStateCard(JoinCreateTeamState.JOIN, 'join-team',
              'Join')}
          </ApplicationCol>
          <ApplicationCol className="col-sm-12">
            <Field
              name="teamCode"
              component={this.showTeamError}
            />
          </ApplicationCol>
          <Field
            name="teamCode"
            component={TeamRegister}
            props={{
              state: teamState,
              generateTeamCode: () => createTeamCode(event._id),
            } as TeamRegisterProps}
          />
        </ApplicationRow>
      </span>
    );
  }

  render() {
    const { goToPreviousPage, handleSubmit, pristine, submitting, event } = this.props;
    const { options, customQuestions } = this.props.event;

    return (
      <form onSubmit={handleSubmit}>
        {options.foodOption &&
          <ApplicationRow>
            <ApplicationCol className="col-sm-12">
              <ApplicationLabel required={false}>
                What kind of food would you like to see at the event?
              </ApplicationLabel>
              <ApplicationTextArea name="food" placeholder="Healthy Snacks and Drinks" />
            </ApplicationCol>
          </ApplicationRow>}
        <ApplicationRow>
          <ApplicationCol className="col-sm-12">
            <ApplicationLabel required={false}>Dietary Restrictions</ApplicationLabel>
            <ApplicationTextArea name="diet" placeholder="Dietary Restrictions" />
          </ApplicationCol>
        </ApplicationRow>

        {options.requireWhyThisEvent &&
          <ApplicationCol className="col-sm-12">
            <ApplicationLabel required={true}>
              <>Why Do You Want To Attend {event.name}?</>
            </ApplicationLabel>
            <ApplicationTextArea name="whyEventResponse" placeholder="Your Response..." />
          </ApplicationCol>
        }

        {options.allowOutOfState &&
          <ApplicationRow>
            <ApplicationCol className="col-lg-12">
              <ApplicationLabel>I will be travelling from outside the San Diego county</ApplicationLabel>
              <ApplicationRadio name='outOfState' value={true} label='Yes' />
              <ApplicationRadio name='outOfState' value={false} label='No' />
            </ApplicationCol>
          </ApplicationRow>
        }

        {options.allowOutOfState &&
          <Fields names={['outOfState']} component={this.showCity} />}

        {options.requireExtraCurriculars &&
          <ApplicationRow>
            <ApplicationCol className="col-sm-12">
              <ApplicationLabel required={true}>
                Please put down any extra curriculars or Student Organizations you are affiliated with
              </ApplicationLabel>
              <ApplicationTextArea name="extraCurriculars" placeholder="Extra Curriculars" />
            </ApplicationCol>
          </ApplicationRow>
        }

        <ApplicationRow>
          <ApplicationCol className="col-12">
            <ApplicationLabel>T-Shirt Size (Unisex)</ApplicationLabel>
            {FormFields.createTShirtSizePicker()}
          </ApplicationCol>
        </ApplicationRow>

        {customQuestions && <ApplicationRow>
          {this.renderCustomQuestions(customQuestions,
            QuestionType.QUESTION_LONG)}
          </ApplicationRow>}

        {options.requireClassRequirement &&
          <ApplicationRow>
            <ApplicationCol className="col-lg-12">
              <ApplicationLabel>
                Have you taken an Advanced Data Structures (CSE 100) or equivalent class?
              </ApplicationLabel>
              <ApplicationRadio name='classRequirement' value={true} label='Yes' />
              <ApplicationRadio name='classRequirement' value={false} label='No' />
            </ApplicationCol>
          </ApplicationRow>
        }

        {customQuestions &&
          <ApplicationRow>
            {this.renderCustomQuestions(customQuestions,
              QuestionType.QUESTION_SHORT)}
          </ApplicationRow>}

        {customQuestions &&
          <ApplicationRow>
            {this.renderCustomQuestions(customQuestions,
              QuestionType.QUESTION_CHECKBOX)}
          </ApplicationRow>}

        {options.allowTeammates && this.renderTeamOptions(this.state.teamState)}

        <ApplicationRow>
          <ApplicationCol className="col-sm-12 col-md-4 text-center">
            <button
              className="btn rounded-button rounded-button--secondary"
              type="button"
              onClick={goToPreviousPage}
            >
              Go Back
            </button>
          </ApplicationCol>
          <ApplicationCol className="col-sm-12 col-md-8 text-right">
            <button
              className="btn sd-form__nav-button rounded-button success button"
              type="submit"
              disabled={pristine || submitting}
            >
              Next!
            </button>
          </ApplicationCol>
        </ApplicationRow>
      </form>
    );
  }
}

export default reduxForm<ResponseSectionFormData, ResponseSectionProps>({
  form: 'apply',
  destroyOnUnmount: false,
})(ResponseSection);
