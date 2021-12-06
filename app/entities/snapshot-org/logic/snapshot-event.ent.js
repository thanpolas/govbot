/**
 * @fileoverview Handles webhook events from snapshot.org.
 */

const config = require('config');

const { events, eventTypes } = require('../../events');
const { queryProposal } = require('../gql-queries/proposal.gql');
const { graphQuery } = require('./query-subgraph.ent');
const globals = require('../../../utils/globals');

const log = require('../../../services/log.service').get();

const {
  SNAPSHOT_PROPOSAL_CREATED,
  SNAPSHOT_PROPOSAL_START,
  SNAPSHOT_PROPOSAL_END,
  SNAPSHOT_PROPOSAL_DELETED,
} = eventTypes;

/** @const {string} EventMap Mapping of snapshot event types to local event types */
const EventMap = {
  'proposal/created': SNAPSHOT_PROPOSAL_CREATED,
  'proposal/start': SNAPSHOT_PROPOSAL_START,
  'proposal/end': SNAPSHOT_PROPOSAL_END,
  'proposal/deleted': SNAPSHOT_PROPOSAL_DELETED,
};

/**
 * Handles the webhook event, will dispatch an event.
 *
 * @param {Object} data The webhook payload.
 * @return {Promise<void>} A Promise.
 */
exports.handleWebhook = async (data) => {
  // {
  //   id: 'proposal/QmZ21uS8tVucpaNq2LZCbZUmHhYYXunC1ZS2gPDNWwPWD9',
  //   event: 'proposal/created',
  //   space: 'yam.eth',
  //   expire: 1620947058
  //   token: 'djasksjsjshshdhasd',
  // }

  const { id: proposalId, event: eventType, space, token } = data;

  if (token !== config.app.snapshot_webhook_token && !globals.isTest) {
    await log.alert('Authentication failed on webhook', { custom: data });
    return;
  }

  await log.info(
    `Webhook event. Type: "${eventType}" Space: "${space}" id: ${proposalId}`,
  );

  // Only process START and END events.
  if (!['proposal/start', 'proposal/end'].includes(eventType)) {
    return;
  }

  // Fetch proposal
  const proposal = await exports._fetchProposal(proposalId);

  // Augment proposal object with the "link" property.
  proposal.link = exports._generateLink(proposal);

  const localEventType = EventMap[eventType];

  events.emit(localEventType, proposal);
};

/**
 * Fetches the proposal data from snapshot's GQL API.
 *
 * @param {string} proposalUri The proposal uri to fetch.
 * @return {Object|void} Fetched proposal object.
 * @private
 */
exports._fetchProposal = async (proposalUri) => {
  const [, proposalId] = proposalUri.split('/');
  const query = queryProposal(proposalId);

  const data = await graphQuery(query);

  return data?.data?.proposal;
};

/**
 * Generate link to a snapshot proposal.
 *
 * @param {Object} proposal Snapshot.org proposal object.
 * @return {string} Link to the proposal.
 * @private
 */
exports._generateLink = (proposal) => {
  // https://snapshot.org/#/uniswap/proposal/QmQbcxLpGENeDauCAsh3BXy9H9fiiK46JEfnLqG3s8iMbN
  const spaceName = proposal.space.name.toLowerCase();
  return `https://snapshot.org/#/${spaceName}/proposal/${proposal.id}`;
};
