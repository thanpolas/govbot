/**
 * @fileoverview Discourse webhook handler.
 * @see https://meta.discourse.org/t/setting-up-webhooks/49045
 */

const { discourseWebhookCtrl } = require('./ctrl/discourse-webhook.ctrl');

exports.discourseWebhookCtrl = discourseWebhookCtrl;
