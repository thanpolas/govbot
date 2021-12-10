/**
 * @fileoverview snapshot.org webhook tests.
 */

const { v4: uuidv4 } = require('uuid');

const testLib = require('../lib/test.lib');

const {
  webhookCreateFix,
  webhookStartFix,
  webhookEndFix,
  webhookDeletedFix,
} = require('../fixtures/snapshot.fix');
const { dispatchesMock } = require('../mocks/dispatches.mock');
const { fetchProposalMock } = require('../mocks/gql-query-snapshot.mock');

describe('Snapshot Webhooks', () => {
  testLib.init();

  describe(`Happy Path`, () => {
    test('Will handle a create webhook', async () => {
      const proposalId = uuidv4();
      const { tweetMock, discordMock } = dispatchesMock();
      const agent = testLib.getAgent();

      const res = await agent
        .post('/snapshot-webhook')
        .send(webhookCreateFix(proposalId));

      expect(res.status).toBe(200);

      expect(tweetMock).toHaveBeenCalledTimes(0);
      expect(discordMock).toHaveBeenCalledTimes(0);
    });

    test('Will handle a start webhook', async () => {
      const proposalId = uuidv4();
      const { tweetMock, discordMock } = dispatchesMock();
      fetchProposalMock({ proposalId });

      const agent = testLib.getAgent();

      const res = await agent
        .post('/snapshot-webhook')
        .send(webhookStartFix(proposalId));

      expect(res.status).toBe(200);

      expect(tweetMock).toHaveBeenCalledTimes(1);
      expect(discordMock).toHaveBeenCalledTimes(1);

      const expectedTweet = `📢 Voting STARTED for proposal:\n\n"Temp Check: Larger Grant Construct // CEA + No Negative Net UNI"\n\nhttps://snapshot.org/#/uniswap/proposal/${proposalId}`;

      expect(tweetMock).toHaveBeenCalledWith(expect.any(Object), expectedTweet);
    });

    test('Will handle an end webhook', async () => {
      const proposalId = uuidv4();
      const { tweetMock, discordMock } = dispatchesMock();
      fetchProposalMock({ proposalId });

      const agent = testLib.getAgent();

      const res = await agent.post('/snapshot-webhook').send(webhookEndFix());

      expect(res.status).toBe(200);

      expect(tweetMock).toHaveBeenCalledTimes(1);
      expect(discordMock).toHaveBeenCalledTimes(1);

      const expectedTweet = `⛔ Voting ENDED for proposal:\n\n"Temp Check: Larger Grant Construct // CEA + No Negative Net UNI"\n\nhttps://snapshot.org/#/uniswap/proposal/${proposalId}`;
      expect(tweetMock).toHaveBeenCalledWith(expect.any(Object), expectedTweet);
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
