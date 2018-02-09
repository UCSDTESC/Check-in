'use strict';
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var app = express();

require('dotenv').config();

const port = process.env.PORT || 3000;

var logger = require('./config/logging');

require('./models/index')()
.then(() => {
  app.use(bodyParser.json({type: 'application/json', limit: '50mb'}));
  app.use(bodyParser.urlencoded({
    extended: true,
    limit: '50mb',
    parameterLimit: 3000
  }));

  app.set('views', path.join(__dirname, '../views'));
  app.set('view engine', 'pug');

  app.use(express.static(path.join(__dirname, '../assets/public')));
  require('./routes')(app);

  app.use(passport.initialize());

  require('./config/passport');

  app.listen(port);
  logger.log('info', 'Server started. Listening on port %s', port);
})
.catch(console.error);