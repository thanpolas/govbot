/**
 * @fileoverview Handles incoming discourse events from webhook calls and relays
 *    to discord.
 */

const config = require('config');
const { MessageEmbed } = require('discord.js');

const { getLink } = require('../../discord-helpers');
const { events, eventTypes } = require('../../events');
const discordService = require('../../../services/discord.service');
const { sendEmbedMessage } = require('./send-message.ent');

const log = require('../../../services/log.service').get();

/**
 * Listen to events.
 *
 * @param {Object} configuration runtime configuration.
 * @return {Promise<void>} A Promise.
 */
exports.init = async (configuration) => {
  if (
    !configuration.has_discord ||
    !configuration.wants_discourse_integration
  ) {
    return;
  }
  await log.info(
    `Initializing discourse event handler for discord for space: ${configuration.space}...`,
  );

  if (!discordService.isConnected(configuration)) {
    await log.warn('Discord service not started, discord relay will not init.');
    return;
  }
  events.on(
    eventTypes.DISCOURSE_NEW_TOPIC,
    exports._handleEvent.bind(null, configuration),
  );
};

/**
 * Handles snapshot events, needs to handle own errors.
 *
 * @param {Object} configuration runtime configuration.
 * @param {Object} discourseTopic The discourse topic data object (webhook payload).
 * @return {Promise<void>} A Promise.
 * @private
 */
exports._handleEvent = async (configuration, discourseTopic) => {
  try {
    // Check if event is for the current configuration.
    if (discourseTopic.space !== configuration.space) {
      return;
    }

    // Check if discord integration exists for this configuration
    if (!configuration.has_discord) {
      return;
    }

    const embedMessage = await exports.createEmbedMessage(discourseTopic);

    await sendEmbedMessage(embedMessage, configuration);

    await log.info(`Discord message sent for new discourse topic`);
  } catch (ex) {
    await log.error('_handleEvent Error', {
      error: ex,
      custom: { discourseTopic, error: ex },
    });
  }
};

/**
 * Creates the appropriate embed message to send to the channel.
 *
 * @param {string} eventType The event type to handle.
 * @param {Object} discourseTopic The discourse topic object.
 * @return {Promise<DiscordMessageEmber>} The embed message.
 */
exports.createEmbedMessage = async (eventType, discourseTopic) => {
  const embedMessage = new MessageEmbed();
  const embedLink = getLink(
    discourseTopic.title,
    discourseTopic.link,
    'Go to topic',
  );

  embedMessage
    .setTitle(`📫 New topic posted`)
    .addField('Topic:', embedLink)
    .setColor(config.discord.embed_color_proposal_start);

  return embedMessage;
};
