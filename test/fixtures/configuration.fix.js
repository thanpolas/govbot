/**
 * @fileoverview Configuration fixtures.
 */

exports.configurationFix = (opts = {}) => {
  return {
    space: opts.space || 'uniswap',
    has_twitter: opts.has_twitter || true,
    twitter_consumer_key:
      opts.twitter_consumer_key ||
      'DO NOT SET - USE ENV VAR: TWITTER_CONSUMER_KEY',
    twitter_consumer_secret:
      opts.twitter_consumer_secret ||
      'DO NOT SET - USE ENV VAR: TWITTER_conSUMER_SECRET',
    twitter_access_token:
      opts.twitter_access_token ||
      'DO NOT SET - USE ENV VAR: TWITTER_ACCESS_TOKEN',
    twitter_access_token_secret:
      opts.twitter_access_token_secret ||
      'DO NOT SET - USE ENV VAR: TWITTER_ACCESS_TOKEN_SECRET',
    has_discord: opts.has_discord || true,
    discord_token:
      opts.discord_token || 'DO NOT SET - USE ENV VAR: DISCORD_BOT_TOKEN',
    discord_gov_channel_id:
      opts.discord_gov_channel_id ||
      'DO NOT SET - USE ENV VAR: DISCORD_GOV_CHANNEL_ID',
    wants_vote_end_alerts: opts.wants_vote_end_alerts || true,
    wants_discourse_integration: opts.wants_discourse_integration || true,
    discourse_instance_name: opts.discourse_instance_name || '',
  };
};
