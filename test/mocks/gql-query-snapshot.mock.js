/**
 * @fileoverview Mock the GQL query for proposals from snapshot.org.
 */

const snapshotEventEnt = require('../../app/entities/snapshot-org/logic/snapshot-event.ent');

const { proposalFix } = require('../fixtures/snapshot.fix');

const mock = (module.exports = {});

/**
 * Mock the GQL query for proposals from snapshot.org.
 *
 * @param {Object=} opts Options for the mock.
 * @return {Object} An object with the mocks.
 */
mock.fetchProposalMock = (opts = {}) => {
  const { proposalId } = opts;
  const fetchProposalMock = jest.fn(() =>
    Promise.resolve(proposalFix(proposalId)),
  );
  snapshotEventEnt._fetchProposal = fetchProposalMock;
  return { fetchProposalMock };
};
