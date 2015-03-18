var debug             = require('debug')('iot-home:controllers:lights');
var hue               = require("node-hue-api");
var HueController     = {};
HueController.hue     = hue;
HueController._hueApi = hue.hueAPI;
HueController.user    = {};
HueController.light   = {};
HueController._state  = null;
HueController._api    = null;

debug('init');

HueController.init = function (host, user) {
  debug('Initializing Hue for %s %s', host, user);
  var api = this;
  this._hueApi = hue.HueApi;
  this._api = new hue.HueApi(host, user);
  this._state = hue.lightState;
  return this;
};

HueController.checkInit = function (callback) {
  if (this._api === null) {
    callback({ error: 'HueController API not initialized' });
    return false;
  }
  return true;
};

HueController.user.findUsers = function (callback) {
  debug('findUsers');
  if (HueController.checkInit(callback)) {
    HueController._api.registeredUsers(function (err, users) {
      if (err) return callback({ error: err });
      callback(err, users);
    });
  }
};

HueController.user.newUser = function (hostname, username, description, callback) {
  debug('newUser');
  if (HueController.checkInit(callback)) {
    HueController.hue.createUser(hostname, username, description, function (err, user) {
      if (err) return callback({ error: err });
      callback(err, user);
    });
  }
};

HueController.user.deleteUser = function (userId, callback) {
  debug('deleteUser');
  if (HueController.checkInit(callback)) {
    HueController.hue.unregisterUser(userId, function (err, user) {
      if (err) return callback({ error: err });
      callback(err, user);
    });
  }
};

HueController.light.displayConfiguration = function (callback) {
  debug('displayConfiguration');
  HueController._api.config(function (err, configuration) {
    if (err) return callback({ error: err });
    callback(err, configuration);
  });
};

HueController.light.findAllLights = function (callback) {
  debug('findAllLights');
  HueController._api.lights(function(err, lights) {
    if (err) return callback({ error: err });
    callback(err, lights);
  });
};

HueController.light.on = function (light, callback) {
  debug('on');
  if (HueController.checkInit(callback)) {
    HueController.light.getState(light, function (err, result) {
      if (err) return callback(err);
      HueController.light._on(light, result.state.on, callback);
    });
  }
};

HueController.light._on = function (light, status, callback) {
  debug('_on');
  if (status) return callback({ error: 'Light is already on'});
  HueController._api.setLightState(light, HueController._state.create().on(), function (err, lights) {
    if (err) return callback({ error: err });
    callback(err, lights);
  });
};

HueController.light.off = function (light, callback) {
  debug('off');
  if (HueController.checkInit(callback)) {
    HueController.light.getState(light, function (err, result) {
      if (err) return callback(err);
      HueController.light._off(light, result.state.on, callback);
    });
  }
};

HueController.light._off = function (light, status, callback) {
  debug('_off');
  if (! status) return callback({ error: 'Light is already off'});
  HueController._api.setLightState(light, HueController._state.create().off(), function (err, lights) {
    if (err) return callback({ error: err });
    callback(err, lights);
  });
};

HueController.light.setHue = function (light, brightness, callback) {
  debug('setHue');
  if (HueController.checkInit(callback)) {
    HueController.light.getState(light, function (err, response) {
      if (err) return callback(err);
      if (!! response.state.on) {
        debug('Light %s is currently off', light);
        HueController.light.on(light, function (err) {
          if (err) return callback(err);
          return HueController.light._setHue(light, response.state.bri, brightness, callback);
        });
      } else {
        HueController.light._setHue(light, response.state.bri, brightness, callback);
      }
    });
  }
};

HueController.light._setHue = function (light, currentBrightness, brightness, callback) {
  debug('_setHue');
  brightness = currentBrightness - (brightness || hueDefaults.DEFAULT_DIM);
  if (brightness < hueDefaults.MIN_BRIGHTNESS) {
    debug('Turning off light %s', light);
    return HueController.light.off(light, callback);
  }
  HueController._api.setLightState(light, { bri: brightness }, function (err, response) {
    if (err) return callback({ error: err });
    callback(err, response);
  });
};

HueController.light.createLightGroup = function (groupName, lights, callback) {
  debug('createLightGroup');
  if (HueController.checkInit(callback)) {
    HueController._api.createGroup(groupName, lights, function (err, groupId){
      if (err) return callback({ error: err });
      callback(err, groupId);
    });
  }
};

HueController.light.getState = function (light, callback) {
  debug('getState');
  if (HueController.checkInit(callback)) {
    HueController._api.lightStatus(light, function (err, light) {
      if (err) return callback({ error: err });
      callback(err, light);
    });
  }
};

var hueDefaults = {
  DEFAULT_DIM: 25,
  DEFAULT_BRIGHT: 25,
  MAX_BRIGHTNESS: 250,
  MIN_BRIGHTNESS: 10 //go home and check this out
};

module.exports = HueController;
