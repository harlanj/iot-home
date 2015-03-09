var debug = require('debug')('speechKit:middlewares:middlewares');
var Middlewares = {};

Middlewares.init = function(app, host, username) {
  app.use(function(req, res, next) {
    debug('***** ' + req.method, req.url + ' *****');
    next();
  });
  Middlewares.hueLights = require('./hueLights').init(app, host, username);
};

module.exports = Middlewares;