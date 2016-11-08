const Debug = require('debug')('iot-home:middlewares:hueLight')
const hueLightsController = require('./../controllers/hueLight')
const helpers = require('./../helpers/helpers')

var HueLights = {}

Debug('init')

function Hue (server, host, username) {
  hueLightsController.init(host, username)

  if (server) require('./../server/hueRoutes').init(server, Hue)
  else throw new Error('SERVER_NOT_INITIALIZED')
}

HueLights.init = (server, host, username) => {
  return new Hue(server, host, username)
}

Hue.findBridge = (req, res, next) => {
  Debug('findBridge')

  hueLightsController.light.findBridge((err, bridges) => {
    if (err) {
      Debug('Error: %s', err.error.message)
      return helpers.sendFailureResponse(res, next, null, err.error.toString())
    }

    Debug('Find bridges success')
    res.send(200, {
      code: 200,
      success: true,
      bridges: bridges
    })
  })
}

Hue.newUser = (req, res, next) => {
  Debug('Creating user %s under hostname %s', req.body.username, req.body.hostname)

  if (!req.body.username || !req.body.hostname || !req.body.description) {
    Debug('Error: All params not provided')
    return helpers.sendFailureResponse(res, next, null, 'All params not provided')
  }

  hueLightsController.user.newUser(req.body.hostname, req.body.username, req.body.description, function (err, user) {
    if (err) {
      Debug('Error: %s', err.error.message)
      return helpers.sendFailureResponse(res, next, null, err.error.toString())
    }

    Debug('Create user %s success', user)
    res.send(200, {
      code: 200,
      success: true,
      user: user
    })
    next()
  })
}

Hue.deleteUser = (req, res, next) => {
  Debug('Deleting user %s', req.body.username)

  if (!req.body.username) {
    Debug('Error: username not provided')
    return helpers.sendFailureResponse(res, next, null, 'Username not provided')
  }

  hueLightsController.user.deleteUser(req.body.username, (err, user) => {
    if (err) {
      Debug('Error: %s', err.error.message)
      return helpers.sendFailureResponse(res, next, null, err.error.toString())
    }

    Debug('User %s deleted', req.body.username)
    res.send(200, {
      code: 200,
      success: true,
      user: user
    })
    next()
  })
}

Hue.getAllUsers = (req, res, next) => {
  Debug('Get all users')
  hueLightsController.user.findUsers((err, users) => {
    if (err) {
      Debug('Error: %s', err.error.message)
      return helpers.sendFailureResponse(res, next, null, err.error.toString())
    }

    Debug('Get all users success')
    res.send(200, {
      code: 200,
      success: true,
      users: users
    })
    next()
  })
}

Hue.getUser = (req, res, next) => {
  Debug('Get User %s', req.params.username)

  if (!req.params.username) {
    Debug('Error: Username not provided')
    return helpers.sendFailureResponse(res, next, null, 'Username not provided')
  }

  hueLightsController.user.findUser(req.params.username, (err, user) => {
    if (err) {
      Debug('Error: %s', err.error.message)
      return helpers.sendFailureResponse(res, next, null, err.error.toString())
    }

    Debug('Get user %s success', user.username)
    res.send(200, {
      code: 200,
      success: true,
      user: user
    })
  })
}

Hue.displayConfiguration = (req, res, next) => {
  Debug('Getting hue hub configuration')

  hueLightsController.light.displayConfiguration((err, config) => {
    if (err) {
      Debug('Error: %s', err.error.message)
      return helpers.sendFailureResponse(res, next, null, err.error.toString())
    }

    Debug('Get hue hub configuration success')
    res.send(200, {
      code: 200,
      success: true,
      config: config
    })
    next()
  })
}

Hue.findAllLights = (req, res, next) => {
  Debug('Getting all lights on hub')

  hueLightsController.light.findAllLights((err, lights) => {
    if (err) {
      Debug('Error: %s', err.error.message)
      return helpers.sendFailureResponse(res, next, null, err.error.toString())
    }

    Debug('Get hue lights success')
    res.send(200, {
      code: 200,
      success: true,
      lights: lights
    })
    next()
  })
}

Hue.on = (req, res, next) => {
  Debug('Turning on light %s', req.params.light)

  if (!req.params.light) {
    Debug('Error: Light not provided')
    return helpers.sendFailureResponse(res, next, null, 'Light not provided')
  }

  hueLightsController.light.on(req.params.light, (err, lights) => {
    if (err) {
      Debug('Error: %s', err.error.message)
      return helpers.sendFailureResponse(res, next, null, err.error.toString())
    }

    Debug('Light %s turned on', req.params.light)
    res.send(200, {
      code: 200,
      success: true
    })
    next()
  })
}

Hue.off = (req, res, next) => {
  Debug('Turning off light %s', req.params.light)

  if (!req.params.light) {
    Debug('Error: Light not provided')
    return helpers.sendFailureResponse(res, next, null, 'Light not provided')
  }

  hueLightsController.light.off(req.params.light, (err, lights) => {
    if (err) {
      Debug('Error: %s', err.error.message)
      return helpers.sendFailureResponse(res, next, null, err.error.toString())
    }

    Debug('Light %s turned off', req.params.light)
    res.send(200, {
      code: 200,
      success: true
    })
    next()
  })
}

Hue.getState = (req, res, next) => {
  Debug('Get light %s state', req.params.light)

  if (!req.params.light) {
    Debug('Error: Light not provided')
    return helpers.sendFailureResponse(res, next, null, 'Light not provided')
  }

  hueLightsController.light.getState(req.params.light, (err, light) => {
    if (err) {
      Debug('Error: %s', err.error.message)
      return helpers.sendFailureResponse(res, next, null, err.error.toString())
    }

    Debug('Get light %s state success', req.params.light)
    res.send(200, {
      code: 200,
      success: true,
      light: light
    })
    next()
  })
}

Hue.setHue = (req, res, next) => {
  Debug('Set hue for light %s', req.params.light)

  if (!req.params.light) {
    Debug('Error: Light not provided')
    return helpers.sendFailureResponse(res, next, null, 'Light not provided')
  }

  hueLightsController.light.setHue(req.params.light, req.body.brightness, (err, light) => {
    if (err) {
      Debug('Error: %s', err.error.message)
      return helpers.sendFailureResponse(res, next, null, err.error.toString())
    }

    Debug('Set hue for light %s success', req.params.light)
    res.send(200, {
      code: 200,
      success: true
    })
  })
}

module.exports = HueLights
