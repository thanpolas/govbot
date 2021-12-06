/**
 * @fileoverview Task scheduler using node-cron.
 */

const config = require('config');
const cron = require('node-cron');

const { checkForAlerts } = require('../entities/vote-alert');
const log = require('./log.service').get();

const service = (module.exports = {});

// node-cron instance holders
service._checkForVoteExpires = null;

/**
 * Intialize the task manager (Cron) service.
 *
 * @return {Promise<void>} A Promise.
 */
service.init = async () => {
  await log.info('Initializing CRON Service...');

  const cronOptions = {
    timezone: config.app.timezone,
  };

  // Run every 3 minutes. Check expiring votes...
  service._taskFollowUpJoined1 = cron.schedule(
    '*/3 * * * *',
    checkForAlerts,
    cronOptions,
  );
};

/**
 * Destroy all instances of cron.
 *
 * @return {Promise<void>} A promise.
 */
service.dispose = async () => {
  service._checkForVoteExpires.destroy();
};
