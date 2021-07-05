import { TESCEvent } from '@Shared/ModelTypes';
import { RegisterUserPersonalSectionRequest } from '@Shared/api/Requests';
import React from 'react';
import { Field, Fields, reduxForm } from 'redux-form';
import * as FormFields from '~/components/Fields';
import FileField from '~/components/FileField';

import ApplyPageSection, { ApplyPageSectionProps } from './ApplyPageSection';
import UniversityField from './UniversityField';

interface PersonalSectionProps extends ApplyPageSectionProps {
  // Function to be called when the email changes, to check if the user exists in the database
  onEmailChange: (newEmail: string) => void;
  // The current event being applied to
  event: TESCEvent;
}

export enum InstitutionType {
  University = 'uni',
  UCSD = 'ucsd',
  HighSchool = 'hs',
}

/**
 * Override defined form data to track the data in the way the UI shows it.
 */
export interface PersonalSectionFormData extends RegisterUserPersonalSectionRequest {
  birthdateMonth: number;
  birthdateDay: number;
  birthdateYear: number;
  institution: InstitutionType;
  resume?: File[];
}

/**
 * This is the first page of the event application. This handles the user's personal details.
 */
class PersonalSection extends ApplyPageSection<PersonalSectionFormData, PersonalSectionProps> {

  /**
   * Create the email component of the application.
   * Use onBlur to check if the email exists when the user takes their focus off this field.
   * @returns {Component}
   */
  createEmailField() {
    return (
      <Field
        className={'sd-form__input-email'}
        name={'email'}
        component={FormFields.errorTextInput}
        placeholder={'email@university.edu'}
        type={'email'}
        onBlur={(e: React.FormEvent<HTMLInputElement>) => this.props.onEmailChange(e.currentTarget.value)}
      />
    );
  }

  /**
   * Create the resume dropzone component.
   * @returns {Component}
   */
  createResumeUpload() {
    return (
      <Field
        component={FileField}
        name="resume"
        placeholder="Resume"
        text="Drop Your Resume"
      />
    );
  }

  /**
   * Create the checkbox for sharing.
   * @returns {Component}
   */
  createShareCheckbox() {
    const { event } = this.props;

    return (
      <label>
        <Field
          component="input"
          type="checkbox"
          name="shareResume"
          className="sd-form__input-checkbox"
        />
        I would like {event && event.name} to share my resume and personal{' '}
        information so that companies may contact me about job opportunities
      </label>
    );
  }

  /**
   * Create an institution card.
   * @param {String} value The value of the card.
   * @param {String} id The id of the card.
   * @param {String} label The label underneath the card.
   * @returns {Component}
   */
  createInstitutionCard(value: InstitutionType, id: string, label: string) {
    return (
      <div className="sd-form__institution">
        <Field
          component="input"
          type="radio"
          value={value}
          name="institution"
          id={id}
          className="sd-form__institution-input"
        />
        {FormFields.createLabel(label, false, 'sd-form__institution-label', id)}
      </div>
    );
  }

  /**
   * Create the error for the institution field.
   * @param {Object} info Information returned by the {@link Fields} component.
   * @returns {Component}
   */
  showInstitutionError(info: any) {
    // TODO: Fix fields info type
    const { touched, error } = info.institution.meta;
    if (!touched || !error) {
      return <div />;
    }

    return (
      FormFields.createError(error)
    );
  }

  /**
   * Create the input field for university and high school institutions.
   * @param {Object} info Information returned by the {@link Fields} component.
   * @returns {Component}
   */
  showInstitutionBox(info: any) {
    // TODO: Fix info type
    const value: InstitutionType = info.institution.input.value;
    if (value === InstitutionType.University) {
      return (
        FormFields.createRow(
          FormFields.createColumn('col-sm-12',
            FormFields.createLabel('University'),
            (
              <Field
                component={UniversityField}
                name="university"
                className="sd-form__input-text"
                placeholder="University"
              />
            )
          )
        )
      );
    } else if (value === InstitutionType.HighSchool) {
      return (
        FormFields.createRow(
          FormFields.createColumn('col-sm-12',
            FormFields.createLabel('High School'),
            FormFields.createInput('highSchool', 'High School')
          )
        )
      );
    }

    return <span />;
  }

  /**
   * Create the input field for a student's PID for UCSD students
   * @param {Object} info Information returned by the {@link Fields} companent.
   * @returns {Component}
   */
  showPIDBox(info: any) {
    // TODO: Fix info type
    const institution: InstitutionType = info.institution.input.value;
    // Only show for UCSD institution
    if (institution !== InstitutionType.UCSD) {
      return <span />;
    }
    return (FormFields.createRow(
      FormFields.createColumn('col',
        FormFields.createLabel('Student PID'),
        FormFields.createInput('pid', 'AXXXXXXXX')
      )
    ));
  }

  /**
   * Create the input field for major and year information of the applicant.
   * @param info redux-form object of the institution the applicatnt is from
   * @returns {Component}
   */
  showMajorYearBoxes(info: any) {
    const institution: InstitutionType = info.institution.input.value;

    if (institution === InstitutionType.HighSchool) {
      return <span />;
    }

    return (
      FormFields.createRow(
        FormFields.createColumn('col-lg-6',
          FormFields.createLabel('Major'),
          FormFields.createMajorPicker()
        ),
        FormFields.createColumn('col-lg-6',
          FormFields.createLabel('Year in School'),
          FormFields.createYearPicker()
        )
      )
    );
  }

  /**
   * Create the input field for aqpplicant GPAs.
   * @param info redux-form object of the institution the applicatnt is from
   * @returns {Component}
   */
  createGPAFields(enableGPA: boolean, requireGPA: boolean, requireMajorGPA: boolean) {
    const gpaFields = [];

    if (enableGPA || requireGPA) {
      gpaFields.push(FormFields.createColumn('col-lg-6',
        FormFields.createLabel('Grade Point Average (GPA)', requireGPA),
        FormFields.createInput('gpa', '4.00')
      ));
    }

    if (requireMajorGPA) {
      gpaFields.push(FormFields.createColumn('col-lg-6',
        FormFields.createLabel('Major GPA', true),
        FormFields.createInput('majorGPA', '4.00')
      ));
    }

    return FormFields.createRow(...gpaFields);
  }

  /**
   * Renders the components necessary for students to choose which institution
   * they're coming from.
   * @param {Boolean} allowHighSchool Whether the High School option should be
   * rendered.
   * @returns {Component} The institution selection components.
   */
  renderInstitutionOptions(allowHighSchool: boolean) {
    return (
      <span>
        {FormFields.createRow(
          FormFields.createColumn('col-sm-12 no-margin-bottom',
            FormFields.createLabel('Institution')
          ),
          FormFields.createColumn('col-md',
            this.createInstitutionCard(InstitutionType.UCSD, 'institution-ucsd',
              'UCSD')
          ),
          FormFields.createColumn('col-md',
            this.createInstitutionCard(InstitutionType.University, 'institution-uni',
              'Other University')
          ),
          allowHighSchool ? FormFields.createColumn('col-md',
            this.createInstitutionCard(InstitutionType.HighSchool,
              'institution-hs', 'High School')
          ) : '',
          FormFields.createColumn('col-sm-12',
            <Fields
              names={['institution']}
              component={this.showInstitutionError}
            />
          )
        )}

        <Fields names={['institution']} component={this.showInstitutionBox} />
        <Fields names={['institution']} component={this.showPIDBox} />
      </span>
    );
  }

  /**
   * Creates the dropdown for a user to declare their race / ethnicity.
   * @returns {Component}
   */
  createDiversityOptions() {
    return (FormFields.createRow(
      FormFields.createColumn('col-md-6',
        FormFields.createLabel('What is your race / ethnicity?'),
        FormFields.createDiversityOptions()
      )));
  }

  render() {
    const { handleSubmit, pristine, submitting } = this.props;
    const options = this.props.event.options;

    return (
      <form onSubmit={handleSubmit}>
        {FormFields.createRow(
          FormFields.createColumn('col-md-6',
            FormFields.createLabel('First Name'),
            FormFields.createInput('firstName', 'First Name')
          ),
          FormFields.createColumn('col-md-6',
            FormFields.createLabel('Last Name'),
            FormFields.createInput('lastName', 'Last Name')
          )
        )}
        {FormFields.createRow(
          FormFields.createColumn('col-sm-12',
            FormFields.createLabel('Email'),
            this.createEmailField()
          )
        )}

        {FormFields.createRow(
          FormFields.createColumn('col-sm-12',
            FormFields.createLabel('Birthdate'),
            <div className="row">
              {FormFields.createColumn('col-sm-4',
                FormFields.createMonthPicker()
              )}
              {FormFields.createColumn('col-sm-4',
                FormFields.createInput('birthdateDay', 'Day', 'number',
                  'sd-form__input-text mb-1 mb-md-0')
              )}
              {FormFields.createColumn('col-sm-4',
                FormFields.createInput('birthdateYear', 'Year', 'number',
                  'sd-form__input-text')
              )}
            </div>
          )
        )}

        {FormFields.createRow(
          FormFields.createColumn('col-md-4',
            FormFields.createLabel('Gender'),
            FormFields.createGenderPicker()
          ),
          FormFields.createColumn('col-md-4',
            FormFields.createLabel('Pronouns'),
            FormFields.createPronounPicker()
          ),
          FormFields.createColumn('col-md-4',
            FormFields.createLabel('Phone Number'),
            FormFields.createInput('phone', '555-555-5555', 'text',
              'sd-form__input-text', this.normalizePhone)
          )
        )}

        {this.renderInstitutionOptions(options.allowHighSchool)}

        <Fields names={['institution']} component={this.showMajorYearBoxes} />

        {FormFields.createRow(
          FormFields.createColumn('col-lg-4',
            FormFields.createLabel('Github Username', false),
            FormFields.createInput('github', 'Github')
          ),
          FormFields.createColumn('col-lg-4',
            FormFields.createLabel('LinkedIn', false),
            FormFields.createInput('linkedin', 'http://linkedin.com/')
          ),
          FormFields.createColumn('col-lg-4',
            FormFields.createLabel('Personal Website', false),
            FormFields.createInput('website', 'http://example.com/')
          ),
        )}

        {this.createGPAFields(options.enableGPA, options.requireGPA, options.requireMajorGPA)}
        {options.requireDiversityOption && this.createDiversityOptions()}

        {FormFields.createRow(
          FormFields.createColumn('col-md-4 col-md-offset-4',
            FormFields.createLabel('Resume (5MB Max)', options.requireResume),
            this.createResumeUpload()
          )
        )}

        {FormFields.createRow(
          FormFields.createColumn('col-sm-12',
            this.createShareCheckbox()
          )
        )}

        {FormFields.createRow(
          FormFields.createColumn('col-sm-12 text-right',
            <button
              className="btn rounded-button"
              type="submit"
              disabled={pristine || submitting}
            >
              Next
            </button>
          )
        )}
      </form>
    );
  }

  /**
   * Formats an input string to match the US phone number format.
   * @param {String} value The new value in the input field.
   * @param {String} previousValue The previous value in the input field.
   * @returns {String} The formatted phone number.
   */
  normalizePhone(value: string, previousValue: string) {
    if (!value) {
      return value;
    }
    const onlyNums = value.replace(/[^\d]/g, '');
    if (!previousValue || value.length > previousValue.length) {
      if (onlyNums.length === 3) {
        return onlyNums + '-';
      }
      if (onlyNums.length === 6) {
        return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3)}-`;
      }
    }
    if (onlyNums.length <= 3) {
      return onlyNums;
    }
    if (onlyNums.length <= 6) {
      return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3)}`;
    }
    return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3, 6)}-${onlyNums.slice(6, 10)}`;
  }
}

export default reduxForm<PersonalSectionFormData, PersonalSectionProps>({
  form: 'apply',
  destroyOnUnmount: false,
})(PersonalSection);
