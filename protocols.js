var instance = {
  init                  : init,
  ok                    : ok,
  notOk                 : notOk,
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
      return Object.assign(instance.NOT_OK, err.protocol);
    }
    return { ok: false, errCode: err.errCode, error: err.message };
  }
  return instance.NOT_OK;
}

function init(otherProtocols)
{
  Object.assign(instance, otherProtocols);
}

module.exports = instance;