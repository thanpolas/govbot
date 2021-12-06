/**
 * @fileoverview Guild related methods.
 */

const { getClient } = require('../../../services/discord.service');

const entity = (module.exports = {});

/**
 * Gets the Guild Object based on the id.
 *
 * @param {string} space The snapshot.org space name.
 * @param {string} guildId the guild id.
 * @return {Promise<DiscordGuild>} Returns the guild instance.
 */
entity.getGuild = async (space, guildId) => {
  const guild = await getClient(space).guilds.cache.get(guildId);

  return guild;
};

/**
 * Fetches the Guild Channel instance based on the provided channel id.
 *
 * @param {string} space The snapshot.org space name.
 * @param {string} channelId The channel id to be fetched.
 * @return {Promise<DiscordGuildChannel>}
 */
entity.getGuildChannel = async (space, channelId) => {
  const guildChannel = await getClient(space).channels.fetch(channelId);

  return guildChannel;
};

/**
 * Gets the guildmember instance from a discord member id.
 *
 * @param {string} space The snapshot.org space name.
 * @param {string} guildId the guild id.
 * @param {DiscordMemberId} discordMemberId Discord member id.
 * @return {Promise<DiscordGuildMember|null>} Returns the guildmember instance
 *    or null if member does not exist in the guild.
 */
entity.getGuildMemberUid = async (space, guildId, discordMemberId) => {
  try {
    const guild = await entity.getGuild(space, guildId);

    const guildMember = guild.members.fetch(discordMemberId);

    return guildMember;
  } catch (ex) {
    return null;
  }
};
