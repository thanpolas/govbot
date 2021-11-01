/**
 * @fileoverview Controls the entire govbot operations, determines how many
 *    instances need to run, for which organizations and how.
 */

const { init: initTwitter } = require('../twitter');
const { init: initDiscordRelay } = require('../discord-relay');
const { init: initVoteAlert } = require('../vote-alert');

exports.init = async () => {};
