/**
 * @fileoverview Tests in API are Integrations tests.
 */

const testLib = require('../lib/test.lib');

const { webhookCreate } = require('../fixtures/snapshot.fix');

describe('Snapshot Webhooks', () => {
  testLib.init();

  describe(`Happy Path`, () => {
    test('Will handle a create webhook', async () => {
      const agent = testLib.getAgent();
      const res = await agent.post('/snapshot-webhook').send(webhookCreate());

      expect(res.status).toBe(200);
    });
  });
});
