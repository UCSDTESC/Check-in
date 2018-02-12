module.exports = (logging) => {
  return {
    respondError: (res, err, message) => {
      logging.error(err);
      return res.json({error: true, message});
    },
    respondUserError: (res, message) => {
      return res.json({error: true, message});
    },
    DATABASE_ERROR: 'An error occurred with the database',
    NO_ALIAS_EXISTS: 'Could not find event by that alias'
  };
};
