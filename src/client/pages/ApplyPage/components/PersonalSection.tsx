import { TESCEvent } from '@Shared/ModelTypes';
import { RegisterUserPersonalSectionRequest } from '@Shared/api/Requests';
import React from 'react';
import { Field, Fields, reduxForm } from 'redux-form';
import * as FormFields from '~/components/Fields';
import { ApplicationRow, ApplicationCol, ApplicationLabel, ApplicationInput } from '~/components/Fields';
import FileField from '~/components/FileField';

import ApplyPageSection, { ApplyPageSectionProps } from './ApplyPageSection';
import UniversityField from './UniversityField';

interface PersonalSectionProps extends ApplyPageSectionProps {
  onEmailChange: (newEmail: string) => void;
  event: TESCEvent;
}

export enum InstitutionType {
  University = 'uni',
  UCSD = 'ucsd',
  HighSchool = 'hs',
}

export interface PersonalSectionFormData extends RegisterUserPersonalSectionRequest {
  birthdateMonth: number;
  birthdateDay: number;
  birthdateYear: number;
  institution: InstitutionType;
  resume?: File[];
}

class PersonalSection extends ApplyPageSection<PersonalSectionFormData, PersonalSectionProps> {
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
        <ApplicationLabel required={false} className="sd-form__institution-label" forTag={id}>
          {label}
        </ApplicationLabel>
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
        <ApplicationRow>
          <ApplicationCol className="col-sm-12">
            <ApplicationLabel>University</ApplicationLabel>
            (
              <Field
                component={UniversityField}
                name="university"
                className="sd-form__input-text"
                placeholder="University"
              />
            )]}
          </ApplicationCol>
        </ApplicationRow>
      );
    } else if (value === InstitutionType.HighSchool) {
      return (
        <ApplicationRow>
          <ApplicationCol className="col-sm-12">
            <ApplicationLabel>High School</ApplicationLabel>
            <ApplicationInput name="highSchool" placeholder="High School" />
          </ApplicationCol>
        </ApplicationRow>
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
    return (
      <ApplicationRow>
        <ApplicationCol className="col">
          <ApplicationLabel>Student PID</ApplicationLabel>
          <ApplicationInput name="pid" placeholder="AXXXXXXXX" />
        </ApplicationCol>
      </ApplicationRow>
      );
  }

  showMajorYearBoxes(info: any) {
    const institution: InstitutionType = info.institution.input.value;

    if (institution === InstitutionType.HighSchool) {
      return <span />;
    }

    return (
      <ApplicationRow>
        <ApplicationCol className="col-lg-6">
          <ApplicationLabel>Major</ApplicationLabel>
          {FormFields.createMajorPicker()}
        </ApplicationCol>
        <ApplicationCol className="col-lg-6">
          <ApplicationLabel>Year in School</ApplicationLabel>
          {FormFields.createYearPicker()}
        </ApplicationCol>
      </ApplicationRow>
    );
  }

  createGPAFields(enableGPA: boolean, requireGPA: boolean, requireMajorGPA: boolean) {
    const gpaFields = [];

    if (enableGPA || requireGPA) {
      gpaFields.push(
        <ApplicationCol className="col-lg-6">
          <ApplicationLabel required={requireGPA}>Grade Point Average (GPA)</ApplicationLabel>
          <ApplicationInput name="gpa" placeholder="4.00"/>
        </ApplicationCol>
      );
    }

    if (requireMajorGPA) {
      gpaFields.push(
        <ApplicationCol className="col-lg-6">
          <ApplicationLabel required={true}>Major GPA</ApplicationLabel>
          <ApplicationInput name="majorGPA" placeholder="4.00" />
        </ApplicationCol>
      );
    }

    return <ApplicationRow>{[...gpaFields]}</ApplicationRow>;
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
        <ApplicationRow>
          <ApplicationCol className="col-sm-12 no-margin-bottom">
            <ApplicationLabel>Institution</ApplicationLabel>
          </ApplicationCol>

          <ApplicationCol className="col-md">
            {this.createInstitutionCard(InstitutionType.UCSD, 'institution-ucsd',
              'UCSD')}
          </ApplicationCol>

          <ApplicationCol className="col-md">
            {this.createInstitutionCard(InstitutionType.University, 'institution-uni',
              'Other University')}
          </ApplicationCol>

          {allowHighSchool &&
            <ApplicationCol className="col-md">
            {this.createInstitutionCard(InstitutionType.HighSchool,
              'institution-hs', 'High School')}
            </ApplicationCol>
          }

          <ApplicationCol className="col-sm-12">
            <Fields
              names={['institution']}
              component={this.showInstitutionError}
            />
          </ApplicationCol>
        </ApplicationRow>
        <Fields names={['institution']} component={this.showInstitutionBox} />
        <Fields names={['institution']} component={this.showPIDBox} />
      </span>
    );
  }

  createDiversityOptions() {
    return (
    <ApplicationRow>
      <ApplicationCol className="col-md-6">
        <ApplicationLabel>
          What is your race / ethnicity?
        </ApplicationLabel>
        {FormFields.createDiversityOptions()}
      </ApplicationCol>
    </ApplicationRow>);
  }

  render() {
    const { handleSubmit, pristine, submitting } = this.props;
    const options = this.props.event.options;

    return (
      <form onSubmit={handleSubmit}>
         <ApplicationRow>
          <ApplicationCol className="col-md-6">
            <ApplicationLabel>First Name</ApplicationLabel>
            <ApplicationInput name="firstName" placeholder="First Name" />
          </ApplicationCol>
          <ApplicationCol className="col-md-6">
            <ApplicationLabel>Last Name</ApplicationLabel>
            <ApplicationInput name="lastName" placeholder="Last Name" />
          </ApplicationCol>
        </ApplicationRow>
        <ApplicationRow>
          <ApplicationCol className="col-sm-12">
            <ApplicationLabel>Email</ApplicationLabel>
            {this.createEmailField()}
          </ApplicationCol>
        </ApplicationRow>
        <ApplicationRow>
          <ApplicationCol className="col-sm-12">
            <ApplicationLabel>Birthdate</ApplicationLabel>
            <div className="row">
              <ApplicationCol className="col-sm-4">
                {FormFields.createMonthPicker()}
              </ApplicationCol>
              <ApplicationCol className="col-sm-4">
                <ApplicationInput name="birthdateDay" placeholder="Day"
                  type="number" className="sd-form__input-text mb-1 mb-md-0" />
              </ApplicationCol>
              <ApplicationCol className="col-sm-4">,
                <ApplicationInput name="birthdateYear" placeholder="Year"
                  type="number" className="sd-form__input-text" />
              </ApplicationCol>
            </div>
          </ApplicationCol>
        </ApplicationRow>

        <ApplicationRow>
          <ApplicationCol className="col-md-6">
            <ApplicationLabel>Gender</ApplicationLabel>
            {FormFields.createGenderPicker()}
          </ApplicationCol>
          <ApplicationCol className="col-md-6">
            <ApplicationLabel>Phone Number</ApplicationLabel>
            <ApplicationInput name="phone" placeholder="555-555-5555"
              type="text" className="sd-form__input-text" normalize={this.normalizePhone} />
          </ApplicationCol>
        </ApplicationRow>

        {this.renderInstitutionOptions(options.allowHighSchool)}

        <Fields names={['institution']} component={this.showMajorYearBoxes} />

        <ApplicationRow>
          <ApplicationCol className="col-lg-6">
           <ApplicationLabel required={false}>Github Username'</ApplicationLabel>
            <ApplicationInput name="github" placeholder="Github" />
          </ApplicationCol>
          <ApplicationCol className="col-lg-6">
            <ApplicationLabel required={false}>Personal Website'</ApplicationLabel>
            <ApplicationInput name="website" placeholder="http://example.com/" />
          </ApplicationCol>
        </ApplicationRow>

        {this.createGPAFields(options.enableGPA, options.requireGPA, options.requireMajorGPA)}
        {options.requireDiversityOption && this.createDiversityOptions()}

        <ApplicationRow>
          <ApplicationCol className="col-md-4 col-md-offset-4">
            <ApplicationLabel required={options.requireResume}>Resume (5MB Max)</ApplicationLabel>
            {this.createResumeUpload()}
          </ApplicationCol>
        </ApplicationRow>

        <ApplicationRow>
          <ApplicationCol className="col-sm-12">
            {this.createShareCheckbox()}
          </ApplicationCol>
        </ApplicationRow>

        <ApplicationRow>
          <ApplicationCol className="col-sm-12 text-right">
            <button
              className="btn rounded-button"
              type="submit"
              disabled={pristine || submitting}>
              Next
            </button>
          </ApplicationCol>
        </ApplicationRow>
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
