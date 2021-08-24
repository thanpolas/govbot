/**
 * @fileoverview Handle message commands to the bot.
 */

const { getClient } = require('../../services/discord.service');
const { handleMemberCommands } = require('./logic/router-member-command.ent');
const log = require('../../services/log.service').get();

const messageRouter = (module.exports = {});

/**
 * Initialize Discord event listeners for performing message router.
 *
 */
messageRouter.init = async () => {
  await log.info('Initializing message router entity...');
  const client = getClient();

  client.on('message', messageRouter._onMessage);
};

/**
 * Handles incoming message commands from discord.
 *
 * @param {DiscordMessage} message Discord Message Object.
 * @private
 */
messageRouter._onMessage = async (message) => {
  // only care for private messages. (public are  type === "text").
  if (message.channel.type !== 'dm') {
    return;
  }

  const discordAuthor = message.author;
  const client = getClient();

  // ignore own messages
  if (discordAuthor.id === client.user.id) {
    return;
  }

  await handleMemberCommands(message);
};
