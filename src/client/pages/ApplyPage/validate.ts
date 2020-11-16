import {
  TESCEventOptions, CustomQuestions, Question,
  CustomQuestionResponses, TEAM_CODE_LENGTH
} from '@Shared/ModelTypes';
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
    const errors: ApplyFormValidatorError = {
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

    if (options.allowTeammates) {
      required.push('teamCode');
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

    const currentDate = new Date();
    const eighteenOrOlder = (currentDate.getFullYear() - 18 > values.birthdateYear) ||
                            (currentDate.getFullYear() - 18 == values.birthdateYear && 
                            currentDate.getMonth() > values.birthdateMonth) ||
                            (currentDate.getFullYear() - 18 == values.birthdateYear && 
                            currentDate.getMonth() == values.birthdateMonth &&
                            currentDate.getDate() >= values.birthdateDay);

    if (values.birthdateDay < 1 || values.birthdateDay > 31) {
      errors.birthdateDay = 'Invalid Day';
    }

    // birthdateMonth is zero-indexed. January = 0, February = 1, ...
    if (values.birthdateMonth === 'Month' || values.birthdateMonth < 0 ||
      values.birthdateMonth >= 12) {
      errors.birthdateMonth = 'Invalid Month';
    }
    if (values.birthdateYear < 1900 || values.birthdateYear > currentDate.getFullYear()) {
      errors.birthdateYear = 'Invalid Year';
    }

    /* Commenting this out for now since we will allow people under 18
    for SD Hacks 2021 and we are only allowing people at universities apply.
    Definitely need to add some sort of toggle to toggle allowing under 18 applicants
    from outside the UC's, but for now we will allow all people under 18 apply for SD Hacks 2021 */
    // If person is not eighteen years old or older and does not attend a university,
    // they cannot apply.
    // if (!eighteenOrOlder) {
    //   if (!values.university ||
    //     values.university.indexOf('The University of California') === -1) {
    //     errors.birthdateYear = 'Invalid Year';
    //   }
    // }

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

    if (options.allowTeammates &&
      values.teamCode && values.teamCode.trim().length !== TEAM_CODE_LENGTH) {
      errors.teamCode = 'Invalid Team Code';
    }

    return errors;
  };

export default createValidator;
