/**
 * @fileoverview Twitter constants.
 */

const consts = (module.exports = {});

/**
 * @const {number} URL_LENGTH Fixed length of t.co url shortener.
 * @see https://help.twitter.com/en/using-twitter/how-to-tweet-a-link
 */
consts.URL_LENGTH = 23;

/**
 * @const {number} ELIPSES_LENGTH The size of the elipses (…) that will be used
 *    at truncating.
 * @see https://github.com/evondev/truncateText
 */
consts.ELIPSES_LENGTH = 1;

/**
 * @const {number} MAX_CHARS Maximum character limit for a tweet.
 * @see https://developer.twitter.com/en/docs/counting-characters
 */
consts.MAX_CHARS = 280;
