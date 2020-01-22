import React from 'react';
import { Field, reduxForm } from 'redux-form';
import * as FormFields from '~/components/Fields';

import ApplyPageSection, { ApplyPageSectionProps } from './ApplyPageSection';
import { ApplicationRow, ApplicationCol } from '~/components/Fields';

interface UserSectionProps extends ApplyPageSectionProps {
  emailExists: boolean;
  submitError: Error;
  isSubmitting: boolean;
  previewMode: boolean;
}

export interface UserSectionFormData {
  provision: boolean;
  accept: boolean;
  password?: string;
  confirmPassword?: string;
}

class UserSection extends ApplyPageSection<UserSectionFormData, UserSectionProps> {
  /**
   * Create a checkbox to accept the Code of Conduct.
   * @returns {Component}
   */
  createAcceptBox() {
    return (
      <Field
        component="input"
        type="checkbox"
        className="sd-form__input-checkbox"
        name="accept"
      />
    );
  }

  /**
   * Create a checkbox to accept the MLH Data Provision.
   * @returns {Component}
   */
  createProvisionBox() {
    return (
      <Field
        component="input"
        type="checkbox"
        className="sd-form__input-checkbox"
        name="provision"
      />
    );
  }

  /**
   * Renders the MLH provisions boxes and agreement forms.
   * @returns {Component}
   */
  createMLHProvisions() {
    return (
      <span>
        <ApplicationRow>
          <ApplicationCol className='col-sm-12'>
            {FormFields.createLabel(`I authorize you to share my
            application/registration information for event administration,
            ranking, MLH administration, pre- and post-event informational
            e-mails, and occasional messages about hackathons in-line with the
            MLH Privacy Policy. I further I agree to the terms of both the MLH
            Contest Terms and Conditions and the MLH Privacy Policy.`)}
          </ApplicationCol>
        </ApplicationRow>

        <ApplicationRow>
          <ApplicationCol className='col-sm-12'>
            {[this.createProvisionBox(),
            <span>
              I agree to the&nbsp;
              <a
                className="sd-link__underline sd-link__hover-purple"
                href="https://git.io/v7bCA"
                target="_blank"
                rel="noopener noreferrer"
              >
                MLH Data Sharing Policy
              </a>.
            </span>]}
          </ApplicationCol>
          <ApplicationCol className='col-sm-12'>
            {[this.createAcceptBox(),
            <span>I have read and agree to the&nbsp;
              <a
                className="sd-link__underline sd-link__hover-purple"
                href="https://static.mlh.io/docs/mlh-code-of-conduct.pdf"
                rel="noopener noreferrer"
                target="_blank"
              >
                MLH Code of Conduct
              </a>
            </span>]}
          </ApplicationCol>
        </ApplicationRow>
      </span>
    );
  }

  render() {
    const { goToPreviousPage, handleSubmit, pristine, isSubmitting, submitError, emailExists, previewMode } = this.props;
    const options = this.props.event.options;

    return (
      <form onSubmit={handleSubmit}>
        {emailExists && <ApplicationRow>
          <ApplicationCol className='col-sm-12 mt-4 text-center'>
            <h4 key="0">You&#39;re Almost Done!</h4>,
            <h5 key="1" className="mt-3">
              <strong><i className="fa fa-check" /></strong>
              We see you already have a TESC Events account<br />
              We will link this application to that
            </h5>
          </ApplicationCol>
        </ApplicationRow>}

        {!emailExists && <ApplicationRow>
          <ApplicationCol className='col-sm-12'>
            <h4 key="0">You&#39;re Almost Done!</h4>,
            <h5 key="1">
              To complete your application, please add a password
            </h5>
          </ApplicationCol>
          <ApplicationCol className='col-md-6'>
            {[FormFields.createLabel('Password'),
            FormFields.createInput('password', 'Password', 'password')]}
          </ApplicationCol>
          <ApplicationCol className='col-md-6'>
            {[FormFields.createLabel('Confirm Password'),
            FormFields.createInput('confirmPassword', 'Confirm Password', 'password')]}
          </ApplicationCol>
        </ApplicationRow>}

        {options.mlhProvisions && this.createMLHProvisions()}

        <ApplicationRow>
            <ApplicationCol className='col-sm-12 col-md-4 text-center'>
              <button
                className="btn rounded-button rounded-button--secondary"
                type="button"
                onClick={goToPreviousPage}
                disabled={isSubmitting}
              >
                Go Back
              </button>
            </ApplicationCol>
            <ApplicationCol className='col-sm-12 col-md-8 text-right'>
              <button
                className="btn sd-form__nav-button rounded-button success button"
                type="submit"
                disabled={previewMode || pristine || isSubmitting}
              >
                Apply!
              </button>
            </ApplicationCol>
            <ApplicationCol className='col-sm-12 col-md-4 text-center'>
              <span>
                {isSubmitting && <img
                  className="sd-form__loading"
                  src="/img/site/loading.svg"
                />}
              </span>
            </ApplicationCol>
        </ApplicationRow>
        
        {submitError && <ApplicationRow>
          <ApplicationCol className='col-sm-12'>
            {FormFields.createError(submitError.message)}
          </ApplicationCol>
        </ApplicationRow>}
      </form>
    );
  }
}

export default reduxForm<UserSectionFormData, UserSectionProps>({
  form: 'apply',
  destroyOnUnmount: false,
})(UserSection);
