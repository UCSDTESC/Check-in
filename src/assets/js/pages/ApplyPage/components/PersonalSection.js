import {Field, Fields, reduxForm} from 'redux-form';
import React from 'react';
import PropTypes from 'prop-types';

import UniversityField from './UniversityField';

import fields from '~/components/Fields';
import FileField from '~/components/FileField';

class PersonalSection extends React.Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
    reset: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    event: PropTypes.object.isRequired,
    options: PropTypes.object.isRequired,
    onEmailChange: PropTypes.func.isRequired
  }

  createEmailField() {
    return (<Field className={'sd-form__input-email'}
      name={'email'} component={fields.errorTextInput}
      placeholder={'email@university.edu'} type={'email'}
      onBlur={(e) => this.props.onEmailChange(e.target.value)} />);
  }

  /**
   * Create the resume dropzone component.
   * @returns {Component}
   */
  createResumeUpload() {
    return (<Field component={FileField} name="resume"
      placeholder="Resume" text="Drop Your Resume" />);
  }

  /**
   * Create the checkbox for sharing.
   * @returns {Component}
   */
  createShareCheckbox() {
    let {event} = this.props;

    return (
      <label>
        <Field component="input" type="checkbox" name="shareResume"
          className="sd-form__input-checkbox" />
        I would like {event && event.name} to share my resume and personal{' '}
        information so that companies may contact me about job opportunities
      </label>);
  }

  /**
   * Create an institution card.
   * @param {String} value The value of the card.
   * @param {String} id The id of the card.
   * @param {String} label The label underneath the card.
   * @returns {Component}
   */
  createInstitutionCard(value, id, label) {
    return (
      <div className="sd-form__institution-card">
        <Field component="input" type="radio" value={value} name='institution'
          id={id} className="sd-form__input-radio sd-form__institution-radio" />
        {fields.createLabel(label, false, 'sd-form__institution-label', id)}
      </div>
    );
  }

  /**
   * Create the error for the institution field.
   * @param {Object} info Information returned by the {@link Fields} component.
   * @returns {Component}
   */
  showInstitutionError(info) {
    const {touched, error} = info.institution.meta;
    if (!touched || !error){
      return <div></div>;
    }

    return (
      fields.createError(error)
    );
  }

  /**
   * Create the input field for university and high school institutions.
   * @param {Object} info Information returned by the {@link Fields} component.
   * @returns {Component}
   */
  showInstitutionBox(info) {
    const value = info.institution.input.value;
    if (value === 'uni') {
      return (
        fields.createRow(
          fields.createColumn('col-sm-12',
            fields.createLabel('University'),
            <Field component={UniversityField} name='university'
              className="sd-form__input-text"
              placeholder="University" />
          )
        )
      );
    } else if (value === 'hs') {
      return (
        fields.createRow(
          fields.createColumn('col-sm-12',
            fields.createLabel('High School'),
            fields.createInput('highSchool', 'High School')
          )
        )
      );
    }

    return <span></span>;
  }

  /**
   * Create the input field for a student's PID for UCSD students
   * @param {Object} info Information returned by the {@link Fields} companent.
   * @returns {Component}
   */
  showPIDBox(info) {
    const value = info.institution.input.value;
    // Only show for UCSD institution
    if (value !== 'ucsd') {
      return <span></span>;
    }
    return (fields.createRow(
      fields.createColumn('col',
        fields.createLabel('Student PID'),
        fields.createInput('pid', 'AXXXXXXXX')
      )
    ));
  }

  createGPAFields(requireGPA, requireMajorGPA) {
    
    let gpaFields = [];

    if (requireGPA) {
      gpaFields.push(fields.createColumn('col-lg-6',
        fields.createLabel('Grade Point Average (GPA)', true),
        fields.createInput('gpa', '4.00')
      ))
    }

    if (requireMajorGPA) {
      gpaFields.push(fields.createColumn('col-lg-6',
        fields.createLabel('Major GPA', true),
        fields.createInput('majorGPA', '4.00')
      ))
    }


    return fields.createRow(...gpaFields)
  }

  /**
   * Renders the components necessary for students to choose which institution
   * they're coming from.
   * @param {Boolean} allowHighSchool Whether the High School option should be
   * rendered.
   * @returns {Component} The institution selection components.
   */
  renderInstitutionOptions(allowHighSchool) {
    return (<span>
      {fields.createRow(
        fields.createColumn('col-sm-12 no-margin-bottom',
          fields.createLabel('Institution')
        ),
        fields.createColumn('col-md',
          this.createInstitutionCard('ucsd', 'institution-radio-ucsd',
            'UCSD')
        ),
        fields.createColumn('col-md',
          this.createInstitutionCard('uni', 'institution-radio-uni',
            'Other University')
        ),
        allowHighSchool ? fields.createColumn('col-md',
          this.createInstitutionCard('hs',
            'institution-radio-hs', 'High School')
        ) : '',
        fields.createColumn('col-sm-12',
          <Fields names={['institution']}
            component={this.showInstitutionError} />
        )
      )}

      <Fields names={['institution']} component={this.showInstitutionBox} />
      <Fields names={['institution']} component={this.showPIDBox} />
    </span>);
  }

  createDiversityOptions() {
    return (fields.createRow(
      fields.createColumn('col-md-6',
        fields.createLabel('What is your race / ethnicity?'),
        fields.createDiversityOptions()
      )));
  }

  render() {
    const {handleSubmit, pristine, submitting, options} = this.props;

    return (<form onSubmit={handleSubmit}>
      {fields.createRow(
        fields.createColumn('col-md-6',
          fields.createLabel('First Name'),
          fields.createInput('firstName', 'First Name')
        ),
        fields.createColumn('col-md-6',
          fields.createLabel('Last Name'),
          fields.createInput('lastName', 'Last Name')
        )
      )}
      {fields.createRow(
        fields.createColumn('col-sm-12',
          fields.createLabel('Email'),
          this.createEmailField()
        )
      )}

      {fields.createRow(
        fields.createColumn('col-sm-12',
          fields.createLabel('Birthdate'),
          <div className="row">
            {fields.createColumn('col-sm-4',
              fields.createMonthPicker()
            )}
            {fields.createColumn('col-sm-4',
              fields.createInput('birthdateDay', 'Day', 'number',
                'sd-form__input-text mb-1 mb-md-0')
            )}
            {fields.createColumn('col-sm-4',
              fields.createInput('birthdateYear', 'Year', 'number',
                'sd-form__input-text')
            )}
          </div>
        )
      )}

      {fields.createRow(
        fields.createColumn('col-md-6',
          fields.createLabel('Gender'),
          fields.createGenderPicker()
        ),
        fields.createColumn('col-md-6',
          fields.createLabel('Phone Number'),
          fields.createInput('phone', '555-555-5555', 'text',
            'sd-form__input-text',this.normalizePhone)
        )
      )}

      {this.renderInstitutionOptions(options.allowHighSchool)}

      {fields.createRow(
        fields.createColumn('col-lg-6',
          fields.createLabel('Major'),
          fields.createMajorPicker()
        ),
        fields.createColumn('col-lg-6',
          fields.createLabel('Year in School'),
          fields.createYearPicker()
        )
      )}

      {fields.createRow(
        fields.createColumn('col-lg-6',
          fields.createLabel('Github Username', false),
          fields.createInput('github', 'Github')
        ),
        fields.createColumn('col-lg-6',
          fields.createLabel('Personal Website', false),
          fields.createInput('website', 'http://example.com/')
        )
      )}

      {this.createGPAFields(options.requireGPA, options.requireMajorGPA)}
      {options.requireDiversityOption && this.createDiversityOptions()}


      {fields.createRow(
        fields.createColumn('col-md-4 col-md-offset-4',
          fields.createLabel('Resume (5MB Max)'),
          this.createResumeUpload()
        )
      )}

      {fields.createRow(
        fields.createColumn('col-sm-12',
          this.createShareCheckbox()
        )
      )}

      {fields.createRow(
        fields.createColumn('col-sm-12 text-right',
          <button className="btn rounded-button" type="submit"
            disabled={pristine || submitting}>Next</button>
        )
      )}
    </form>);
  }

  /**
   * Formats an input string to match the US phone number format.
   * @param {String} value The new value in the input field.
   * @param {String} previousValue The previous value in the input field.
   * @returns {String} The formatted phone number.
   */
  normalizePhone (value, previousValue) {
    if (!value) {
      return value;
    }
    const onlyNums = value.replace(/[^\d]/g, '');
    if (!previousValue || value.length > previousValue.length) {
      if (onlyNums.length === 3) {
        return onlyNums + '-';
      }
      if (onlyNums.length === 6) {
        return onlyNums.slice(0, 3) + '-' + onlyNums.slice(3) + '-';
      }
    }
    if (onlyNums.length <= 3) {
      return onlyNums;
    }
    if (onlyNums.length <= 6) {
      return onlyNums.slice(0, 3) + '-' + onlyNums.slice(3);
    }
    return onlyNums.slice(0, 3) + '-' + onlyNums.slice(3, 6) + '-' +
      onlyNums.slice(6, 10);
  }
}

export default reduxForm({
  form: 'apply',
  destroyOnUnmount: false
})(PersonalSection);

