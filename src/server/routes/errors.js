module.exports = (logging) => {
  return {
    respondError: (res, err, message) => {
      logging.error(err);
      if (res.headersSent) {
        return;
      };
      return res.json({error: message});
    },
    respondUserError: (res, message) => {
      logging.error(message);
      if (res.headersSent) {
        return;
      };
      return res.json({error: message});
    },

    INCORRECT_ARGUMENTS: 'You must supply all relevant arguments',
    DATABASE_ERROR: 'An error occurred with the database',
    EMAIL_ERROR: 'An error occurred with the email server',
    PERMISSION_ERROR: 'You do not have permission to perform that action',
    NO_ALIAS_EXISTS: 'Could not find event by that alias',
    NO_USER_EXISTS: 'Could not find a user by that identifier',
    NOT_ORGANISER: 'You are not an organiser of this event',
    PHONE_NUMBER_INVALID: 'Your phone number must be exactly 10 digits',
    EMAIL_IN_USE: 'This email has already been used',
    USER_NOT_REGISTERED: 'This user is not registered for this event',
    RESUME_UPDATE_ERROR: 'There was an error updating your resume',
    NO_STATUS_SENT: 'There was no status sent in the request'
  };
};
