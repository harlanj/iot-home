var debug = require('debug')('iot-home:server:misc');
var MiscServer = {};

var MiscRoutes = function(server, middleware) {
  server.get('/', middleware.index);
  // server.get('*', middleware.miscRoute);
};

MiscServer.init = function(API, middleware) {
  debug('Initializing Miscellaneous API Routes');
  return new MiscRoutes(API, middleware);
};

module.exports = MiscServer;
