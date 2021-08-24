/**
 * @fileoverview Generic (legacy) formatting of log messages for discord.
 */

const { getClient } = require('../../../services/discord.service');

const entity = (module.exports = {});

/**
 * Format log message to a string.
 *
 * @param {Object} lc Logality log context object.
 * @return {Promise<string>} The string message.
 */
entity.formatMessage = async (lc) => {
  const message = [];

  if (lc.event.error) {
    // suppress occassional 403 errors from RPC
    if (lc?.event?.error?.message?.includes('bad response (status=403')) {
      return;
    }
    message.push(`:octagonal_sign: [${lc.level}] ${lc.message} :: `);
    message.push(`${lc.event.error.name} :: ${lc.event.error.message} :: `);
  }

  if (lc.emoji) {
    message.push(`${lc.emoji} [${lc.level}] ${lc.message}`);
  }

  if (lc.context && lc.context.guild) {
    const gl = lc.context.guild;
    message.push(
      `\n**Joined new guild server**:` +
        ` ${gl.guild_id} :: ${gl.guild_name} :: ${gl.description}.`,
    );
  }
  if (lc.context && lc.context.callrecord && !lc.context.callcomplete) {
    message.push(`**Created new call**:\n`);
  }

  if (lc.context && lc.context.callrecord && lc.context.callcomplete) {
    message.push(`**Making Call**:\n`);
  }

  if (lc.context && lc.context.callrecord) {
    const cr = lc.context.callrecord;
    const guild = await getClient().fetchGuildPreview(cr.discord_guild_id);
    message.push(
      `**Call Id**: ${cr.id} ::\n` +
        `**From User**: ${cr.discord_username} - ${cr.discord_uid}\n` +
        `**The call**: ${cr.call}\n` +
        `**Discord Server**: ${guild.name} - ${cr.discord_guild_id}\n` +
        `**Expires at**: ${cr.call_expires_at}`,
    );
  }

  if (lc?.context?.member_alert_record) {
    const al = lc.context.member_alert_record;
    message.push(
      `**Member**: ${al.discord_username} **Channel**:` +
        ` ${al.discord_channel_name} **Server**: ${al.discord_guild_name}` +
        ` **Pair**: ${al.token_pair} **Threshold**: ${al.diff_threshold_percent}.`,
    );
  }

  message.push(` :: ${lc.message}`);

  const messageStr = message.join('');
  return messageStr;
};
