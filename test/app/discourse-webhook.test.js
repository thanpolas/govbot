/**
 * @fileoverview Discourse webhook tests.
 */

const testLib = require('../lib/test.lib');

const { eventsMock, eventsMockRestore } = require('../mocks/events.mock');
const {
  discourseFix,
  discourseHeadersArFix,
} = require('../fixtures/discourse.fix');

describe('Discourse Webhooks', () => {
  testLib.init();

  describe(`Happy Path`, () => {
    test('Will emit a discourse new topic event', async () => {
      const { eventEmitMock } = eventsMock();
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

      discourseTopic.instance = 'https://gov.uniswap.org';
      discourseTopic.link =
        'https://gov.uniswap.org/t/another-one-to-ignore-testing-only/15408';

      expect(eventEmitMock).toHaveBeenCalledWith(
        'discourseNewtopic',
        discourseTopic,
      );
      eventsMockRestore();
    });
  });
});
