/**
 * @fileoverview Handles Member commands.
 */

const messages = require('../messages');

const router = (module.exports = {});

/**
 * Handles commands from members.
 *
 * @param {DiscordMessage} message The incoming message.
 * @return {Promise<void>} A Promise.
 * @private
 */
router.handleMemberCommands = async (message) => {
  const [command /* , cmdArgument */] = message.content.split(' ');

  switch (command) {
    case '!help':
      await message.channel.send(messages.help());
      break;
    default:
      await message.channel.send(messages.error());
      break;
  }
};
