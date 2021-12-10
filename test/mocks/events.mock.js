/**
 * @fileoverview Mocks the main event bus.
 */

const { events } = require('../../app/entities/events');

const mocks = (module.exports = {});

const { emit } = events;

/**
 * Mocks the main event bus.
 *
 * @return {Object} The mock objects.
 */
mocks.eventsMock = () => {
  const eventEmitMock = jest.fn();

  events.emit = eventEmitMock;
  return { eventEmitMock };
};

/**
 * Restores the implementations.
 */
mocks.eventsMockRestore = () => {
  events.emit = emit;
};
