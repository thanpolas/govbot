/**
 * @fileoverview Tests in API are Integrations tests.
 */

const testLib = require('../lib/test.lib');

const {
  webhookCreateFix,
  webhookStartFix,
  webhookEndFix,
  webhookDeletedFix,
} = require('../fixtures/snapshot.fix');
const { dispatchesMock } = require('../mocks/dispatches.mock');

describe('Snapshot Webhooks', () => {
  testLib.init();

  describe(`Happy Path`, () => {
    test('Will handle a create webhook', async () => {
      const { tweetMock, discordMock } = dispatchesMock();
      const agent = testLib.getAgent();

      const res = await agent
        .post('/snapshot-webhook')
        .send(webhookCreateFix());

      expect(res.status).toBe(200);

      expect(tweetMock).toHaveBeenCalledTimes(0);
      expect(discordMock).toHaveBeenCalledTimes(0);
    });

    test('Will handle a start webhook', async () => {
      const { tweetMock, discordMock } = dispatchesMock();
      const agent = testLib.getAgent();

      const res = await agent.post('/snapshot-webhook').send(webhookStartFix());

      expect(res.status).toBe(200);

      expect(tweetMock).toHaveBeenCalledTimes(1);
      expect(discordMock).toHaveBeenCalledTimes(1);

      const expectedMessage =
        '📢 Proposal now ACTIVE on Snapshot:\n\n"Temp Check: Larger Grant Construct // CEA + No Negative Net UNI"\n\nhttps://snapshot.org/#/uniswap/proposal/QmQbcxLpGENeDauCAsh3BXy9H9fiiK46JEfnLqG3s8iMbN';
      expect(tweetMock).toHaveBeenCalledWith(expectedMessage);
    });

    test('Will handle an end webhook', async () => {
      const { tweetMock, discordMock } = dispatchesMock();
      const agent = testLib.getAgent();

      const res = await agent.post('/snapshot-webhook').send(webhookEndFix());

      expect(res.status).toBe(200);

      expect(tweetMock).toHaveBeenCalledTimes(1);
      expect(discordMock).toHaveBeenCalledTimes(1);

      const expectedMessage =
        '⛔ Proposal ENDED on Snapshot:\n\n"Temp Check: Larger Grant Construct // CEA + No Negative Net UNI"\n\nhttps://snapshot.org/#/uniswap/proposal/QmQbcxLpGENeDauCAsh3BXy9H9fiiK46JEfnLqG3s8iMbN';
      expect(tweetMock).toHaveBeenCalledWith(expectedMessage);
    });

    test('Will handle a delete webhook', async () => {
      const { tweetMock, discordMock } = dispatchesMock();
      const agent = testLib.getAgent();

      const res = await agent
        .post('/snapshot-webhook')
        .send(webhookDeletedFix());

      expect(res.status).toBe(200);

      expect(tweetMock).toHaveBeenCalledTimes(0);
      expect(discordMock).toHaveBeenCalledTimes(0);
    });
  });
});
