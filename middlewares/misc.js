const Util = require('util')
const Debug = require('debug')('iot-home:middlewares:misc')

const Helpers = require('./../helpers/helpers')

var Miscellaneous = {}

Debug('init')

function Misc (server) {
  if (server) require('./../server/miscRoutes').init(server, Misc)
  else throw new Error('SERVER_NOT_INITIALIZED')
}

Miscellaneous.init = (server) => {
  return new Misc(server)
}

Misc.index = (req, res, next) => {
  Debug('Index')
  return res.send('Hello')
}

Misc.miscRoute = (req, res, next) => {
  var error = Util.format('%s not found', req.url)

  Debug('miscRoute')
  return Helpers.sendFailureResponse(res, error)
}

module.exports = Miscellaneous
