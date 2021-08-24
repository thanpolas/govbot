/**
 * @fileoverview Functions related to channels.
 */

const config = require('config');
const { getClient } = require('../../../services/discord.service');
const { getGuildChannel } = require('./guild.ent');
const { asyncMapCap } = require('../../../utils/helpers');

const entity = (module.exports = {});

/**
 * @param {?Object} _mainChannel Store the reference of the main channel.
 * @private
 */
entity._mainChannel = null;

/**
 * Returns the main channel of the server, will cache it on the first invocation.
 *
 * @return {Object} The main channel of the server.
 */
entity.getMainChannel = () => {
  if (entity._mainChannel) {
    return entity._mainChannel;
  }
  const discordClient = getClient();

  entity._mainChannel = discordClient.channels.cache.get(
    config.discord.main_channel_id,
  );

  return entity._mainChannel;
};

/**
 * Send ember messages to all channels.
 *
 * @param {DiscordMessageEmber} embedMessage The embed message to populate.
 * @param {Array.<string>} channelIds The channel ids to populate to.
 * @return {Promise<void>}
 * @private
 */
entity.sendMessageToChannels = async (embedMessage, channelIds) => {
  await asyncMapCap(channelIds, async (channelId) => {
    const guildChannel = await getGuildChannel(channelId);
    await guildChannel.send(embedMessage);
  });
};
