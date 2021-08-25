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
const { tweetResponseFix } = require('../fixtures/twitter.fix');
const tweet = require('../../app/entities/twitter/logic/send-tweet.ent');

describe('Snapshot Webhooks', () => {
  testLib.init();

  describe(`Happy Path`, () => {
    beforeEach(() => {
      tweet.sendTweet = jest.fn(() => Promise.resolve(tweetResponseFix()));
    });

    test('Will handle a create webhook', async () => {
      const agent = testLib.getAgent();

      const res = await agent
        .post('/snapshot-webhook')
        .send(webhookCreateFix());

      expect(res.status).toBe(200);

      expect(tweet.sendTweet).toHaveBeenCalledTimes(1);

      const expectedMessage =
        '🆕 Proposal CREATED on Snapshot:\n\n"Temp Check: Larger Grant Construct // CEA + No Negative Net UNI"\n\nhttps://snapshot.org/#/uniswap/proposal/QmQbcxLpGENeDauCAsh3BXy9H9fiiK46JEfnLqG3s8iMbN';
      expect(tweet.sendTweet).toHaveBeenCalledWith(expectedMessage);
    });

    test('Will handle a start webhook', async () => {
      const agent = testLib.getAgent();

      const res = await agent.post('/snapshot-webhook').send(webhookStartFix());

      expect(res.status).toBe(200);

      expect(tweet.sendTweet).toHaveBeenCalledTimes(1);

      const expectedMessage =
        '📢 Proposal now ACTIVE on Snapshot:\n\n"Temp Check: Larger Grant Construct // CEA + No Negative Net UNI"\n\nhttps://snapshot.org/#/uniswap/proposal/QmQbcxLpGENeDauCAsh3BXy9H9fiiK46JEfnLqG3s8iMbN';
      expect(tweet.sendTweet).toHaveBeenCalledWith(expectedMessage);
    });

    test('Will handle an end webhook', async () => {
      const agent = testLib.getAgent();

      const res = await agent.post('/snapshot-webhook').send(webhookEndFix());

      expect(res.status).toBe(200);

      expect(tweet.sendTweet).toHaveBeenCalledTimes(1);

      const expectedMessage =
        '⛔ Proposal ENDED on Snapshot:\n\n"Temp Check: Larger Grant Construct // CEA + No Negative Net UNI"\n\nhttps://snapshot.org/#/uniswap/proposal/QmQbcxLpGENeDauCAsh3BXy9H9fiiK46JEfnLqG3s8iMbN';
      expect(tweet.sendTweet).toHaveBeenCalledWith(expectedMessage);
    });

    test('Will handle a delete webhook', async () => {
      const agent = testLib.getAgent();

      const res = await agent
        .post('/snapshot-webhook')
        .send(webhookDeletedFix());

      expect(res.status).toBe(200);

      expect(tweet.sendTweet).toHaveBeenCalledTimes(1);

      const expectedMessage =
        '❌ Proposal DELETED on Snapshot:\n\n"Temp Check: Larger Grant Construct // CEA + No Negative Net UNI"';
      expect(tweet.sendTweet).toHaveBeenCalledWith(expectedMessage);
    });
  });
});
