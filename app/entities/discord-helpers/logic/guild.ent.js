/**
 * @fileoverview Guild related methods.
 */

const { getClient } = require('../../../services/discord.service');

const entity = (module.exports = {});

/**
 * Gets the Guild Object based on the id.
 *
 * @param {string} guildId the guild id.
 * @return {Promise<DiscordGuild>} Returns the guild instance.
 */
entity.getGuild = async (guildId) => {
  const guild = await getClient().guilds.cache.get(guildId);

  return guild;
};

/**
 * Fetches the Guild Channel instance based on the provided channel id.
 *
 * @param {string} channelId The channel id to be fetched.
 * @return {Promise<DiscordGuildChannel>}
 */
entity.getGuildChannel = async (channelId) => {
  const guildChannel = await getClient().channels.fetch(channelId);

  return guildChannel;
};

/**
 * Gets the guildmember instance from a discord member id.
 *
 * @param {string} guildId the guild id.
 * @param {DiscordMemberId} discordMemberId Discord member id.
 * @return {Promise<DiscordGuildMember|null>} Returns the guildmember instance
 *    or null if member does not exist in the guild.
 */
entity.getGuildMemberUid = async (guildId, discordMemberId) => {
  try {
    const guild = await entity.getGuild(guildId);

    const guildMember = guild.members.fetch(discordMemberId);

    return guildMember;
  } catch (ex) {
    return null;
  }
};
