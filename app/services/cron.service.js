/**
 * @fileoverview Task scheduler using node-cron.
 */

// const config = require('config');
// const cron = require('node-cron');

const log = require('./log.service').get();

const service = (module.exports = {});

// node-cron instance holders
service._taskFollowUpJoined1 = null;
service._taskCheckMissing = null;
service._taskFollowUpDaily = null;

/**
 * Intialize the task manager (Cron) service.
 *
 * @return {Promise<void>} A Promise.
 */
service.init = async () => {
  await log.info('Initializing CRON Service...');
  // const cronOptions = {
  //   timezone: config.options.timezone,
  // };

  // Run every 10 minutes. Check just joined members and followup.
  // service._taskFollowUpJoined1 = cron.schedule(
  //   '*/2 * * * *',
  //   followUpJoined1,
  //   cronOptions,
  // );

  // Run every 10 minutes. Check for joined members that the bot missed and add them.
  // service._taskCheckMissing = cron.schedule(
  //   '*/10 * * * *',
  //   checkMissing,
  //   cronOptions,
  // );

  // Run at 10am each day.
  // service._taskFollowUpDaily = cron.schedule(
  //   '0 10 * * *',
  //   followUpDaily,
  //   cronOptions,
  // );

  // Run at 7am each day.
  // service._taskFollowUpDaily = cron.schedule(
  //   '0 7 * * *',
  //   dailyBrief,
  //   cronOptions,
  // );
};

/**
 * Destroy all instances of cron.
 *
 * @return {Promise<void>} A promise.
 */
service.dispose = async () => {
  // service._taskFollowUpJoined1.destroy();
  // service._taskCheckMissing.destroy();
  // service._taskFollowUpDaily.destroy();
};
