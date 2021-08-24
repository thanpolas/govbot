/**
 * @fileoverview Determines the health of the service.
 */

const log = require('../../services/log.service').get();
const { isConnected: isTwitterConnected } = require('../twitter');

const ctrl = (module.exports = {});

/**
 * Health Check.
 *
 * @param {Request} req Express request.
 * @param {Response} res Express response.
 */
ctrl.health = (req, res) => {
  if (ctrl._checkHealth()) {
    res.status(200).end();
  }

  res.status(500).end();
};

/**
 * Actual health check performer.
 *
 * @return {Promise<boolean>} yes or no.
 * @private
 */
ctrl._checkHealth = async () => {
  if (!isTwitterConnected()) {
    await log.notice('Healthcheck :: twitter not connected');
    return false;
  }

  return true;
};
