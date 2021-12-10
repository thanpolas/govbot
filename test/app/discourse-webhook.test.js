/**
 * @fileoverview Discourse webhook tests.
 */

const testLib = require('../lib/test.lib');

const { eventsMock, eventsMockRestore } = require('../mocks/events.mock');
const {
  discourseFix,
  discourseHeadersArFix,
} = require('../fixtures/discourse.fix');
const { dispatchesMock } = require('../mocks/dispatches.mock');
const {
  mockGetConfigurations,
  mockGetConfigurationsRestore,
} = require('../mocks/govbot-ctrl.mock');

describe('Discourse Webhooks', () => {
  testLib.init();

  describe(`Happy Path`, () => {
    test('Will emit a discourse new topic event', async () => {
      const { eventEmitMock } = eventsMock();
      mockGetConfigurations({
        discourse_instance_name: 'https://gov.uniswap.org',
      });

      const agent = testLib.getAgent();

      // Set all the Discourse headers
      discourseHeadersArFix().forEach((headerTuple) => {
        const [header, value] = headerTuple;
        agent.set(header, value);
      });

      const discourseTopic = discourseFix();
      const res = await agent.post('/discourse-webhook').send(discourseTopic);

      expect(res.status).toBe(200);

      expect(eventEmitMock).toHaveBeenCalledTimes(1);

      // Augment the discourse topic payload as the event handler will.
      discourseTopic.instance = 'https://gov.uniswap.org';
      discourseTopic.space = 'uniswap';
      discourseTopic.link =
        'https://gov.uniswap.org/t/another-one-to-ignore-testing-only/15408';

      expect(eventEmitMock).toHaveBeenCalledWith(
        'discourseNewtopic',
        discourseTopic,
      );
      eventsMockRestore();
      mockGetConfigurationsRestore();
    });

    test('Will produce the expected tweet and discord messages', async () => {
      const { tweetMock, discordMock } = dispatchesMock();
      mockGetConfigurations({
        discourse_instance_name: 'https://gov.uniswap.org',
      });
      const agent = testLib.getAgent();

      // Set all the Discourse headers
      discourseHeadersArFix().forEach((headerTuple) => {
        const [header, value] = headerTuple;
        agent.set(header, value);
      });

      const discourseTopic = discourseFix();
      const res = await agent.post('/discourse-webhook').send(discourseTopic);

      expect(res.status).toBe(200);

      expect(tweetMock).toHaveBeenCalledTimes(1);
      expect(discordMock).toHaveBeenCalledTimes(1);

      const link =
        'https://gov.uniswap.org/t/another-one-to-ignore-testing-only/15408';

      const expectedTweet =
        `📫 New topic posted:\n\n"Another one to ignore - ` +
        `testing only"\n\n${link}`;

      expect(tweetMock).toHaveBeenCalledWith(expect.any(Object), expectedTweet);

      const discordSendCall = discordMock.mock.calls[0][0];
      expect(discordSendCall.title).toEqual('📫 New topic posted');
      expect(discordSendCall.fields[0].name).toEqual('Topic:');
      expect(discordSendCall.fields[0].value).toEqual(
        `[Another one to ignore ` +
          `- testing only](https://gov.uniswap.org/t/another-one-to-ignore-testing-only/15408 'Go to topic')`,
      );

      mockGetConfigurationsRestore();
    });
  });
});
