/**
 * @fileoverview Available event types.
 */

const consts = (module.exports = {});

/**
 * @enum {string} Available event types.
 */
consts.eventTypes = {
  SNAPSHOT_PROPOSAL_CREATED: 'snapshotProposalCreated',
  SNAPSHOT_PROPOSAL_START: 'snapshotProposalStart',
  SNAPSHOT_PROPOSAL_END: 'snapshotProposalEnd',
  SNAPSHOT_PROPOSAL_DELETED: 'snapshotProposalDeleted',
  PROPOSAL_ENDS_IN_ONE_HOUR: 'proposalEndsInOneHour',
};
