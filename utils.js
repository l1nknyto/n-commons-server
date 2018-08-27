const Protocols = require('./protocols');

function okWithRes()
{
  var res = null, callback = null, onSuccess = null;
  if (arguments.length == 3) {
    res       = arguments[0];
    callback  = arguments[1];
    onSuccess = arguments[2];
  } else {
    if (typeof(arguments[0]) == 'function') {
      callback  = arguments[0];
    } else {
      res  = arguments[0];
    }
    if (arguments.length > 1) {
      onSuccess = arguments[1];
    }
  }

  return function(err) {
    if (err) {
      if (res) return sendError(err, res);
      if (callback) return callback(err);
    } else {
      if (onSuccess) return onSuccess.apply(onSuccess, sliced(arguments, 1));
      if (res) return res.json({ ok:true }).end();
    }
  };
}

function sendError(err, res, defaultResponse)
{
  if (defaultResponse) {
    res.status(Protocols.STATUS_ERR).json(defaultResponse).end();
  } else if (err && err.protocol) {
    res.status(Protocols.STATUS_ERR).json(err.protocol).end();
  } else if (err && err.errCode) {
    res.status(Protocols.STATUS_ERR).json(err).end();
  } else if (err && err.empty) {
    res.status(Protocols.STATUS_ERR).json(Protocols.DATA_NOT_FOUND).end();
  } else {
    res.status(Protocols.STATUS_ERR_UNKNOWN).json(Protocols.INTERNAL_SERVER_ERROR).end();
  }
}

module.exports = {
  okWithRes : okWithRes,
  sendError : sendError
}