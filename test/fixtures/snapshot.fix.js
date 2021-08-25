/**
 * @fileoverview Fixtures related to snapshot.org service.
 */

const fix = (module.exports = {});

fix.proposalId = 'QmQbcxLpGENeDauCAsh3BXy9H9fiiK46JEfnLqG3s8iMbN';

fix.webhookCreateFix = () => {
  return {
    id: `proposal/${fix.proposalId}`,
    event: 'proposal/created',
    space: 'uniswap',
    expire: 1620947058,
  };
};

fix.webhookStartFix = () => {
  return {
    id: `proposal/${fix.proposalId}`,
    event: 'proposal/start',
    space: 'uniswap',
    expire: 1620947058,
  };
};

fix.webhookEndFix = () => {
  return {
    id: `proposal/${fix.proposalId}`,
    event: 'proposal/end',
    space: 'uniswap',
    expire: 1620947058,
  };
};

fix.webhookDeletedFix = () => {
  return {
    id: `proposal/${fix.proposalId}`,
    event: 'proposal/deleted',
    space: 'uniswap',
    expire: 1620947058,
  };
};

fix.proposalFix = () => {
  return {
    id: 'QmQbcxLpGENeDauCAsh3BXy9H9fiiK46JEfnLqG3s8iMbN',
    created: 1624387924,
    space: { name: 'Uniswap', network: '1' },
    type: 'single-choice',
    title: 'Temp Check: Larger Grant Construct // CEA + No Negative Net UNI',
    body:
      'Uniswap should grant $25M to fund Flipside Community-Enabled Analytics via a sustainable yield-generating investment strategy that:\n' +
      '1. Produces analytics that drive user education and customer growth\n' +
      '2. Allocates UNI to participants through bounties, increasing liquidity\n' +
      '3. Uses Uniswap’s own yield mechanisms to enable a largely self-funded program\n' +
      '\n' +
      'Forum Post >> https://gov.uniswap.org/t/temperature-check-larger-grant-program-construct-community-enabled-analytics-no-negative-net-uni/13044',
    choices: ['Yes', 'No'],
    start: 1624387500,
    end: 1624646700,
    state: 'closed',
    link: 'https://snapshot.org/#/uniswap/proposal/QmQbcxLpGENeDauCAsh3BXy9H9fiiK46JEfnLqG3s8iMbN',
  };
};
