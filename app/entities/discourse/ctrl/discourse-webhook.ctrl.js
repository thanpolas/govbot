/**
 * @fileoverview Webhook endpoint for Discourse.
 */

const { handleWebhook } = require('../logic/discourse-event.ent');

const log = require('../../../services/log.service').get();

const ctrl = (module.exports = {});

/**
 * Webhook endpoint for Discourse.
 *
 * @param {Request} req Express request.
 * @param {Response} res Express response.
 * @param {function} next Error handler.
 * @return {Promise} A Promise.
 */
ctrl.discourseWebhookCtrl = async (req, res, next) => {
  try {
    await handleWebhook(req.body, req);
    res.json();
  } catch (ex) {
    log.error('Discourse Webhook error', {
      viewer: req.viewer,
      error: ex,
    });
    next(ex);
  }
};
