var debug = require('debug')('iot-home:middlewares:middlewares');
var Middlewares = {};

Middlewares.init = function(app, host, username) {
  app.use(function(req, res, next) {
    debug('***** ' + req.method, req.url + ' *****');
    next();
  });

  Middlewares.hueLights = require('./hueLights').init(app, host, username);
  Middlewares.misc = require('./misc').init(app);

  app.get('/', function(req, res, next) {
    res.send('Hello');
    next();
  });
};

module.exports = Middlewares;
