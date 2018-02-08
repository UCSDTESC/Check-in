const mongoose = require('mongoose');
const logger = require('../config/logging');

module.exports = () => new Promise((fulfill, reject) => {
  mongoose.connect(process.env.MONGODB_URI, {})
  .then(() => {
    logger.info('Connected to Database');

    require('./admin');
    require('./event');

    fulfill();
  })
  .catch(reject);

  var db = mongoose.connection;
});