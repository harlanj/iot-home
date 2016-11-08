const Debug = require('debug')('iot-home:middlewares:middlewares')

var Middlewares = {}

Middlewares.init = (app, host, username) => {
  app.use((req, res, next) => {
    Debug('***** ' + req.method, req.url + ' *****')
    next()
  })

  Middlewares.hueLights = require('./hueLight').init(app, host, username)
  Middlewares.misc = require('./misc').init(app)

  app.get('/', (req, res, next) => {
    res.send('Hello')
    next()
  })
}

module.exports = Middlewares
