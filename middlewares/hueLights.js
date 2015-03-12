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
    return helpers.sendFailureResponse(res, next, null, 'All params not provided');
  }

  hueLightsController.user.newUser(req.body.hostname, req.body.username, function(err, user) {
    if (err) {
      debug('Error: %s', err.error.message);
      return helpers.sendFailureResponse(res, next, null, err.error.toString());
    }

    debug('Create user %s success', user);
    res.send(200, {
      code: 200,
      success: true,
      user: user
    });
    next();
  });
};

Hue.deleteUser = function (req, res, next) {
  debug('Deleting user %s', req.body.userId);
  if (!req.body.userId) {
    debug('Error: userId not provided');
    return helpers.sendFailureResponse(res, next, null, 'userId not provided');
  }

  hueLightsController.user.deleteUser(req.body.userId, function(err, user) {
    if (err) {
      debug('Error: %s', err.error.message);
      return helpers.sendFailureResponse(res, next, null, err.error.toString());
    }

    debug('User %s deleted', req.body.userId);
    res.send(200, {
      code: 200,
      success: true,
      user: user
    });
    next();
  });
};

Hue.getAllUsers = function(req, res, next) {
  debug('Get all users');
  hueLightsController.user.findUsers(function(err, users) {
    if (err) {
      debug('Error: %s', err.error.message);
      return helpers.sendFailureResponse(res, next, null, err.error.toString());
    }

    debug('Get all users success');
    res.send(200, {
      code: 200,
      success: true,
      users: users
    });
    next();
  });
};

Hue.displayConfiguration = function(req, res, next) {
  debug('Getting hue hub configuration');
  hueLightsController.light.displayConfiguration(function (err, config) {
    if (err) {
      debug('Error: %s', err.error.message);
      return helpers.sendFailureResponse(res, next, null, err.error.toString());
    }

    debug('Get hue hub configuration success');
    res.send(200, {
      code: 200,
      success: true,
      config: config
    });
    next();
  });
};

Hue.findAllLights = function (req, res, next) {
  debug('Getting all lights on hub');
  hueLightsController.light.findAllLights(function (err, lights) {
    if (err) {
      debug('Error: %s', err.error.message);
      return helpers.sendFailureResponse(res, next, null, err.error.toString());
    }

    debug('Get hue lights success');
    res.send(200, {
      code: 200,
      success: true,
      lights: lights
    });
    next();
  });
};

Hue.on = function(req, res, next) {
  debug('Turning on light %s', req.params.light);
  if (!req.params.light) {
    debug('Error: Light not provided');
    return helpers.sendFailureResponse(res, next, null, 'Light not provided');
  }

  hueLightsController.light.on(req.params.light, function(err, lights) {
    if (err) {
      debug('Error: %s', err.error.message);
      return helpers.sendFailureResponse(res, next, null, err.error.toString());
    }

    debug('Light %s turned on', req.params.light);
    res.send(200, {
      code: 200,
      success: true,
      lights: lights
    });
    next();
  });
};

Hue.off = function(req, res, next) {
  debug('Turning off light %s', req.params.light);
  if (!req.params.light) {
    debug('Error: Light not provided');
    return helpers.sendFailureResponse(res, next, null, 'Light not provided');
  }

  hueLightsController.light.off(req.params.light, function(err, lights) {
    if (err) {
      debug('Error: %s', err.error.message);
      return helpers.sendFailureResponse(res, next, null, err.error.toString());
    }

    debug('Light %s turned off', req.params.light);
    res.send(200, {
      code: 200,
      success: true,
      lights: lights
    });
    next();
  });
};

Hue.getState = function (req, res, next) {
  debug('Get light %s state', req.params.light);
  if (!req.params.light) {
    debug('Error: Light not provided');
    return helpers.sendFailureResponse(res, next, null, 'Light not provided');
  }

  hueLightsController.light.getState(req.params.light, function (err, light) {
    if (err) {
      debug('Error: %s', err.error.message);
      return helpers.sendFailureResponse(res, next, null, err.error.toString());
    }

    debug('Get light %s state success', req.params.light);
    res.send(200, {
      code: 200,
      success: true,
      light: light
    });
    next();
  });
};

module.exports = HueLights;
