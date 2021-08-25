/**
 * @fileoverview Handles webhook events from snapshot.org.
 */

const { events, eventTypes } = require('../../events');
const { queryProposal } = require('../gql-queries/proposal.gql');
const { graphQuery } = require('./query-subgraph.ent');

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
  'proposal/deleted ': SNAPSHOT_PROPOSAL_DELETED,
};

const entity = (module.exports = {});

/**
 * Handles the webhook event, will dispatch an event.
 *
 * @param {Object} data The webhook payload.
 * @return {Promise<void>} A Promise.
 */
entity.handleWebhook = async (data) => {
  // {
  //   id: 'proposal/QmZ21uS8tVucpaNq2LZCbZUmHhYYXunC1ZS2gPDNWwPWD9',
  //   event: 'proposal/created',
  //   space: 'yam.eth',
  //   expire: 1620947058
  // }

  const { id: proposalId, event: eventType, space } = data;

  await log.info(
    `Webhook event. Type: "${eventType}" Space: "${space}" id: ${proposalId}`,
  );

  // Fetch proposal
  const proposal = await entity._fetchProposal(proposalId);

  // Augment proposal object with the "link" property.
  proposal.link = entity._generateLink(proposal);

  const localEventType = EventMap[eventType];
  events.emit(localEventType, proposal);
};

/**
 * Fetches the proposal data from snapshot's GQL API.
 *
 * @param {string} proposalId The proposal id to fetch.
 * @return {Object|void} Fetched proposal object.
 * @private
 */
entity._fetchProposal = async (proposalId) => {
  const data = await graphQuery(queryProposal(proposalId));

  return data?.data?.proposal;
};

/**
 * Generate link to a snapshot proposal.
 *
 * @param {Object} proposal Snapshot.org proposal object.
 * @return {string} Link to the proposal.
 * @private
 */
entity._generateLink = (proposal) => {
  // https://snapshot.org/#/uniswap/proposal/QmQbcxLpGENeDauCAsh3BXy9H9fiiK46JEfnLqG3s8iMbN
  return `https://snapshot.org/#/${proposal.space.name}/${proposal.id}`;
};
