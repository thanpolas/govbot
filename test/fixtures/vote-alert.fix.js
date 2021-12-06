/**
 * @fileoverview Fixtures for vote alert records.
 */

const fix = (module.exports = {});

fix.voteAlertReadyToGo = () => {
  const dtNow = new Date();
  const nowJSTimestamp = dtNow.getTime();
  const oneHourFromNow = nowJSTimestamp + 3600 * 1000;
  const dtOneHour = new Date(oneHourFromNow);
  const fiveMinutesAgo = nowJSTimestamp - 300 * 1000;
  const dtFiveMinutesAgo = new Date(fiveMinutesAgo);
  return {
    space: 'uniswap',
    proposal_id: 'QmQbcxLpGENeDauCAsh3BXy9H9fiiK46JEfnLqG3s8iMbN',
    title: 'Temp Check: Larger Grant Construct // CEA + No Negative Net UNI',
    link: 'https://snapshot.org/#/uniswap/proposal/QmQbcxLpGENeDauCAsh3BXy9H9fiiK46JEfnLqG3s8iMbN',
    expires_at: dtOneHour,
    alert_at: dtFiveMinutesAgo,
    alert_twitter_dispatched: false,
    alert_discord_dispatched: false,
    alert_done: false,
  };
};
