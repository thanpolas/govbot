/**
 * @fileoverview The Web Router.
 */

const { health } = require('../../entities/health-check');
const { snapshotWebhookCtrl } = require('../../entities/snapshot-org');
const { discourseWebhookCtrl } = require('../../entities/discourse');

const router = (module.exports = {});

/**
 * Setup available routes.
 *
 * @param {Express} app The express instance.
 */
router.setup = (app) => {
  app.get('/health', health);
  app.post('/snapshot-webhook', snapshotWebhookCtrl);
  app.post('/discourse-webhook', discourseWebhookCtrl);
};
