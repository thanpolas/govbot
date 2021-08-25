/**
 * @fileoverview Webhook endpoint for snapshot.org.
 */

const { handleWebhook } = require('../logic/snapshot-event.ent');

const log = require('../../../services/log.service').get();

const ctrl = (module.exports = {});

/**
 * Webhook endpoint for snapshot.org.
 *
 * @param {Request} req Express request.
 * @param {Response} res Express response.
 * @param {function} next Error handler.
 * @return {Promise} A Promise.
 */
ctrl.snapshotWebhookCtrl = async (req, res, next) => {
  try {
    await handleWebhook(req.body);
    res.json();
  } catch (ex) {
    log.error('Secret-update error', {
      viewer: req.viewer,
      error: ex,
    });
    next(ex);
  }
};
