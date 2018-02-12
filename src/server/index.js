'use strict';
var http = require('http');
var path = require('path');

var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var throng = require('throng');

require('dotenv').config({silent: process.env.NODE_ENV !== 'development'});

var logger = require('./config/logging');

var WORKERS = process.env.WEB_CONCURRENCY || 1;

require('./models/index')()
.then(() => {
  //Create workers on all the threads
  if (process.env.NODE_ENV === 'development') {
    // Don't multithread for debugging ease
    startInstance();
  } else {
    throng({
      workers: WORKERS,
      lifetime: Infinity
    }, startInstance);
  }
})
.catch(console.error);

function startInstance() {
  var app = express();
  var port = process.env.PORT || 3000;
  app.listen(port);

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

  http.createServer(app).listen(app.get(port), function(){
    logger.log('info', 'Server started. Listening on port %s with %s worker(s)',
      port, WORKERS);
  });
};
