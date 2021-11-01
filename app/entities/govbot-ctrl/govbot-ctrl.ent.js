/**
 * @fileoverview Controls the entire govbot operations, determines how many
 *    instances need to run, for which organizations and how.
 */

const _ = require('lodash');
const config = require('config');

const { init: initTwitter } = require('../twitter');
const { init: initDiscordRelay } = require('../discord-relay');
const { init: initVoteAlert } = require('../vote-alert');
const { getAll } = require('./sql/govbot-controller.sql');

/**
 * Prepare and initialize all govbot services based on the defined configurations.
 *
 * @return {Promise<void>}
 */
exports.init = async () => {
  const allConfigurations = await exports.getConfigurations();

  const promises = allConfigurations.map((configuration) => {
    return [
      initTwitter(configuration),
      initDiscordRelay(configuration),
      initVoteAlert(configuration),
    ];
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
  };

  return [configuration];
};