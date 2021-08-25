/**
 * @fileoverview Tests in API are Integrations tests.
 */

const testLib = require('../lib/test.lib');

const {
  webhookCreate,
  webhookStart,
  webhookEnd,
  webhookDeleted,
} = require('../fixtures/snapshot.fix');
const { tweetResponse } = require('../fixtures/twitter.fix');
const tweet = require('../../app/entities/twitter/logic/send-tweet.ent');

describe('Snapshot Webhooks', () => {
  testLib.init();

  describe(`Happy Path`, () => {
    beforeEach(() => {
      tweet.sendTweet = jest.fn(() => Promise.resolve(tweetResponse()));
    });

    test('Will handle a create webhook', async () => {
      const agent = testLib.getAgent();

      const res = await agent.post('/snapshot-webhook').send(webhookCreate());

      expect(res.status).toBe(200);

      expect(tweet.sendTweet).toHaveBeenCalledTimes(1);

      const expectedMessage =
        '🆕 Proposal "Temp Check: Larger Grant Construct // CEA + No Negative Net UNI" CREATED on Snapshot https://snapshot.org/#/uniswap/proposal/QmQbcxLpGENeDauCAsh3BXy9H9fiiK46JEfnLqG3s8iMbN';
      expect(tweet.sendTweet).toHaveBeenCalledWith(expectedMessage);
    });

    test('Will handle a start webhook', async () => {
      const agent = testLib.getAgent();

      const res = await agent.post('/snapshot-webhook').send(webhookStart());

      expect(res.status).toBe(200);

      expect(tweet.sendTweet).toHaveBeenCalledTimes(1);

      const expectedMessage =
        '📢 Proposal "Temp Check: Larger Grant Construct // CEA + No Negative Net UNI" ACTIVE on Snapshot https://snapshot.org/#/uniswap/proposal/QmQbcxLpGENeDauCAsh3BXy9H9fiiK46JEfnLqG3s8iMbN';
      expect(tweet.sendTweet).toHaveBeenCalledWith(expectedMessage);
    });

    test('Will handle an end webhook', async () => {
      const agent = testLib.getAgent();

      const res = await agent.post('/snapshot-webhook').send(webhookEnd());

      expect(res.status).toBe(200);

      expect(tweet.sendTweet).toHaveBeenCalledTimes(1);

      const expectedMessage =
        '⛔ Proposal "Temp Check: Larger Grant Construct // CEA + No Negative Net UNI" ENDED on Snapshot https://snapshot.org/#/uniswap/proposal/QmQbcxLpGENeDauCAsh3BXy9H9fiiK46JEfnLqG3s8iMbN';
      expect(tweet.sendTweet).toHaveBeenCalledWith(expectedMessage);
    });

    test('Will handle a delete webhook', async () => {
      const agent = testLib.getAgent();

      const res = await agent.post('/snapshot-webhook').send(webhookDeleted());

      expect(res.status).toBe(200);

      expect(tweet.sendTweet).toHaveBeenCalledTimes(1);

      const expectedMessage =
        '❌ Proposal "Temp Check: Larger Grant Construct // CEA + No Negative Net UNI" DELETED on Snapshot';
      expect(tweet.sendTweet).toHaveBeenCalledWith(expectedMessage);
    });
  });
});
