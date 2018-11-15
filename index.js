#!/usr/bin/env node
const ServerOptions = require('./server-options');

function getMorganMW()
{
  const path   = require('path');
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

function setupTooBusy(app, toobusyOptions)
{
  if (toobusyOptions.enable) {
    var toobusy = require('toobusy-js');
    toobusy.maxLag(toobusyOptions.maxLag);
    toobusy.interval(toobusyOptions.interval);
    app.use(function(req, res, next) {
      if (toobusy()) {
        res.status(503).send("Server busy right now. Try again later.");
      } else {
        next();
      }
    });
  }
}

/**
 * options: ServerOptions
 */
module.exports = function(serverOptions) {
  const path   = require('path');
  const express = require('express');
  const session = require('express-session');
  const logger  = require('n-commons/logger');

  var options = (serverOptions) ? serverOptions : new ServerOptions();

  var app = express();
  var server = null;
  if (options.isHttps()) {
    server = require('https').createServer(options.getServerOptions(), app);
  } else {
    server = require('http').createServer(options.getServerOptions(), app);
  }

  //-- setup middleware
  setupTooBusy(app, options.getToobusyOptions());
  options.onSetupExpress(app, express);

  app.use(getMorganMW());
  var statics = options.getStatics();
  if (statics) statics.forEach((item) => {
    let staticMW = express.static(path.join(process.cwd(), item.folder));
    if (item.url) {
      app.use(item.url, staticMW);
    } else {
      app.use(staticMW);
    }
  });

  var bodyParser = require('body-parser');
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(require('cookie-parser')());
  app.use(session(options.getSessionOptions()));
  options.onFinishExpress(app);

  //-- setup router
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
  options.onSetupRouter(app, express);

  server.listen(options.getPort(), function() {
    logger.info('Express server listening on port ' + server.address().port);
  });

  process.on('uncaughtException', function(err) {
    logger.error(err);
    try {
      require('forky').disconnect();
    } catch(e) {
      logger.error('forky.disconnect', e);
    }
  });

  return {
    app    : app,
    server : server
  };
}