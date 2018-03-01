const mongoose = require('mongoose');

const cachingOptions = {
  cache: true,
  ttl: 30 // seconds of caching
};

require('mongoose-cachebox')(mongoose, cachingOptions);

const logger = require('../config/logging');

module.exports = () => new Promise((fulfill, reject) => {
  mongoose.connect(process.env.MONGODB_URI, {})
    .then(() => {
      logger.info('Connected to Database');

      require('./account');
      require('./user');
      require('./admin');
      require('./event');

      fulfill();
    })
    .catch(reject);
});
