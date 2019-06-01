import { TESCUser, TESCEvent, Question } from '@Shared/ModelTypes';
import { QuestionType } from '@Shared/Questions';
import { getRoleRank, Role } from '@Shared/Roles';
import { isAcceptableStatus, isRejectableStatus, isWaitlistableStatus } from '@Shared/UserStatus';
import UUID from 'node-uuid';
import React from 'react';
import FA from 'react-fontawesome';
import { connect } from 'react-redux';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import { sendAcceptanceEmail, sendRejectionEmail, sendWaitlistEmail } from '~/data/Api';
import { ApplicationState } from '~/reducers';

import { AlertType } from '../pages/AlertPage';

import CheckboxButton from './CheckboxButton';

const mapStateToProps = (state: ApplicationState, ownProps: UserProps) => ({
  resume: ownProps.user.resume ? ownProps.user.resume : null,
  event: ownProps.user.event ? ownProps.user.event : null,
  role: state.admin.auth.user.role,
});

interface UserProps {
  user: TESCUser;
  event: TESCEvent;
  createAlert: (message: string, type: AlertType, title: string) => void;
}

// TODO: Create unified User form data that allows for easy extensibility of
// underlying user object.
interface UserFormData {
}

type Props = InjectedFormProps<UserFormData, UserProps> & ReturnType<typeof mapStateToProps> & UserProps;

class User extends React.Component<Props> {
  /**
   * Create a download resume button with associated label.
   * @returns {Component[]} The components to render.
   */
  renderResume() {
    return [
      (
        <label key="0" className="col-sm-3 col-form-label">
          Download Resume
        </label>
      ), (
        <div key="1" className="col-sm-3">
          <a
            className="btn btn-primary form-control"
            role="button"
            target="_blank"
            href={this.props.user.resume.url}
            rel="noopener noreferrer"
          >
            View
          </a>
        </div>
      ),
    ];
  }

  /**
   *
   * @param {String} label The label of the checkbox.
   * @param {String} value The name of the checkbox input.
   * @param {String} [fieldSize=col-sm-10] The class name of the input.
   * @param {String} [labelSize =col-sm-4] The class name of the label.
   * @returns {Component[]} The components to render.
   */
  renderFormCheckbox(label: string, value: string, fieldSize: string = 'col-sm-10',
                     labelSize: string = 'col-sm-2') {
    return [
      <label key="0" className={labelSize + ' col-form-label'}>{label}</label>,
      (
        <div key="1" className={fieldSize + ' btn-group'} data-toggle="buttons">
          <Field component={CheckboxButton} name={value} />
        </div>
      )];
  }

  /**
   *
   * @param {String} label The label of the input field.
   * @param {String} value The name of the input field.
   * @param {String} [fieldSize=col-sm-10] The class name of the input.
   * @param {String} [fieldType=text] The input type.
   * @param {String} [labelSize=col-sm-4] The class name of the label.
   */
  renderFormField(label: string, value: string, fieldSize: string = 'col-sm-4',
                  fieldType: string = 'text', labelSize: string = 'col-sm-2') {
    return [
      <label key="0" className={labelSize + ' col-form-label'}>{label}</label>,
      (
        <div key="1" className={fieldSize}>
          <Field
            name={value}
            className="form-control"
            component="input"
            type={fieldType}
          />
        </div>
      )];
  }

  renderInstitution(user: TESCUser) {
    if (user.university) {
      return this.renderFormField('University', 'university', 'col-sm-4');
    } else if (user.highSchool) {
      return this.renderFormField('High School', 'highSchool', 'col-sm-4');
    }
    return  <span/>;
  }

  renderGPAFields(event: TESCEvent) {
    return (
      <>
        {event.options.requireGPA &&
          this.renderFormField('GPA', 'gpa', 'col-sm-4')}
        {event.options.requireMajorGPA &&
          this.renderFormField('Major GPA', 'majorGPA', 'col-sm-4')}
      </>
    );
  }

  renderCustomQuestions(questions: Question[]) {
    return (
      questions.map(q => (
        this.renderFormField(q.question,
          `customQuestionResponses[${q._id}]`, 'col-12', 'text', 'col-12')
      ))
    );
  }

  renderCustomCheckboxes(questions: Question[]) {
    return (
      questions.map(q => (
        this.renderFormCheckbox(q.question,
          `customQuestionResponses[${q._id}]`, 'col-12', 'col-12')
      ))
    );
  }

  onSendAcceptance(user: TESCUser) {
    return (
      sendAcceptanceEmail(user)
        .then((success) => {
          this.props.createAlert(
            `Successfully sent acceptance email to '${user.account.email}'`,
            AlertType.Success,
            'UsersPage'
          );
        })
        .catch(() => {
          this.props.createAlert(
            `Something went wrong when sending acceptance email to '${user.account.email}'`,
            AlertType.Danger,
            'UsersPage'
          );
        })
    );
  }

  onSendRejection(user: TESCUser) {
    return (
      sendRejectionEmail(user)
        .then((success) => {
          this.props.createAlert(
            `Successfully sent rejection email to '${user.account.email}'`,
            AlertType.Success,
            'UsersPage'
          );
        })
        .catch(() => {
          this.props.createAlert(
            `Something went wrong when sending rejection email to '${user.account.email}'`,
            AlertType.Danger,
            'UsersPage'
          );
        })
    );
  }

  onSendWaitlist(user: TESCUser) {
    sendWaitlistEmail(user)
      .then((success) => {
        this.props.createAlert(
          `Successfully sent waitlist email to '${user.account.email}'`,
          AlertType.Success,
          'UsersPage'
        );
      })
      .catch(() => {
        this.props.createAlert(
          `Something went wrong when sending waitlist email to '${user.account.email}'`,
          AlertType.Danger,
          'UsersPage'
        );
      });
  }

  render() {
    const {handleSubmit, pristine, reset, submitting, event, user} = this.props;
    return (
      <div>
        <div className="row">
          <div className="col-md-6">
            <h3>User <small>{user._id}</small></h3>
          </div>
          <div className="col-md-6 d-flex flex-row-reverse">
            {isAcceptableStatus(user.status) &&
              <button
                className={`btn px-2 w-auto
                  rounded-button rounded-button--small`}
                onClick={() => this.onSendAcceptance(user)}
              >
              <FA name="envelope" className="mr-2" />
                Send Acceptance
              </button>
            }
            {isRejectableStatus(user.status) &&
              <button
                className={`btn px-2 w-auto
                  rounded-button rounded-button--small`}
                onClick={() => this.onSendRejection(user)}
              >
              <FA name="envelope" className="mr-2" />
                Send Rejection
              </button>
            }
            {isWaitlistableStatus(user.status) &&
              <button
                className={`btn px-2 w-auto
                  rounded-button rounded-button--small`}
                onClick={() => this.onSendWaitlist(user)}
              >
              <FA name="envelope" className="mr-2" />
                Send Waitlist Email
              </button>
            }
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-6">
              <h5>Login Information</h5>
              <div className="form-group row mb-2">
                <label key="0" className="col-sm-2 col-form-label">
                  Email
                </label>
                <div key="1" className="col-sm-4 col-form-label">
                  {this.props.user.account.email}
                </div>
              </div>
              <h5>Portfolio</h5>
              <div className="form-group row mb-2">
                {this.renderFormField('Github', 'github')}
                {this.renderFormField('Website', 'website')}
              </div>
              {user.resume &&
              <span>
                <h5>Resume</h5>
                <div className="form-group row mb-2">
                  {this.renderResume()}
                  {this.renderFormCheckbox('Share Resume', 'shareResume',
                    'col-sm-4')}
                </div>
              </span>}
              <h5>Travel</h5>
              <div className="form-group row mb-2">
                {this.renderFormCheckbox('Out Of State', 'travel.outOfState',
                  'col-sm-4')}
                {this.renderFormField('Coming From', 'travel.city')}
              </div>
              {getRoleRank(this.props.role) >= getRoleRank(Role.ROLE_ADMIN) &&
                <span>
                  <h5>Admin Flags</h5>
                  <div className="form-group row mb-2">
                    {this.renderFormCheckbox('Confirmed', 'account.confirmed',
                      'col-sm-4')}
                    {this.renderFormCheckbox('Checked In', 'checkedIn',
                      'col-sm-4')}
                    {this.renderFormCheckbox('Bussing', 'bussing', 'col-sm-4')}
                    {this.renderFormCheckbox('Sanitized', 'sanitized',
                      'col-sm-4')}
                    {this.renderFormField('Status', 'status', 'col-sm-4')}
                  </div>
                </span>
              }
            </div>
            <div className="col-6">
              <h5>Personal Details</h5>
              <div className="form-group row mb-2">
                {this.renderFormField('First Name', 'firstName', 'col-sm-4')}
                {this.renderFormField('Last Name', 'lastName', 'col-sm-4')}
                {this.renderFormField('Gender', 'gender', 'col-sm-4')}
                {this.renderFormField('Birthdate', 'birthdate', 'col-sm-4')}
                {this.renderFormField('Year', 'year', 'col-sm-4')}
                {this.renderFormField('Phone', 'phone', 'col-sm-4', 'tel')}
                {this.renderInstitution(this.props.user)}
                {this.renderFormField('Major', 'major', 'col-sm-4')}
                {this.renderFormField('Shirt Size', 'shirtSize', 'col-sm-4')}
                {this.renderFormField('Diet', 'diet', 'col-sm-4')}
                {this.renderFormField('Food', 'food', 'col-sm-4')}
                {this.renderFormField('PID', 'pid', 'col-sm-4')}
                {this.renderGPAFields(event)}
              </div>

              {event.options.requireClassRequirement ||
                event.options.requireExtraCurriculars ?
                  <h5 className="mt-3">Miscellaneous Questions</h5> : ''}
              <div className="row my-2 pt-2">
                {event.options.requireClassRequirement &&
                  <>
                    <div className="col-sm-8">This user has completed Advanced
                      Data Structures (CSE 100)</div>
                    <div className="col-sm-4 d-flex justify-content-center">
                      {this.renderFormCheckbox('', 'classRequirement',
                        'ml-auto')}
                    </div>
                  </>
                }
                {event.options.requireExtraCurriculars &&
                  <>
                    <div className="col-sm-12 mt-3">
                      Extra Curriculars
                      {this.renderFormField('', 'extraCurriculars', '')}
                    </div>
                  </>
                }

                {event.options.requireWhyThisEvent &&
                  <>
                    <div className="col-sm-12">
                      Why This Event?
                      {this.renderFormField('', 'whyEventResponse', '')}
                    </div>
                  </>
                }
              </div>
            </div>
          </div>
          <div className="row">
            {event.customQuestions[QuestionType.QUESTION_LONG] &&
              <div className="col-12 col-lg">
                <h5>Long Text Questions</h5>
                {this.renderCustomQuestions(event.customQuestions[QuestionType.QUESTION_LONG])}
              </div>
            }
            {event.customQuestions[QuestionType.QUESTION_SHORT] &&
              <div className="col-12 col-lg">
                <h5>Short Text Questions</h5>
                {this.renderCustomQuestions(event.customQuestions[QuestionType.QUESTION_SHORT])}
              </div>
            }
            {event.customQuestions[QuestionType.QUESTION_CHECKBOX] &&
              <div className="col-12 col-lg">
                <h5>Check Box Questions</h5>
                {this.renderCustomCheckboxes(event.customQuestions[QuestionType.QUESTION_CHECKBOX])}
              </div>
            }
          </div>
          <div className="row">
            <div className="col-12">
              <button
                type="submit"
                className="btn rounded-button rounded-button--small"
                disabled={pristine || submitting}
              >
                Apply
              </button>
              <button
                type="button"
                disabled={pristine || submitting}
                className="btn rounded-button rounded-button--small rounded-button--secondary"
                onClick={reset}
              >
                Reset
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default reduxForm<UserFormData, UserProps>({
  form: UUID.v4(),
  destroyOnUnmount: true,
  enableReinitialize: true,
})(connect(mapStateToProps)(User));
