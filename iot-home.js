var debug      = require('debug')('iot-home:iot-home');
var util       = require('util');
process.config = require('./config');
var restify    = require('restify');
var server     = restify.createServer({
  name: require('./package').name,
  version: require('./package').version
});

server.use(restify.CORS());
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

require('./middlewares/middlewares').init(server, process.config.HUE_BRIDGE_HOST, process.config.HUE_BRIDGE_USERNAME);

debug('init');

server.listen(process.env.PORT || 8015, function() {
  debug('%s API listening on port %s', server.name, process.env.PORT || 8015);
});
