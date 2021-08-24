/**
 * @fileoverview Guild related methods.
 */

const log = require('../../../services/log.service').get();

const entity = (module.exports = {});

/**
 * Bot has joined a new guild.
 *
 * @param {DiscordGuild} guild the guild that was joined.
 * @return {Promise<void>} Returns the guild instance.
 */
entity.guildJoined = async (guild) => {
  await log.info('Bot joined new guild', {
    guild,
    relay: true,
    emoji: ':robot:',
  });
};
