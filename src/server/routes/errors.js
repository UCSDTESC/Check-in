module.exports = (logging) => {
  return {
    respondError: (res, err, message) => {
      logging.error(err);
      return res.json({error: message});
    },
    respondUserError: (res, message) => {
      return res.json({error: message});
    },

    DATABASE_ERROR: 'An error occurred with the database',
    NO_ALIAS_EXISTS: 'Could not find event by that alias',
    NOT_ORGANISER: 'You are not an organiser of this event'
  };
};
