/**
 * @fileoverview Fixtures are your test data, they should be functions returning
 *   the values you need.
 */

const fix = (module.exports = {});

fix.proposalId = 'QmQbcxLpGENeDauCAsh3BXy9H9fiiK46JEfnLqG3s8iMbN';

fix.webhookCreate = () => {
  return {
    id: `proposal/${fix.proposalId}`,
    event: 'proposal/created',
    space: 'uniswap',
    expire: 1620947058,
  };
};

fix.webhookStart = () => {
  return {
    id: `proposal/${fix.proposalId}`,
    event: 'proposal/start',
    space: 'uniswap',
    expire: 1620947058,
  };
};

fix.webhookEnd = () => {
  return {
    id: `proposal/${fix.proposalId}`,
    event: 'proposal/end',
    space: 'uniswap',
    expire: 1620947058,
  };
};

fix.webhookDeleted = () => {
  return {
    id: `proposal/${fix.proposalId}`,
    event: 'proposal/deleted',
    space: 'uniswap',
    expire: 1620947058,
  };
};
