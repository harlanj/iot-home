var debug = require('debug')('iot-home:middlewares:misc');
var helpers = require('./../helpers/helpers');
var Miscellaneous = {};
debug('init');

var Misc = function(server) {
  if (server) {
    require('./../server/miscRoutes').init(server, Misc);
  } else {
    throw new Error('SERVER_NOT_INITIALIZED');
  }
};

Miscellaneous.init = function(server) {
  return new Misc(server);
};

Misc.index = function(req, res, next) {
  debug('Index');
  return res.send('Hello');
};

Misc.miscRoute = function(req, res, next) {
  debug('miscRoute');
  var error = util.format('%s not found', req.url);
  return helpers.sendFailureResponse(res, error);
};

module.exports = Miscellaneous;
