var debug = require('debug')('speechKit:middlewares:hueLights');
var hueLightsController = require('./../controllers/hueLights');
var helpers = require('./../helpers/helpers');
var HueLights = {};
debug('init');

var Hue = function(server, host, username) {
  hueLightsController.init(host, username);

  if (server) {
    require('./../server/hueRoutes').init(server, Hue);
  } else {
    throw new Error('SERVER_NOT_INITIALIZED');
  }
};

HueLights.init = function(server, host, username) {
  return new Hue(server, host, username);
};

Hue.newUser = function(req, res, next) {
  debug('Creating user %s under hostname %s', req.body.username, req.body.hostname);
  if (!req.body.username || !req.body.hostname) {
    debug('Error: All params not provided');
    return helpers.sendFailureResponse(res, null, 'All params not provided');
  }

  hueLightsController.user.newUser(req.body.hostname, req.body.username, function(err, user) {
    if (err) {
      debug('Error: %s', err.error.message);
      return helpers.sendFailureResponse(res, null, err);
    }

    debug('Create user %s success', user);
    return res.send(200, {
      code: 200,
      success: true,
      user: user
    });
  });
};

Hue.deleteUser = function (req, res, next) {
  debug('Deleting user %s', req.body.userId);
  if (!req.body.userId) {
    debug('Error: userId not provided');
    return helpers.sendFailureResponse(res, null, 'userId not provided');
  }

  hueLightsController.user.deleteUser(req.body.userId, function(err, user) {
    if (err) {
      debug('Error: %s', err.error.message);
      return helpers.sendFailureResponse(res, null, err);
    }

    debug('User %s deleted', req.body.userId);
    return res.send(200, {
      code: 200,
      success: true,
      user: user
    });
  });
};

Hue.getAllUsers = function(req, res, next) {
  debug('Get all users');
  hueLightsController.user.findUsers(function(err, users) {
    if (err) {
      debug('Error: %s', err.error.message);
      return helpers.sendFailureResponse(res, null, err);
    }

    debug('Get all users success');
    return res.send(200, {
      code: 200,
      success: true,
      users: users
    });
  });
};

Hue.displayConfiguration = function(req, res, next) {
  debug('Getting hue hub configuration');
  hueLightsController.light.displayConfiguration(function (err, config) {
    if (err) {
      debug('Error: %s', err.error.message);
      helpers.sendFailureResponse(res, null, err);
    }

    debug('Get hue hub configuration success');
    return res.send(200, {
      code: 200,
      success: true,
      config: config
    });
  });
};

Hue.findAllLights = function (req, res, next) {
  debug('Getting all lights on hub');
  hueLightsController.light.findAllLights(function (err, lights) {
    if (err) {
      debug('Error: %s', err.error.message);
      return helpers.sendFailureResponse(res, null, err);
    }

    debug('Get hue lights success');
    return res.send(200, {
      code: 200,
      success: true,
      lights: lights
    });
  });
};

Hue.on = function(req, res, next) {
  debug('Turning on light %s', req.params.light);
  if (!req.params.light) {
    debug('Error: Light not provided');
    return helpers.sendFailureResponse(res, null, 'Light not provided');
  }

  hueLightsController.light.on(req.params.light, function(err, lights) {
    if (err) {
      debug('Error: %s', err.error.message);
      return helpers.sendFailureResponse(res, null, err.error.toString());
    }

    debug('Light %s turned on', req.params.light);
    return res.send(200, {
      code: 200,
      success: true,
      lights: lights
    });
  });
};

Hue.off = function(req, res, next) {
  debug('Turning off light %s', req.params.light);
  if (!req.params.light) {
    debug('Error: Light not provided');
    return helpers.sendFailureResponse(res, null, 'Light not provided');
  }

  hueLightsController.light.off(req.params.light, function(err, lights) {
    if (err) {
      debug('Error: %s', err.error.message);
      return helpers.sendFailureResponse(res, null, err.error.toString());
    }

    debug('Light %s turned off', req.params.light);
    return res.send(200, {
      code: 200,
      success: true,
      lights: lights
    });
  });
};

module.exports = HueLights;
