/**
 * @fileoverview Configuration fixtures.
 */

exports.configurationFix = () => {
  return {
    space: 'uniswap',
    has_twitter: true,
    twitter_consumer_key: 'DO NOT SET - USE ENV VAR: TWITTER_CONSUMER_KEY',
    twitter_consumer_secret:
      'DO NOT SET - USE ENV VAR: TWITTER_conSUMER_SECRET',
    twitter_access_token: 'DO NOT SET - USE ENV VAR: TWITTER_ACCESS_TOKEN',
    twitter_access_token_secret:
      'DO NOT SET - USE ENV VAR: TWITTER_ACCESS_TOKEN_SECRET',
    has_discord: true,
    discord_token: 'DO NOT SET - USE ENV VAR: DISCORD_BOT_TOKEN',
    discord_gov_channel_id: 'DO NOT SET - USE ENV VAR: DISCORD_GOV_CHANNEL_ID',
    wants_vote_end_alerts: true,
    wants_discourse_integration: true,
  };
};
