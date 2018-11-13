class ServerOptions
{
  getPort() {
    throw Error('Unimplemented');
  }

  isHttps() {
    return false;
  }

  getToobusyOptions() {
    return {
      maxLag   : 70,
      interval : 500
    };
  }

  getServerOptions() {
    return null;
  }

  getSessionOptions() {
    return null;
  }

  getStatics() {
    return [];
  }

  onSetupExpress(app) { }
  onFinishExpress(app) { }
  onSetupRouter(app) { }
}

module.exports = ServerOptions;