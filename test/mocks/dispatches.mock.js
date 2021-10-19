/**
 * @fileoverview Mocks dispatching of messages to twitter, discord, etc.
 */

const twitterEnt = require('../../app/entities/twitter');
const twitterSend = require('../../app/entities/twitter/logic/send-tweet.ent');
const discordEnt = require('../../app/entities/discord-relay');
const discordSend = require('../../app/entities/discord-relay/logic/handle-snapshot-events.ent');

const { tweetResponseFix } = require('../fixtures/twitter.fix');

const mock = (module.exports = {});

/**
 * Mocks dispatching of messages to twitter, discord, etc.
 *
 * @return {Object} An object with the mocks.
 */
mock.dispatchesMock = () => {
  const tweetMock = jest.fn(() => Promise.resolve(tweetResponseFix()));
  const discordMock = jest.fn(() => Promise.resolve());

  twitterEnt.sendTweet = tweetMock;
  twitterSend.sendTweet = tweetMock;
  discordEnt.sendEmbedMessage = discordMock;
  discordSend.sendEmbedMessage = discordMock;

  return { tweetMock, discordMock };
};
