/**
 * @fileoverview Controls the entire govbot operations, determines how many
 *    instances need to run, for which organizations and how.
 */

const _ = require('lodash');
const config = require('config');

const { init: initTwitter } = require('../twitter');
const { init: initDiscordRelay } = require('../discord-relay');

const {
  init: initVoteAlert,
  // Require directly to avoid a circular dependency with the
  // "logic/check-for-alert.ent.js" module.
} = require('../vote-alert/logic/handle-create-vote.ent');
const { getAll } = require('./sql/govbot-controller.sql');
const discordService = require('../../services/discord.service');

/**
 * @type {Object?} Runtime cache for all configurations.
 * @private
 */
exports._allConfigurations = null;

/**
 * Prepare and initialize all govbot services based on the defined configurations.
 *
 * @param {Object} bootOpts Application boot options.
 * @param {boolean} bootOpts.testing When true go into testing mode.
 * @return {Promise<void>}
 */
exports.init = async (bootOpts) => {
  const allConfigurations = (exports._allConfigurations =
    await exports.getConfigurations());

  await initVoteAlert();

  const promises = allConfigurations.map((configuration) => {
    const proms = [];
    if (configuration.has_twitter) {
      proms.push(initTwitter(configuration));
    }

    if (configuration.has_discord) {
      proms.push(discordService.init(bootOpts, configuration));
      proms.push(initDiscordRelay(configuration));
    }

    return proms;
  });

  const promisesFlattened = _.flatten(promises);

  await Promise.all(promisesFlattened);
};

/**
 * Will prepare and return the current configurations found.
 *
 * @return {Promise<Array<Object>>} A promise with the configurations.
 */
exports.getConfigurations = async () => {
  if (exports._allConfigurations) {
    return exports._allConfigurations;
  }

  const allCtrls = await getAll();
  if (allCtrls.length) {
    return allCtrls;
  }

  const configuration = {
    space: config.app.space,
    has_twitter: config.app.has_twitter,
    twitter_consumer_key: config.twitter.consumer_key,
    twitter_consumer_secret: config.twitter.consumer_secret,
    twitter_access_token: config.twitter.access_token,
    twitter_access_token_secret: config.twitter.access_token_secret,
    has_discord: config.app.has_discord,
    discord_token: config.discord.token,
    discord_gov_channel_id: config.discord.gov_channel_id,
    wants_vote_end_alerts: config.app.wants_vote_end_alerts,
    wants_discourse_integration: config.app.wants_discourse_alerts,
    discourse_instance_name: config.app.discourse_instance_name,
  };

  if (configuration.has_discord === 'false') {
    configuration.has_discord = false;
  }

  return [configuration];
};
