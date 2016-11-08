const Restify = require('restify')
const Debug = require('debug')('iot-home:iot-home')

const Config = require('./config')

const Server = Restify.createServer({
  name: require('./package').name,
  version: require('./package').version
})

Debug('init')

Server.use(Restify.CORS())
Server.use(Restify.acceptParser(Server.acceptable))
Server.use(Restify.queryParser())
Server.use(Restify.bodyParser())

require('./middlewares/middlewares').init(Server, Config.HUE_BRIDGE_HOST, Config.HUE_BRIDGE_USERNAME)

Server.listen(process.env.PORT || 8015, () => {
  Debug('%s API listening on port %s', Server.name, process.env.PORT || 8015)
})
