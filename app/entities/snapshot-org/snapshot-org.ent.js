/**
 * @fileoverview snapshot.org webhook handler.
 * @see https://docs.snapshot.org/webhooks
 */

const { snapshotWebhookCtrl } = require('./ctrl/snapshot-org-webhook.ctrl');

const { graphQuery } = require('./logic/query-subgraph.ent');

const { queryProposal } = require('./gql-queries/proposal.gql');

const entity = (module.exports = {});

entity.snapshotWebhookCtrl = snapshotWebhookCtrl;

entity.graphQuery = graphQuery;

entity.queryProposal = queryProposal;
