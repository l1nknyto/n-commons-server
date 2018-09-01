class ServerOptions
{
  getPort() {
    throw Error('Unimplemented');
  }

  isHttps() {
    return false;
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