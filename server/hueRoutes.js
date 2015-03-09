var debug = require('debug')('speechKit:server:hue');
var HueServer = {};

var HueRoutes = function(server, middleware) {
  server.get('/hue/lights', middleware.findAllLights);
  server.get('/hue/light/:light/on', middleware.on);
  server.get('/hue/light/:light/off', middleware.off);
  server.post('/hue/user', middleware.newUser);
  server.del('/hue/user', middleware.deleteUser);
  server.get('/hue/config', middleware.displayConfiguration);
};

HueServer.init = function(API, middleware) {
  debug('Initializing Hue API Routes');
  return new HueRoutes(API, middleware);
};

module.exports = HueServer;
