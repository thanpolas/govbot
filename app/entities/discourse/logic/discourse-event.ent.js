/**
 * @fileoverview Handles webhook events from discourse.
 */

const crypto = require('crypto');

const config = require('config');

const { events, eventTypes } = require('../../events');

const log = require('../../../services/log.service').get();

const { DISCOURSE_NEW_TOPIC } = eventTypes;

/**
 * Handles the webhook event, will dispatch an event.
 *
 * @param {Object} payload The webhook payload.
 * @param {Object} req Express request object.
 * @return {Promise<void>} A Promise.
 */
exports.handleWebhook = async (payload, req) => {
  const { headers } = req;
  // Filter out anything but new topics
  if (headers['x-discourse-event-type'] !== 'topic') {
    return;
  }
  if (headers['x-discourse-event'] !== 'topic_created') {
    return;
  }

  if (!exports._authenticateCall(payload, req)) {
    await log.alert('Authentication failed on Discourse webhook', {
      custom: { payload, headers },
    });
    return;
  }

  // Augment the payload with the discourse instance and link to topic
  payload.instance = headers['x-discourse-instance'];
  payload.link = exports._generateLink(payload);

  await log.info(
    `Discourse Webhook. Instance: ${payload.instance} id: "${payload.id}"`,
  );

  events.emit(DISCOURSE_NEW_TOPIC, payload);
};

/**
 * Authenticates the request.
 *
 * @param {Object} payload The webhook payload.
 * @param {Object} req Express request object.
 * @return {boolean} If the call is authenticated to be from discourse.
 * @private
 */
exports._authenticateCall = (payload, req) => {
  const { headers } = req;

  const sha256 = headers['x-discourse-event-signature'];
  if (!sha256) {
    return false;
  }
  const payloadJSON = req.rawBody.toString();

  // secret: G6zUACgx*o!FcFG3AVTP.MQwCvxHH.aU22-CR9MArA

  const hash = crypto
    .createHmac('sha256', config.app.discourse_webhook_token)
    .update(payloadJSON)
    .digest('hex');

  console.log('hash:', hash);
  console.log('sha256:', sha256);

  return true;
};

/**
 * Generates link to the discourse topic.
 *
 * @param {Object} payload Discourse payload.
 * @return {string} Link to the topic.
 * @private
 */
exports._generateLink = (payload) => {
  // https://gov.uniswap.org/t/consensus-check-deploy-uniswap-v3-to-polygon-pos-chain/15262

  return `${payload.instance}/t/${payload.topic.slug}/${payload.topic.id}`;
};
