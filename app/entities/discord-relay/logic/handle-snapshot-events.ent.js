/**
 * @fileoverview Handles incoming snapshot events from webhook calls and relays
 *    to discord.
 */

const config = require('config');
const { MessageEmbed } = require('discord.js');

const { getLink } = require('../../discord-helpers');
const { events, eventTypes } = require('../../events');
const discordService = require('../../../services/discord.service');
const sendMessageEnt = require('./send-message.ent');

const log = require('../../../services/log.service').get();

const {
  SNAPSHOT_PROPOSAL_START,
  SNAPSHOT_PROPOSAL_END,
  PROPOSAL_ENDS_IN_ONE_HOUR,
} = eventTypes;

/**
 * Listen to events.
 *
 * @param {Object} configuration runtime configuration.
 * @return {Promise<void>} A Promise.
 */
exports.init = async (configuration) => {
  if (!configuration.has_discord) {
    return;
  }
  await log.info(
    `Initializing snapshot event handler for discord for space: ${configuration.space}...`,
  );

  if (!discordService.isConnected(configuration)) {
    await log.warn('Discord service not started, discord relay will not init.');
    return;
  }
  events.on(
    SNAPSHOT_PROPOSAL_START,
    exports._handleEvent.bind(null, configuration, SNAPSHOT_PROPOSAL_START),
  );
  events.on(
    SNAPSHOT_PROPOSAL_END,
    exports._handleEvent.bind(null, configuration, SNAPSHOT_PROPOSAL_END),
  );
};

/**
 * Handles snapshot events, needs to handle own errors.
 *
 * @param {Object} configuration runtime configuration.
 * @param {string} eventType The event type to handle.
 * @param {Object} proposal The snapshot proposal object.
 * @return {Promise<void>} A Promise.
 * @private
 */
exports._handleEvent = async (configuration, eventType, proposal) => {
  try {
    // Check if proposal is for the current configuration.
    if (proposal.space.id !== configuration.space) {
      return;
    }

    // Check if discord integration exists for this configuration
    if (!configuration.has_discord) {
      return;
    }

    const embedMessage = await exports.createEmbedMessage(eventType, proposal);

    await sendMessageEnt.sendEmbedMessage(embedMessage, configuration);

    await log.info(`Discord message sent for event ${eventType}`);
  } catch (ex) {
    await log.error('_handleEvent Error', {
      error: ex,
      custom: { proposal, error: ex },
    });
  }
};

/**
 * Creates the appropriate embed message to send to the channel.
 *
 * @param {string} eventType The event type to handle.
 * @param {Object} proposal The snapshot proposal object.
 * @return {Promise<DiscordMessageEmber>} The embed message.
 */
exports.createEmbedMessage = async (eventType, proposal) => {
  const embedMessage = new MessageEmbed();
  const embedLink = getLink(proposal.title, proposal.link, 'Go to proposal');

  switch (eventType) {
    case SNAPSHOT_PROPOSAL_START:
      embedMessage
        .setTitle(`📢 Proposal now ACTIVE on Snapshot`)
        .addField('Proposal:', embedLink)
        .setColor(config.discord.embed_color_proposal_start);
      break;
    case SNAPSHOT_PROPOSAL_END:
      embedMessage
        .setTitle(`⛔ Proposal ENDED on Snapshot`)
        .addField('Proposal:', embedLink)
        .setColor(config.discord.embed_color_proposal_end);
      break;
    case PROPOSAL_ENDS_IN_ONE_HOUR:
      embedMessage
        .setTitle(`⏰ Less than an hour left to vote on`)
        .addField('Proposal:', embedLink)
        .setColor(config.discord.embed_color_proposal_end);
      break;
    default:
      await log.warn(`_handleEvent() Bogus event type: "${eventType}"`);
      return;
  }

  return embedMessage;
};
