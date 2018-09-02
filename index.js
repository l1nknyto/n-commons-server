#!/usr/bin/env node
const ServerOptions = require('./server-options');

function getMorganMW()
{
  const path = require('path');
  const morgan = require('morgan');

  var logFile = path.join(process.env.LOG_PATH, process.env.APP_NAME.toLowerCase() + '-access-%DATE%.log');
  var rotator = require('file-stream-rotator');
  var stream = rotator.getStream({
    date_format: 'YYYYMMDD',
    filename: logFile,
    frequency: 'daily',
    verbose: false
  });
  return morgan('combined', {
    stream: stream
  });
}

/**
 * options: ServerOptions
 */
module.exports = function(serverOptions) {
  const express = require('express');
  const session = require('express-session');
  const toobusy = require('toobusy-js');
  const logger  = require('n-commons/logger');

  var options = (serverOptions) ? serverOptions : options;

  var app = express();
  var server = null;
  if (options.isHttps()) {
    server = require('https').createServer(options.getServerOptions(), app);
  } else {
    server = require('http').createServer(options.getServerOptions(), app);
  }

  //-- setup middleware
  app.use(function(req, res, next) {
    if (toobusy()) {
      res.send(503, "Server busy right now.");
    } else {
      next();
    }
  });
  options.onSetupExpress(app);

  app.use(getMorganMW());
  var statics = options.getStatics();
  statics.forEach((item) => {
    app.use(item.url, express.static(item.folder));
  });

  app.use(require('body-parser').urlencoded({
    extended: true
  }));
  app.use(require('cookie-parser')());
  app.use(session(options.getSessionOptions()));
  options.onFinishExpress(app);

  //-- setup router
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
  options.onSetupRouter(app);

  server.listen(options.getPort(), function() {
    logger.info('Express server listening on port ' + server.address().port);
  });

  process.on('uncaughtException', function(err) {
    logger.error(err);
    toobusy.shutdown();
    try {
      require('forky').disconnect();
    } catch(e) {
      console.error(e);
    }
  });

  return {
    app: app,
    server: server
  };
}