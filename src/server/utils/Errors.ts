export class DatabaseError extends Error {
}

export const ErrorMessage = {
  INCORRECT_ARGUMENTS: () => 'You must supply all relevant arguments',
  DATABASE_ERROR: () => 'An error occurred with the database',
  EMAIL_ERROR: () => 'An error occurred with the email server',
  PERMISSION_ERROR: () => 'You do not have permission to perform that action',
  S3_ERROR: () => 'There was an error with the resume server',
  NO_ALIAS_EXISTS: alias => `Could not find event by the given alias '${alias}'`,
  NO_USER_EXISTS: () => 'Could not find a user by that identifier',
  NOT_ORGANISER: () => 'You are not an organiser of this event',
  NOT_SPONSOR: () => 'You are not a sponsor of this event',
  PHONE_NUMBER_INVALID: () => 'Your phone number must be exactly 10 digits',
  EMAIL_IN_USE: () => 'This email has already been used',
  USER_NOT_REGISTERED: () => 'This user is not registered for this event',
  USER_ALREADY_REGISTERED: () => 'This account has already registered for this event',
  RESUME_UPDATE_ERROR: () => 'There was an error updating your resume',
  NO_STATUS_SENT: () => 'There was no status sent in the request',
  INSTITUTION_NOT_PROVIDED: () => 'You must provide a University or High School',
  INVALID_QUESTION_TYPE: () => 'The question type you provided is not supported',
  UNKNOWN_ERROR: () => 'Failed due to unknown error',
  INCORRECT_EMAIL_PASSWORD: () => 'Incorrect email or password',
  NO_USERS_SELECTED: () => 'There were no users selected',
  RESUME_ZIPPING_ERROR: () => 'There was an error zipping the resumes',

  NO_EVENT_ALIAS: () => 'Tried to fetch event without providing event alias',
  NO_REQUEST_USER: () => 'No user in the request headers',
  NO_QUESTION_EXISTS: () => 'No question exists by that identifier',
};
