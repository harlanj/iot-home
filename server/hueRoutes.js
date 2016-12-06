const Debug = require('debug')('iot-home:server:hue')

var HueServer = {}

function HueRoutes (server, middleware) {
  server.get('/hue/bridges', middleware.findBridge)
  server.get('/hue/lights', middleware.findAllLights)
  server.get('/hue/lights/:light', middleware.getState)
  server.get('/hue/lights/:light/on', middleware.on)
  server.get('/hue/lights/:light/off', middleware.off)
  server.put('/hue/lights/:light/set', middleware.setHue)
  server.get('/hue/users', middleware.getAllUsers)
  server.get('/hue/users/:username', middleware.getUser)
  server.post('/hue/users', middleware.newUser)
  server.del('/hue/users', middleware.deleteUser)
  server.get('/hue/config', middleware.displayConfiguration)
}

HueServer.init = (API, middleware) => {
  Debug('Initializing Hue API Routes')

  return new HueRoutes(API, middleware)
}

module.exports = HueServer
