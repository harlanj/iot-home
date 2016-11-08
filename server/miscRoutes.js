const Debug = require('debug')('iot-home:server:misc')

var MiscServer = {}

function MiscRoutes (server, middleware) {
  server.get('/', middleware.index)
}

MiscServer.init = (API, middleware) => {
  Debug('Initializing Miscellaneous API Routes')

  return new MiscRoutes(API, middleware)
}

module.exports = MiscServer
