/**
 * @fileoverview Handles incoming snapshot events from webhook calls and relays
 *    to discord.
 */

const config = require('config');
const { MessageEmbed } = require('discord.js');

const { events, eventTypes } = require('../../events');
const { getLink, getGuildChannel } = require('../../discord-helpers');
const { isConnected } = require('../../../services/discord.service');

const log = require('../../../services/log.service').get();

const {
  SNAPSHOT_PROPOSAL_START,
  SNAPSHOT_PROPOSAL_END,
  PROPOSAL_ENDS_IN_ONE_HOUR,
} = eventTypes;

const entity = (module.exports = {});

/**
 * Listen to events.
 *
 * @param {Object} configuration runtime configuration.
 * @return {Promise<void>} A Promise.
 */
entity.init = async (configuration) => {
  if (!configuration.has_discord) {
    return;
  }
  await log.info(
    `Initializing snapshot event handler for discord for space: ${configuration.space}...`,
  );
  if (!isConnected()) {
    await log.warn('Discord service not started, discord relay will not init.');
    return;
  }
  events.on(
    SNAPSHOT_PROPOSAL_START,
    entity._handleEvent.bind(null, configuration, SNAPSHOT_PROPOSAL_START),
  );
  events.on(
    SNAPSHOT_PROPOSAL_END,
    entity._handleEvent.bind(null, configuration, SNAPSHOT_PROPOSAL_END),
  );
};

/**
 * Sends an embed message to the appropriate channel.
 *
 * @param {Object} embedMessage Discord embed message.
 * @param {Object} configuration runtime configuration.
 * @return {Promise<void>}
 */
entity.sendEmbedMessage = async (embedMessage, configuration) => {
  if (!isConnected()) {
    return;
  }

  const { space, discord_gov_channel_id } = configuration;
  const discordChannel = await getGuildChannel(space, discord_gov_channel_id);

  await discordChannel.send({ embeds: [embedMessage] });
};

/**
 * Creates the appropriate embed message to send to the channel.
 *
 * @param {string} eventType The event type to handle.
 * @param {Object} proposal The snapshot proposal object.
 * @return {Promise<DiscordMessageEmber>} The embed message.
 */
entity.createEmbedMessage = async (eventType, proposal) => {
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

/**
 * Handles snapshot events, needs to handle own errors.
 *
 * @param {Object} configuration runtime configuration.
 * @param {string} eventType The event type to handle.
 * @param {Object} proposal The snapshot proposal object.
 * @return {Promise<void>} A Promise.
 * @private
 */
entity._handleEvent = async (configuration, eventType, proposal) => {
  try {
    // Check if proposal is for the current configuration.
    if (proposal.space !== configuration.space) {
      return;
    }

    // Check if discord integration exists for this configuration
    if (!configuration.has_discord) {
      return;
    }

    const embedMessage = await entity.createEmbedMessage(eventType, proposal);

    await entity.sendEmbedMessage(embedMessage, configuration);

    await log.info(`Discord message sent for event ${eventType}`);
  } catch (ex) {
    await log.error('_handleEvent Error', {
      error: ex,
      custom: { proposal, error: ex },
    });
  }
};
