/**
 * @fileoverview Proposal GraphQL Query of snapshot.
 */

const gql = (module.exports = {});

/**
 * Get query for snapsnot proposal.
 *
 * @param {string} proposalId The proposal id to fetch.
 * @return {Object} GQL Query.
 */
gql.queryProposal = (proposalId) => {
  return {
    query: `query Proposal($proposalId: String!) {
  proposal(id: $proposalId) {
    id
    created
    space {
      name
      network
    }
    type
    title
    body
    choices
    start
    end
    state
  }
}`,
    variables: {
      proposalId,
    },
  };
};
