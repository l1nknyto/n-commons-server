var instance = {
  init                  : init,
  ok                    : ok,
  notOk                 : notOk,
  appendMessage         : appendMessage,
  STATUS_OK             : 200,
  STATUS_ERR            : 501,
  STATUS_ERR_UNKNOWN    : 500,
  STATUS_NOT_FOUND      : 404,
  OK                    : { ok: true },
  NOT_OK                : { ok: false },
  DATA_NOT_FOUND        : { ok: false, message: 'Data not found' },
  INTERNAL_SERVER_ERROR : { ok: false, message: 'Internal Server Error' }
};

function ok(data)
{
  return Object.assign(instance.OK, data);
}

/**
 * err : Error object
 * - protocol : will use this object along with NOT_OK
 * - errCode
 * - message
 */
function notOk(err)
{
  if (err) {
    if (err.protocol) {
      var protocol = Object.assign({}, instance.NOT_OK);
      return Object.assign(protocol, err.protocol);
    }
    return { ok: false, errCode: err.errCode, error: err.message };
  }
  return instance.NOT_OK;
}

function appendMessage(protocol, message)
{
  var newProtocol = Object.assign({}, protocol);
  newProtocol.message = newProtocol.message + ' ' + message;
  return newProtocol;
}

function init(otherProtocols)
{
  Object.assign(instance, otherProtocols);
}

module.exports = instance;