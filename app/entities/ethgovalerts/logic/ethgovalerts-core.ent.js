/**
 * @fileoverview Core ethgovalerts functionality.
 */

const config = require('config');
const TwitterApi = require('twitter');

const { events, eventTypes } = require('../../events');
const { Protocols } = require('../../twitter/constants/protocols.const');
const { prepareMessage } = require('../../twitter');
const {
  update: updateAlert,
} = require('../../vote-alert/sql/vote-ends-alert.sql');
const log = require('../../../services/log.service').get();

const { SNAPSHOT_PROPOSAL_START, PROPOSAL_ENDS_IN_ONE_HOUR } = eventTypes;

exports._twClient = null;

/**
 * Initialize the ethgovalerts functionality if enabled.
 */
exports.init = async () => {
  if (config.app.has_ethgovalerts !== '1') {
    return;
  }

  await log.notice('Booting ethgovalerts entity...');

  exports.initTwitter();
  await exports._twClient.post('statuses/update', { status: 'message test' });

  events.on(SNAPSHOT_PROPOSAL_START, exports._handleProposalStart);
  events.on(PROPOSAL_ENDS_IN_ONE_HOUR, exports._handleProposalAlert);
};

/**
 * Initialize ethgovalerts twitter client.
 *
 */
exports.initTwitter = () => {
  const twitterConfig = {
    consumer_key: config.twitter_ethgovalerts.consumer_key,
    consumer_secret: config.twitter_ethgovalerts.consumer_secret,
    access_token_key: config.twitter_ethgovalerts.access_token,
    access_token_secret: config.twitter_ethgovalerts.access_token_secret,
  };

  console.log('TWITTER CNFIG ETHGOV:', twitterConfig);
  exports._twClient = new TwitterApi(twitterConfig);
};

/**
 * A Proposal has started on a protocol.
 *
 * @param {Object} proposal The proposal object from snapshot.
 * @return {Promise<void>}
 * @private
 */
exports._handleProposalStart = async (proposal) => {
  try {
    // Check if proposal should be published.
    const protocolTwitterUsername = Protocols[proposal.space.id];
    if (!protocolTwitterUsername) {
      return;
    }

    const configMock = {
      space: proposal.space.id,
    };
    const message = await prepareMessage(
      `📢 Voting STARTED on @${protocolTwitterUsername} for proposal`,
      configMock,
      proposal.title,
      proposal.link,
    );

    // send the tweet
    await exports._twClient.post('statuses/update', { status: message });
  } catch (ex) {
    await log.error('Error on ethgovalert _handleProposalStart()', {
      error: ex,
    });
  }
};

/**
 * 1 hour before voting ends alert.
 *
 * @param {Object} alertRecord The alert record that triggered.
 * @return {Promise<void>}
 * @private
 */
exports._handleProposalAlert = async (alertRecord) => {
  try {
    // Check if proposal alert should be published.
    const protocolTwitterUsername = Protocols[alertRecord.space];
    if (!protocolTwitterUsername) {
      return;
    }

    const configMock = {
      space: alertRecord.space,
    };
    const tweetMessage = await prepareMessage(
      `⏰ Less than an hour left to vote on @${protocolTwitterUsername}`,
      configMock,
      alertRecord.title,
      alertRecord.link,
    );

    await exports._twClient.post('statuses/update', { status: tweetMessage });

    const updateData = {
      alert_twitter_dispatched: true,
    };

    await updateAlert(alertRecord.id, updateData);
  } catch (ex) {
    await log.error('_handleProposalAlert() ethgovalerts Error', {
      error: ex,
    });
  }
};
