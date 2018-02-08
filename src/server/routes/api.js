const express = require('express');

module.exports = function(app) {
  const api = express.Router();

  app.use('/api', api);
  require('./auth')(api);

  // Use API for any API endpoints
  api.get('/', (req, res) => {
    return res.json({success: true});
  });
};