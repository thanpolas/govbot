/**
 * @fileoverview Tests voting alert.
 */

const testLib = require('../lib/test.lib');

const { checkForAlert } = require('../../app/entities/vote-alert');

const { webhookStartFix } = require('../fixtures/snapshot.fix');
const { deleteAll, getAll, insert } = require('../setup/vote-alert.setup');
const { voteAlertReadyToGo } = require('../fixtures/vote-alert.fix');
const { dispatchesMock } = require('../mocks/dispatches.mock');

describe('Voting Alert', () => {
  testLib.init();

  describe(`Happy Path`, () => {
    beforeEach(async () => {
      await deleteAll();
    });

    test('Will create alert on the start webhook', async () => {
      dispatchesMock();
      const agent = testLib.getAgent();

      const res = await agent.post('/snapshot-webhook').send(webhookStartFix());

      expect(res.status).toBe(200);

      const alertRecords = await getAll();
      expect(alertRecords).toHaveLength(1);

      const [alertRecord] = alertRecords;

      expect(alertRecord.space).toEqual('uniswap');
      expect(alertRecord.link).toEqual(
        'https://snapshot.org/#/uniswap/proposal/QmQbcxLpGENeDauCAsh3BXy9H9fiiK46JEfnLqG3s8iMbN',
      );
      expect(alertRecord.title).toEqual(
        'Temp Check: Larger Grant Construct // CEA + No Negative Net UNI',
      );
      expect(alertRecord.expires_at).toEqual(
        new Date('2021-06-25T18:45:00.000Z'),
      );
      expect(alertRecord.alert_at).toEqual(
        new Date('2021-06-25T17:45:00.000Z'),
      );
    });
    test('Will dispatch alert on the right time', async () => {
      const { tweetMock, discordMock } = dispatchesMock();
      const voteAlertData = voteAlertReadyToGo();
      await insert(voteAlertData);

      await checkForAlert();

      expect(tweetMock).toHaveBeenCalledTimes(1);
      expect(tweetMock).toHaveBeenCalledWith(
        '⏰ Less than an hour left to vote on:\n\n"Temp Check: Larger Grant Construct // CEA + No Negative Net UNI"\n\nhttps://snapshot.org/#/uniswap/proposal/QmQbcxLpGENeDauCAsh3BXy9H9fiiK46JEfnLqG3s8iMbN',
      );
      expect(discordMock).toHaveBeenCalledTimes(1);
    });
  });
});
