var restify = require('restify')

exports.isValid = (context, type) => {
  // Going to replace this with sinon stub testing at some point
  if (typeof context === type) return true
  else return false
}

exports.sendFailureResponse = (res, next, statusCode, error) => {
  if (typeof statusCode === 'number') {
    res.send(statusCode, {
      code: statusCode,
      success: false,
      error: error
    })
    next()
  } else next(new restify.BadRequestError(error))
}

exports.sendSuccessResponse = (res, next, statusCode, result) => {
  statusCode = statusCode || 200
  res.send(statusCode, {
    code: statusCode,
    success: true,
    result: result
  })

  next()
}
