/**
 * @fileoverview Main entry point for relaying logs to appropriate admin discord
 *    channels.
 */

const config = require('config');
const format = require('date-fns/format');

const { isConnected } = require('../../../services/discord.service');
const globals = require('../../../utils/globals');
const { getGuildChannel } = require('../../discord');
const { formatMessage } = require('./generic-formatting.ent');
const { handleErrors } = require('./handle-errors.ent');
const { LogEvents } = require('../../events');
const { sendLog } = require('./send-message.ent');

const entity = (module.exports = {});

/** @type {DiscordChannel?} Main log channel. */
entity._logChannelMain = null;
/** @type {DiscordChannel?} Error log channel. */
entity._logChannelErrors = null;
/** @type {DiscordChannel?} Price Alerts log channel. */
entity._logChannelAlerts = null;

entity.init = async () => {
  entity._logChannelMain = await getGuildChannel(
    config.discord.bot_log_channel_id,
  );
  entity._logChannelErrors = await getGuildChannel(
    config.discord.bot_log_errors_channel_id,
  );
  entity._logChannelAlerts = await getGuildChannel(
    config.discord.bot_log_alerts_channel_id,
  );
};

/**
 * Middleware for logality, will relay select log messages to the appropriate
 * discord admin channels.
 *
 * @param {Object} logContext Logality log context object.
 * @return {Promise<void>} A Promise.
 */
entity.loggerToAdmin = async (logContext) => {
  // Don't log when not connected to discord
  if (!isConnected()) {
    return;
  }

  // don't relay when testing
  if (globals.isTest) {
    return;
  }

  if (!entity._logChannelMain) {
    return;
  }

  // Handle errors
  if (logContext.severity < 5) {
    return handleErrors(logContext, entity._logChannelErrors);
  }

  // Continue only if the log has the relay flag
  if (!logContext.relay) {
    return;
  }

  if (logContext.relay === LogEvents.ALERT_DM) {
    return entity._handleAlertDm(logContext, entity._logChannelAlerts);
  }

  // Default treatment
  const message = await formatMessage(logContext);

  if (!message) {
    return;
  }

  await sendLog(message, entity._logChannelMain, logContext);
};

/**
 * Format an log alert DM message to a string and send it to the appropriate channel.
 *
 * @param {Object} lc Logality log context object.
 * @param {DiscordChannel} channel The discord channel object to send to.
 * @return {Promise<string>} The string message.
 */
entity._handleAlertDm = async (lc, channel) => {
  const { member_alert_record: member } = lc.context;
  const dt = new Date(lc.dt);
  const dtStr = format(dt, 'HH:mm:ss.SSS');
  const message =
    `${dtStr} Alert for: "**${member.discord_username}**" From Server:` +
    ` "**${member.discord_guild_name}**" :: ${lc.context.price_alert_message}`;

  await sendLog(message, channel, lc);
};
