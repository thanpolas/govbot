/**
 * @fileoverview Will check if alert[s] are due and dispatch them.
 */

const BPromise = require('bluebird');

const { getAlerts, update } = require('../sql/vote-ends-alert.sql');
const twitterEnt = require('../../twitter');
const discordEnt = require('../../discord-relay');
const { eventTypes } = require('../../events');
const { getConfigurations } = require('../../govbot-ctrl');
const { indexArrayToObject } = require('../../../utils/helpers');

const log = require('../../../services/log.service').get();

const { PROPOSAL_ENDS_IN_ONE_HOUR } = eventTypes;

const entity = (module.exports = {});

/**
 * Will check if alert[s] are due and dispatch them.
 *
 * @return {Promise<void>} A Promise.
 */
entity.checkForAlerts = async () => {
  try {
    const allConfigurations = await getConfigurations();
    const allPendingAlerts = await getAlerts();
    if (!allPendingAlerts.length) {
      return;
    }

    const configurationsIndexed = indexArrayToObject(
      allConfigurations,
      'space',
    );

    // filter out any organizations that no longer require 1h alerts.
    const pendingAlerts = allPendingAlerts.filter((alertItem) => {
      return configurationsIndexed[alertItem.space]?.wants_vote_end_alerts;
    });
    if (!pendingAlerts.length) {
      return;
    }

    // Augmend alerts with their corresponding configuration.
    pendingAlerts.forEach((alertItem) => {
      alertItem.configuration = configurationsIndexed[alertItem.space];
    });

    await BPromise.mapSeries(pendingAlerts, entity._dispatchAlert);

    await log.info(
      `checkForAlerts() dispatched ${pendingAlerts.length} vote expiration alert[s]`,
    );
  } catch (ex) {
    await log.error('checkForalert Error', {
      error: ex,
    });
  }
};

/**
 * Will dispatch message and save to db.
 *
 * @param {Object} alertRecord The alert record to dispatch.
 * @return {Promise<void>} A Promise.
 * @private
 */
entity._dispatchAlert = async (alertRecord) => {
  const [tweeter, discord] = await Promise.allSettled([
    entity._dispatchTweet(alertRecord),
    entity._dispatchDiscord(alertRecord),
  ]);

  if (tweeter.status === 'fulfilled' && discord.status === 'fulfilled') {
    const updateData = {
      alert_done: true,
    };

    await update(alertRecord.id, updateData);
    return;
  }

  // an error occured, figure out where and why
  if (tweeter.status === 'rejected') {
    await log.error('Tweeter vote ends alert failed', {
      error: tweeter.reason,
    });
  }

  if (discord.status === 'rejected') {
    await log.error('Discord vote ends alert failed', {
      error: discord.reason,
    });
  }
};

/**
 * Dispatch Tweet.
 *
 * @param {Object} alertRecord The alert record to dispatch.
 * @return {Promise<void>} A Promise.
 * @private
 */
entity._dispatchTweet = async (alertRecord) => {
  const { configuration } = alertRecord;

  const tweetMessage = await twitterEnt.prepareMessage(
    '⏰ Less than an hour left to vote on',
    configuration,
    alertRecord.title,
    alertRecord.link,
  );

  await twitterEnt.sendTweet(configuration, tweetMessage);

  const updateData = {
    alert_twitter_dispatched: true,
  };

  await update(alertRecord.id, updateData);
};

/**
 * Dispatch discord message.
 *
 * @param {Object} alertRecord The alert record to dispatch.
 * @return {Promise<void>} A Promise.
 * @private
 */
entity._dispatchDiscord = async (alertRecord) => {
  const { configuration } = alertRecord;
  const embedMessage = await discordEnt.createEmbedMessage(
    PROPOSAL_ENDS_IN_ONE_HOUR,
    alertRecord,
  );
  await discordEnt.sendEmbedMessage(embedMessage, configuration);

  const updateData = {
    alert_discord_dispatched: true,
  };

  await update(alertRecord.id, updateData);
};
