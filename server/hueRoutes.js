var debug = require('debug')('iot-home:server:hue');
var HueServer = {};

var HueRoutes = function(server, middleware) {
  server.get('/hue/lights', middleware.findAllLights);
  server.get('/hue/light/:light', middleware.getState);
  server.get('/hue/light/:light/on', middleware.on);
  server.get('/hue/light/:light/off', middleware.off);
  server.put('/hue/light/:light/set', middleware.setHue);
  server.get('/hue/users', middleware.getAllUsers);
  server.get('/hue/user/:username', middleware.getUser);
  server.post('/hue/user', middleware.newUser);
  server.del('/hue/user', middleware.deleteUser);
  server.get('/hue/config', middleware.displayConfiguration);
};

HueServer.init = function(API, middleware) {
  debug('Initializing Hue API Routes');
  return new HueRoutes(API, middleware);
};

module.exports = HueServer;
