import { TESCEventOptions, CustomQuestions, Question, CustomQuestionResponses } from '@Shared/ModelTypes';
import { QuestionType } from '@Shared/Questions';

import { ApplyPageFormData } from '.';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type ApplyFormValidatorError = {
  [P in keyof Omit<ApplyPageFormData, 'customQuestionResponses'>]?: string;
} & {
  customQuestionResponses?: CustomQuestionResponses;
};

/**
 * Validates the form data for correctness.
 * @param {Object} values The unvalidated form data.
 * @returns {(Object|undefined)} An error object where the key represents the
 * name of the form property, and the value its error.
 */
const createValidator = (options: TESCEventOptions, customQuestions: CustomQuestions) =>
(values: any) => {
  const errors: ApplyFormValidatorError  = {
    customQuestionResponses: {},
  };

  const required: Array<keyof ApplyPageFormData> = [
    'firstName', 'lastName', 'email', 'birthdateDay',
    'birthdateMonth', 'birthdateYear', 'gender', 'phone', 'institution',
    'major', 'year', 'shirtSize',
  ];

  if (options.allowOutOfState) {
    required.push('outOfState');
  }

  if (options.mlhProvisions) {
    required.push('accept', 'provision');
  }

  if (options.requireResume) {
    required.push('resume');
  }

  if (options.requireDiversityOption) {
    required.push('race');
  }

  if (options.requireExtraCurriculars) {
    required.push('extraCurriculars');
  }

  if (options.requireWhyThisEvent) {
    required.push('whyEventResponse');
  }

  if (options.requireClassRequirement) {
    required.push('classRequirement');
  }

  if (options.requireGPA) {
    required.push('gpa');
  }

  if (options.requireMajorGPA) {
    required.push('majorGPA');
  }

  if (values.institution === 'ucsd') {
    required.push('pid');
  }

  const notValid = required.filter(name => !(name in values));
  for (const [questionType, questions] of Object.entries(customQuestions)) {

    // get all required questions
    const requiredQuestions: Question[] = questions
      .filter(x => x.isRequired);

    // iterate through required questions
    for (const question of requiredQuestions) {
      if (!values.customQuestionResponses
        || !(question._id in values.customQuestionResponses)) {
        errors.customQuestionResponses[question._id] = 'Required';
      }
    }
  }

  notValid.forEach(name => errors[name] = 'Required');

  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address';
  }

  if (values.phone && values.phone.replace(/\D/g, '').length !== 10) {
    errors.phone = 'Must be 10 digits';
  }

  if (values.birthdateDay < 1 || values.birthdateDay > 31) {
    errors.birthdateDay = 'Invalid Day';
  }
  if (values.birthdateMonth === 'Month' || values.birthdateMonth < 1 ||
    values.birthdateMonth > 12) {
    errors.birthdateMonth = 'Invalid Month';
  }
  if (values.birthdateYear < 1900) {
    errors.birthdateYear = 'Invalid Year';
  }

  if (values.birthdateYear > 2001) {
    if (!values.university ||
        values.university.indexOf('The University of California') === -1) {
      errors.birthdateYear = 'Invalid Year';
    }
  }

  if (values.institution === 'uni' && !values.university) {
    errors.university = 'Required';
  }

  if (options.allowHighSchool &&
    values.institution === 'hs' && !values.highSchool) {
    errors.highSchool = 'Required';
  }

  if (options.allowOutOfState &&
    values.outOfState && values.outOfState === 'true' && !values.city) {
    errors.city = 'Required';
  }

  if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Your passwords do not match';
  }

  return errors;
};

export default createValidator;
