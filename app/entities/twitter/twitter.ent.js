/**
 * @fileoverview Twitter Business Logic and Service provider.
 * @see https://github.com/desmondmorris/node-twitter
 */

const { init, isConnected } = require('./twitter.service');

const entity = (module.exports = {});

entity.isConnected = isConnected;

/**
 * Initialize the twitter service.
 *
 */
entity.init = () => {
  init();
};
