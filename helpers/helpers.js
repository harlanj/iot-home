var debug = require('debug')('speechKit:helpers:helpers');
var restify = require('restify');
var helpers = {};

debug('init');

helpers.isValid = function(context, type) {
  // Going to replace this with sinon stub testing at some point

  return typeof context === type ? true : false;
};

helpers.sendFailureResponse = function(res, statusCode, error) {
  if (typeof statusCode === 'number') {
    res.send(statusCode, {
      code: statusCode,
      success: false,
      error: error
    });
  } else {
    return res.send(new restify.BadRequestError(error));
  }
};

helpers.sendSuccessResponse = function(res, statusCode, result, next) {
  statusCode = statusCode || 200;
  res.send(statusCode, {
    code: statusCode,
    success: true,
    result: result
  });
  next();
};

module.exports = helpers;
