#!/usr/bin/env node

/**
 * options: port, isHttps, serverOptions, sessionOptions, onSetupExpress, onFinishExpress
 */
module.exports = function(options) {
  const express = require('express');
  const session = require('express-session');

  var app = express();
  var server = null;
  if (options.isHttps) {
    server = require('https').createServer(options.serverOptions, app);
  } else {
    server = require('http').createServer(options.serverOptions, app);
  }

  //-- setup middleware
  if (options.onSetupExpress) {
    options.onSetupExpress(app);
  }
  app.use(require('morgan')('combined'));
  if (options.statics) {
    options.statics.forEach((item) => {
      app.use(item.url, express.static(item.folder));
    });
  }
  app.use(require('cookie-parser')());
  app.use(require('body-parser').urlencoded({ extended: true }));
  app.use(session(options.sessionOptions));
  if (options.onFinishExpress) {
    options.onFinishExpress(app);
  }

  //-- setup router
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
  if (options.onSetupRouter) {
    options.onSetupRouter(app);
  }

  server.listen(options.port, function () {
    console.log( 'Express server listening on port ' + server.address().port );
  });

  return {
    app    : app,
    server : server
  };
}