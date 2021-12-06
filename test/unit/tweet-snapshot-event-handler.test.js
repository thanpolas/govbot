/**
 * @fileoverview Unit Test the twitter's event handler for snapshot webhook events.
 */

const testLib = require('../lib/test.lib');

const { proposalFix } = require('../fixtures/snapshot.fix');
const { tweetResponseFix } = require('../fixtures/twitter.fix');
const { configurationFix } = require('../fixtures/configuration.fix');
const {
  _handleEvent,
} = require('../../app/entities/twitter/logic/handle-snapshot-events.ent');
const tweet = require('../../app/entities/twitter/logic/send-tweet.ent');

describe('Twitter _handleEvent()', () => {
  testLib.init();
  const CREATE_EVENT = 'snapshotProposalStart';

  describe(`Happy Path`, () => {
    beforeEach(() => {
      tweet.sendTweet = jest.fn(() => Promise.resolve(tweetResponseFix()));
    });

    test('Will handle a create webhook', async () => {
      await _handleEvent(CREATE_EVENT, configurationFix(), proposalFix());

      expect(tweet.sendTweet).toHaveBeenCalledTimes(1);

      const expectedTweet =
        '📢 Voting STARTED for proposal:\n\n"Temp Check: Larger Grant Construct // CEA + No Negative Net UNI"\n\nhttps://snapshot.org/#/uniswap/proposal/QmQbcxLpGENeDauCAsh3BXy9H9fiiK46JEfnLqG3s8iMbN';
      expect(tweet.sendTweet).toHaveBeenCalledWith(
        expect.any(Object),
        expectedTweet,
      );
    });

    test('Will handle a log title', async () => {
      const proposal = proposalFix();
      proposal.title =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur';

      await _handleEvent(CREATE_EVENT, configurationFix(), proposal);

      expect(tweet.sendTweet).toHaveBeenCalledTimes(1);

      // TPL Lenght: 34 + URL Length 23 + Elipses 1 = 58
      // Max twitter size = 280
      const expectedTweet =
        '📢 Voting STARTED for proposal:\n\n"Lorem ipsum dolor sit' +
        ' amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt' +
        ' ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis ' +
        'nostrud exercitation ullamco laboris nisi ut aliquip ex ea commod…"' +
        '\n\nhttps://snapshot.org/#/uniswap/proposal/QmQbcxLpGENeDauCAsh3BXy9H9fiiK46JEfnLqG3s8iMbN';

      expect(tweet.sendTweet).toHaveBeenCalledWith(
        expect.any(Object),
        expectedTweet,
      );
    });
  });
});
