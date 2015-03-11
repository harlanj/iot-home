var debug             = require('debug')('speechKit:controllers:lights');
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
      if (err) {
        return callback({ error: err });
      }
      callback(err, users);
    });
  }
};

HueController.user.newUser = function (hostname, username, description, callback) {
  debug('newUser');
  if (HueController.checkInit(callback)) {
    HueController.hue.createUser(hostname, username, description, function (err, user) {
      if (err) {
        return callback({ error: err });
      }
      callback(err, user);
    });
  }
};

HueController.user.deleteUser = function (userId, callback) {
  debug('deleteUser');
  if (HueController.checkInit(callback)) {
    HueController.hue.unregisterUser(userId, function (err, user) {
      if (err) {
        return callback({ error: err });
      }
      callback(err, user);
    });
  }
};

HueController.light.displayConfiguration = function (callback) {
  debug('displayConfiguration');
  HueController._api.config(function (err, configuration) {
    if (err) {
      return callback({ error: err });
    }
    callback(err, configuration);
  });
};

HueController.light.findAllLights = function (callback) {
  debug('findAllLights');
  HueController._api.lights(function(err, lights) {
    if (err) {
      return callback({ error: err });
    }
    callback(err, lights);
  });
};

HueController.light.on = function (light, callback) {
  debug('on');
  if (HueController.checkInit(callback)) {
    HueController._api.setLightState(light, HueController._state.create().on(), function (err, lights) {
      if (err) {
        return callback({ error: err });
      }
      callback(err, lights);
    });
  }
};

HueController.light.off = function (light, callback) {
  debug('off');
  if (HueController.checkInit(callback)) {
    HueController._api.setLightState(light, HueController._state.create().off(), function (err, lights) {
      if (err) {
        return callback({ error: err });
      }
      callback(err, lights);
    });
  }
};

HueController.light.setHue = function (light, brightness, callback) {
  debug('setHue');
  if (HueController.checkInit(callback)) {
    HueController._api.setLightState(light, HueController._state.create().on(), function (err, lights) {
      if (err) {
        return callback({ error: err });
      }
      callback(err, lights);
    });
  }
};

HueController.light.randomPattern = function (light, callback) {
  debug('randomPattern');
  if (HueController.checkInit(callback)) {}
};

HueController.light.createLightGroup = function (groupName, lights, callback) {
  debug('createLightGroup');
  if (HueController.checkInit(callback)) {
    HueController._api.createGroup(groupName, lights, function (err, groupId){
      if (err) {
        return callback({ error: err });
      }
      callback(err, groupId);
    });
  }
};

HueController.light.getState = function (light, callback) {
  debug('getState');
  if (HueController.checkInit(callback)) {
    HueController._api.lightStatus(light, function (err, light) {
      if (err) {
        return callback({ error: err });
      }
      callback(err, light);
    });
  }
};

module.exports = HueController;
