/**
 * @fileoverview Twitter Business Logic and Service provider.
 * @see https://github.com/desmondmorris/node-twitter
 */

const { init } = require('./twitter.service');

const entity = (module.exports = {});

/**
 * Initialize the twitter service.
 *
 */
entity.init = () => {
  init();
};
