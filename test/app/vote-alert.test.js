/**
 * @fileoverview Tests voting alert.
 */

const { v4: uuidv4 } = require('uuid');

const testLib = require('../lib/test.lib');

const { checkForAlerts } = require('../../app/entities/vote-alert');

const { webhookStartFix } = require('../fixtures/snapshot.fix');
const {
  deleteAll,
  getByProposalId,
  insert,
} = require('../setup/vote-alert.setup');
const { voteAlertReadyToGo } = require('../fixtures/vote-alert.fix');
const { dispatchesMock } = require('../mocks/dispatches.mock');
const { fetchProposalMock } = require('../mocks/gql-query-snapshot.mock');

describe('Voting Alert', () => {
  testLib.init();

  describe(`Happy Path`, () => {
    beforeEach(async () => {
      await deleteAll();
    });

    test('Will create alert on the start webhook', async () => {
      const proposalId = uuidv4();
      dispatchesMock();
      fetchProposalMock({ proposalId });
      const agent = testLib.getAgent();
      const res = await agent
        .post('/snapshot-webhook')
        .send(webhookStartFix(proposalId));

      expect(res.status).toBe(200);

      const alertRecords = await getByProposalId(proposalId);
      expect(alertRecords).toHaveLength(1);

      const [alertRecord] = alertRecords;

      expect(alertRecord.space).toEqual('uniswap');
      expect(alertRecord.link).toEqual(
        `https://snapshot.org/#/uniswap/proposal/${proposalId}`,
      );
      expect(alertRecord.title).toEqual(
        'Temp Check: Larger Grant Construct // CEA + No Negative Net UNI',
      );
      expect(alertRecord.proposal_id).toEqual(proposalId);

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

      await checkForAlerts();

      const expectedTweet =
        '⏰ Less than an hour left to vote on:\n\n"Temp ' +
        'Check: Larger Grant Construct // CEA + No Negative Net UNI"\n\n' +
        'https://snapshot.org/#/uniswap/proposal/QmQbcxLpGENeDauCAsh3BXy9H9fiiK46JEfnLqG3s8iMbN';

      expect(tweetMock).toHaveBeenCalledTimes(1);
      expect(tweetMock).toHaveBeenCalledWith(expect.any(Object), expectedTweet);
      expect(discordMock).toHaveBeenCalledTimes(1);
    });
  });
});
