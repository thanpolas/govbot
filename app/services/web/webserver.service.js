/**
 * @fileoverview The HTTP web server service.
 */

const http = require('http');

const httpShutdown = require('http-shutdown');

const log = require('../log.service').get();

const web = (module.exports = {});

/** @type {http.Server} The http server instance */
web.http = null;

/**
 * Initialise the webserver.
 *
 * @param {Express} app the Express instance.
 */
web.init = (app) => {
  web.http = httpShutdown(http.createServer(app));
};

/**
 * Start the webserver.
 *
 * @param {Express} app the Express instance.
 * @return {Promise} A promise.
 */
web.start = (app) => {
  return new Promise((resolve, reject) => {
    web.http.on('clientError', async (error) => {
      await log.warn('start() clientError', { error });
    });
    web.http.on('error', async (error) => {
      await log.error('start() error - Failed to start web server', { error });
      reject(error);
    });

    web.http.listen(app.get('port'), () => {
      log.info(`start() HTTP Web Server Started. Port: ${app.get('port')}`);
      resolve();
    });
  });
};

/**
 * Stop the webserver.
 *
 * @return {Promise<void>}
 */
web.dispose = async () => {
  return new Promise((resolve, reject) => {
    if (!web.http || !web.http.address()) {
      resolve();
    }

    web.http.shutdown((err) => {
      if (err) {
        return reject(err);
      }

      log.info('HTTP web server stopped');
      resolve();
    });
  });
};
