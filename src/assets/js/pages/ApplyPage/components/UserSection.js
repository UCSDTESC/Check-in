import {Field, reduxForm} from 'redux-form';
import React from 'react';
import PropTypes from 'prop-types';

import fields from './Fields';

class UserSection extends React.Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
    reset: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    previousPage: PropTypes.func.isRequired,
    emailExists: PropTypes.bool.isRequired,
    submitError: PropTypes.object,
    options: PropTypes.object
  }

  /**
   * Create a checkbox to accept the Code of Conduct.
   * @returns {Component}
   */
  createAcceptBox() {
    return (<Field component='input' type='checkbox'
      className='sd-form__input-checkbox' name='accept' />);
  }

  /**
   * Create a checkbox to accept the MLH Data Provision.
   * @returns {Component}
   */
  createProvisionBox() {
    return (<Field component='input' type='checkbox'
      className='sd-form__input-checkbox' name='provision' />);
  }

  /**
   * Renders the MLH provisions boxes and agreement forms.
   * @returns {Component}
   */
  createMLHProvisions() {
    return (<span>
      {fields.createRow(
        fields.createColumn('col-sm-12',
          fields.createLabel(`I authorize you to share my application/registration information for event administration, ranking,
            MLH administration, pre- and post-event informational e-mails, and occasional messages about hackathons in-line
            with the MLH Privacy Policy. I further I agree to the terms of both the MLH Contest Terms and Conditions and the MLH Privacy Policy.`)
        )
      )}

      {fields.createRow(
        fields.createColumn('col-sm-12',
          this.createProvisionBox(),
          <span>
            I agree to the&nbsp;
            <a className="sd-link__underline sd-link__hover-purple"
              href="https://git.io/v7bCA" target="_blank" rel="noopener noreferrer">
                MLH Data Sharing Policy
            </a>.
          </span>
        ),
        fields.createColumn('col-sm-12',
          this.createAcceptBox(),
          <span>I have read and agree to the&nbsp;
            <a className="sd-link__underline sd-link__hover-purple"
              href="https://static.mlh.io/docs/mlh-code-of-conduct.pdf"
              target="_blank" rel="noopener noreferrer">
              MLH Code of Conduct
            </a>
          </span>
        )
      )}
    </span>);
  }

  render() {
    const {previousPage, handleSubmit, pristine, isSubmitting, submitError,
      emailExists, options} = this.props;
    return (<form onSubmit={handleSubmit}>
      {emailExists && fields.createRow(
        fields.createColumn('col-sm-12 mt-4 text-center',
          <h4 key="0">You&#39;re Almost Done!</h4>,
          <h5 key="1" className="mt-3">
            <strong><i className="fa fa-check"></i></strong>
            We see you already have a TESC Events account<br/>
            We will link this application to that
          </h5>
      )
      )}

      {!emailExists && fields.createRow(
        fields.createColumn('col-sm-12',
          <h4 key="0">You&#39;re Almost Done!</h4>,
          <h5 key="1">
            To complete your application, please add a password
          </h5>
        ),
        fields.createColumn('col-md-6',
          fields.createLabel('Password'),
          fields.createInput('password', 'Password', 'password')
        ),
        fields.createColumn('col-md-6',
          fields.createLabel('Confirm Password'),
          fields.createInput('confirmPassword', 'Confirm Password', 'password')
        )
      )}

      {options.mlhProvisions && this.createMLHProvisions()}

      {fields.createRow(
        fields.createColumn('col-sm-12 col-md-4 text-center',
          <button className="btn rounded-button rounded-button--secondary"
            type="button" onClick={previousPage}
            disabled={isSubmitting}>Go Back</button>
        ),
        fields.createColumn('col-sm-12 col-md-8 text-right',
          <button className={'btn sd-form__nav-button rounded-button ' +
            'success button'} type="submit"
            disabled={pristine || isSubmitting}>Apply!</button>
        ),
        fields.createColumn('col-sm-12 col-md-4 text-center',
          <span>
            {isSubmitting && <img className="sd-form__loading"
              src="/img/site/loading.svg" />}
          </span>
        )
      )}

      {submitError && fields.createRow(
        fields.createColumn('col-sm-12',
          fields.createError(submitError.message + ' (Your Resume Upload Might Be Too Big)')
        )
      )}
    </form>);
  }
};

export default reduxForm({
  form: 'apply',
  destroyOnUnmount: false
})(UserSection);
