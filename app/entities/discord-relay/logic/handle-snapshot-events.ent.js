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

const { SNAPSHOT_PROPOSAL_START, SNAPSHOT_PROPOSAL_END } = eventTypes;

const entity = (module.exports = {});

/**
 * Listen to events.
 *
 * @return {Promise<void>} A Promise.
 */
entity.init = async () => {
  await log.info('Initializing snapshot event handler...');
  if (!isConnected()) {
    await log.warn('Discord service not started, discord relay will not init.');
    return;
  }
  events.on(
    SNAPSHOT_PROPOSAL_START,
    entity._handleEvent.bind(null, SNAPSHOT_PROPOSAL_START),
  );
  events.on(
    SNAPSHOT_PROPOSAL_END,
    entity._handleEvent.bind(null, SNAPSHOT_PROPOSAL_END),
  );
};

/**
 * Sends an embed message to the appropriate channel.
 *
 * @param {Object} embedMessage Discord embed message.
 * @return {Promise<void>}
 */
entity.sendEmbedMessage = async (embedMessage) => {
  if (!isConnected()) {
    return;
  }
  const discordChannel = await getGuildChannel(config.discord.gov_channel_id);

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
    default:
      await log.warn(`_handleEvent() Bogus event type: "${eventType}"`);
      return;
  }

  return embedMessage;
};

/**
 * Handles snapshot events, needs to handle own errors.
 *
 * @param {string} eventType The event type to handle.
 * @param {Object} proposal The snapshot proposal object.
 * @return {Promise<void>} A Promise.
 * @private
 */
entity._handleEvent = async (eventType, proposal) => {
  try {
    const embedMessage = await entity.createEmbedMessage(eventType, proposal);
    await entity.sendEmbedMessage(embedMessage);

    await log.info(`Discord message sent for event ${eventType}`);
  } catch (ex) {
    await log.error('_handleEvent Error', {
      error: ex,
      custom: { proposal, error: ex },
    });
  }
};
