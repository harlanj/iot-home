const Debug = require('debug')('iot-home:controllers:hueLight')
const Hue = require('node-hue-api')
const HueController = {}

var Api, LightState

HueController.user = {}
HueController.light = {}

Debug('init')

HueController.init = (host, user) => {
  Debug('Initializing Hue for %s %s', host, user)
  Api = new Hue.HueApi(host, user)
  LightState = Hue.lightState

  return this
}

HueController.checkInit = (callback) => {
  if (!Api) {
    callback({ error: 'HueController API not initialized' })
    return false
  }

  return true
}

HueController.user.findUsers = (callback) => {
  Debug('user:findUsers')

  if (HueController.checkInit(callback)) {
    Api.registeredUsers((err, users) => {
      if (err) return callback({ error: err })
      callback(err, users)
    })
  }
}

HueController.user.findUser = (username, callback) => {
  Debug('user:findUser')

  if (HueController.checkInit(callback)) {
    HueController.user.findUsers((err, result) => {
      var exists, user

      if (err) return callback(err)

      exists = result.devices.some((u) => { return u.username === username })

      if (exists) user = result.devices.filter((u) => { if (u.username === username) return u })

      user = user instanceof Array ? user[0] : user
      callback(err, user)
    })
  }
}

HueController.user.newUser = (hostname, username, description, callback) => {
  Debug('user:newUser')

  if (HueController.checkInit(callback)) {
    Api.pressLinkButton((err, result) => {
      if (err) return callback({ error: 'Failed to Initialize Link Button' })

      Api.registerUser(hostname, username, description, (err, user) => {
        if (err) return callback({ error: err })
        callback(err, user)
      })
    })
  }
}

HueController.user.deleteUser = (username, callback) => {
  Debug('user:deleteUser')

  if (HueController.checkInit(callback)) {
    Hue.unregisterUser(username, (err, user) => {
      if (err) return callback({ error: err })
      callback(err, user)
    })
  }
}

HueController.light.findBridge = (callback) => {
  Debug('light:findBridge')

  Hue.nupnpSearch((err, bridges) => {
    if (err) return callback({ error: err })
    callback(err, bridges)
  })
}

HueController.light.displayConfiguration = (callback) => {
  Debug('light:displayConfiguration')

  if (HueController.checkInit(callback)) {
    Api.config((err, configuration) => {
      if (err) return callback({ error: err })
      callback(err, configuration)
    })
  }
}

HueController.light.findAllLights = (callback) => {
  Debug('light:findAllLights')

  if (HueController.checkInit(callback)) {
    Api.lights((err, lights) => {
      if (err) return callback({ error: err })
      callback(err, lights)
    })
  }
}

HueController.light.on = (light, callback) => {
  Debug('light:on')

  if (HueController.checkInit(callback)) {
    HueController.light.getState(light, (err, result) => {
      if (err) return callback(err)
      HueController.light._on(light, result.state.on, callback)
    })
  }
}

HueController.light._on = (light, status, callback) => {
  Debug('light:_on')

  if (status) return callback({ error: 'Light is already on' })

  Api.setLightState(light, LightState.create().on(), (err, lights) => {
    if (err) return callback({ error: err })
    callback(err, lights)
  })
}

HueController.light.off = (light, callback) => {
  Debug('light:off')

  if (HueController.checkInit(callback)) {
    HueController.light.getState(light, (err, result) => {
      if (err) return callback(err)
      HueController.light._off(light, result.state.on, callback)
    })
  }
}

HueController.light._off = (light, status, callback) => {
  Debug('light:_off')

  if (!status) return callback({ error: 'Light is already off' })

  Api.setLightState(light, LightState.create().off(), (err, lights) => {
    if (err) return callback({ error: err })
    callback(err, lights)
  })
}

HueController.light.setHue = (light, brightness, callback) => {
  Debug('light:setHue')

  if (HueController.checkInit(callback)) {
    HueController.light.getState(light, (err, response) => {
      if (err) return callback(err)

      if (!response.state.on) {
        Debug('Light %s is currently off', light)

        HueController.light.on(light, (err) => {
          if (err) return callback(err)
          return HueController.light._setHue(light, response.state.bri, brightness, callback)
        })
      } else {
        HueController.light._setHue(light, response.state.bri, brightness, callback)
      }
    })
  }
}

HueController.light._setHue = (light, currentBrightness, brightness, callback) => {
  Debug('light:_setHue')

  Api.setLightState(light, { bri: brightness }, (err, response) => {
    if (err) return callback({ error: err })
    callback(err, response)
  })
}

HueController.light.createLightGroup = (groupName, lights, callback) => {
  Debug('light:createLightGroup')

  if (HueController.checkInit(callback)) {
    Api.createGroup(groupName, lights, (err, groupId) => {
      if (err) return callback({ error: err })
      callback(err, groupId)
    })
  }
}

HueController.light.getState = (light, callback) => {
  Debug('light:getState')

  if (HueController.checkInit(callback)) {
    Api.lightStatus(light, (err, light) => {
      if (err) return callback({ error: err })
      callback(err, light)
    })
  }
}

module.exports = HueController
