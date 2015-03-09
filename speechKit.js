var debug = require('debug')('speechKit:speechKit');
process.config = require('./config');
var restify = require('restify');
var server = restify.createServer({
  name: require('./package').name,
  version: require('./package').version
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

var hueConnection = !process.config.HUE_BRIDGE_PORT ? process.config.HUE_BRIDGE_HOST : util.format('%s:%s', process.config.HUE_BRIDGE_HOST, process.config.HUE_BRIDGE_PORT);
var middlewares = require('./middlewares/middlewares').init(server, hueConnection, process.config.HUE_BRIDGE_USERNAME);

debug('init');

server.listen(process.env.PORT || 8015, function() {
  debug('%s API listening on port %s', server.name, process.env.PORT || 8015);
});
