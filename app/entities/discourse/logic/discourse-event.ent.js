/**
 * @fileoverview Handles webhook events from discourse.
 */

const crypto = require('crypto');

const config = require('config');

const { events, eventTypes } = require('../../events');
const globals = require('../../../utils/globals');
const govbotCtrlEnt = require('../../govbot-ctrl');

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

  if (!exports._authenticateCall(req)) {
    await log.alert('Authentication failed on Discourse webhook', {
      custom: { payload, headers },
      req,
    });
    return;
  }

  // Augment the payload with the discourse instance and link to topic
  payload.instance = headers['x-discourse-instance'];
  payload.link = exports._generateLink(payload);

  const configFound = await exports._findConfiguration(payload);
  if (!configFound) {
    return;
  }

  await log.info(
    `Discourse Webhook Called. Instance: ${payload.instance} - ` +
      `Space: ${payload} - Topic id: "${payload.topic.id}"`,
  );

  events.emit(DISCOURSE_NEW_TOPIC, payload);
};

/**
 * Authenticates the request.
 *
 * @param {Object} req Express request object.
 * @return {boolean} If the call is authenticated to be from discourse.
 * @private
 */
exports._authenticateCall = (req) => {
  // Skip authentication on testing
  if (globals.isTest) {
    return true;
  }

  const { headers } = req;

  const sha256SignatureRaw = headers['x-discourse-event-signature'];
  if (!sha256SignatureRaw) {
    return false;
  }
  const rawPayload = req.rawBody.toString();

  const hash = crypto
    .createHmac('sha256', config.app.discourse_webhook_token)
    .update(rawPayload)
    .digest('hex');

  const [, sha256Signature] = sha256SignatureRaw.split('=');
  // eslint-disable-next-line security-node/detect-possible-timing-attacks
  if (hash !== sha256Signature) {
    return false;
  }

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

/**
 * Will search for and add the configuration space id to the payload.
 *
 * If no configuration is found, false is returned.
 *
 * @param {Object} payload The webhook payload.
 * @return {Promise<boolean>} A Promise with true of a configuration was found.
 * @private
 */
exports._findConfiguration = async (payload) => {
  const allConfigurations = await govbotCtrlEnt.getConfigurations();

  const { instance } = payload;
  let configFound = false;
  allConfigurations.forEach((configuration) => {
    if (!configuration.wants_discourse_integration) {
      return;
    }
    if (configuration.discourse_instance_name === instance) {
      configFound = true;
      payload.space = configuration.space;
    }
  });
  return configFound;
};
