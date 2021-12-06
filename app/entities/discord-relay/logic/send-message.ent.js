/**
 * @fileoverview Prepare and send messages to discord.
 */

const { getGuildChannel } = require('../../discord-helpers');

const discordService = require('../../../services/discord.service');

/**
 * Sends an embed message to the appropriate channel.
 *
 * @param {Object} embedMessage Discord embed message.
 * @param {Object} configuration runtime configuration.
 * @return {Promise<void>}
 */
exports.sendEmbedMessage = async (embedMessage, configuration) => {
  if (!discordService.isConnected(configuration)) {
    return;
  }

  const { space, discord_gov_channel_id } = configuration;
  const discordChannel = await getGuildChannel(space, discord_gov_channel_id);

  await discordChannel.send({ embeds: [embedMessage] });
};
