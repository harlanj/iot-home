var debug           = require('debug')('iot-home:controllers:hueLight');
var hue             = require("node-hue-api");
var redis           = require('redis');
var serialize       = require('node-serialize');

var HueController   = {};
HueController.user  = {};
HueController.light = {};

debug('init');

HueController.init = function (host, user) {
  debug('Initializing Hue for %s %s', host, user);
  this.hue = hue;
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
  debug('user:findUsers');
  if (HueController.checkInit(callback)) {
    HueController._api.registeredUsers(function (err, users) {
      if (err) return callback({ error: err });
      callback(err, users);
    });
  }
};

HueController.user.findUser = function (username, callback) {
  debug('user:findUser');
  var user = null;
  if(HueController.checkInit(callback)) {
    HueController.user.findUsers(function (err, result) {
      if (err) return callback(err);
      var exists = result.devices.some(function (u) {return u.username === username;});
      if (exists) user = result.devices.filter(function (u) {if (u.username === username) return u;});
      user = user instanceof Array ? user[0] : user;
      callback(err, user);
    });
  }
};

HueController.user.newUser = function (hostname, username, description, callback) {
  debug('user:newUser');
  if (HueController.checkInit(callback)) {
    HueController._api.pressLinkButton(function (err, result) {
      if (err) return callback({ error: 'Failed to Initialize Link Button' });
      HueController._api.registerUser(hostname, username, description, function (err, user) {
        if (err) return callback({ error: err });
        callback(err, user);
      });
    });
  }
};

HueController.user.deleteUser = function (username, callback) {
  debug('user:deleteUser');
  if (HueController.checkInit(callback)) {
    console.log(hue);
    HueController.hue.unregisterUser(username, function (err, user) {
      console.log(arguemnts);
      if (err) return callback({ error: err });
      callback(err, user);
    });
  }
};

HueController.light.displayConfiguration = function (callback) {
  debug('light:displayConfiguration');
  if (HueController.checkInit(callback)) {
    HueController._api.config(function (err, configuration) {
      if (err) return callback({ error: err });
      callback(err, configuration);
    });
  }
};

HueController.light.findAllLights = function (callback) {
  debug('light:findAllLights');
  if (HueController.checkInit(callback)) {
    HueController._api.lights(function(err, lights) {
      if (err) return callback({ error: err });
      callback(err, lights);
    });
  }
};

HueController.light.on = function (light, callback) {
  debug('light:on');
  if (HueController.checkInit(callback)) {
    HueController.light.getState(light, function (err, result) {
      if (err) return callback(err);
      HueController.light._on(light, result.state.on, callback);
    });
  }
};

HueController.light._on = function (light, status, callback) {
  debug('light:_on');
  if (status) return callback({ error: 'Light is already on'});
  HueController._api.setLightState(light, HueController._state.create().on(), function (err, lights) {
    if (err) return callback({ error: err });
    callback(err, lights);
  });
};

HueController.light.off = function (light, callback) {
  debug('light:off');
  if (HueController.checkInit(callback)) {
    HueController.light.getState(light, function (err, result) {
      if (err) return callback(err);
      HueController.light._off(light, result.state.on, callback);
    });
  }
};

HueController.light._off = function (light, status, callback) {
  debug('light:_off');
  if (! status) return callback({ error: 'Light is already off'});
  HueController._api.setLightState(light, HueController._state.create().off(), function (err, lights) {
    if (err) return callback({ error: err });
    callback(err, lights);
  });
};

HueController.light.setHue = function (light, brightness, callback) {
  debug('light:setHue');
  if (HueController.checkInit(callback)) {
    HueController.light.getState(light, function (err, response) {
      if (err) return callback(err);
      if (! response.state.on) {
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
  debug('light:_setHue');
  HueController._api.setLightState(light, { bri: brightness }, function (err, response) {
    if (err) return callback({ error: err });
    callback(err, response);
  });
};

HueController.light.createLightGroup = function (groupName, lights, callback) {
  debug('light:createLightGroup');
  if (HueController.checkInit(callback)) {
    HueController._api.createGroup(groupName, lights, function (err, groupId){
      if (err) return callback({ error: err });
      callback(err, groupId);
    });
  }
};

HueController.light.getState = function (light, callback) {
  debug('light:getState');
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
  MAX_BRIGHTNESS: 250
};

module.exports = HueController;
