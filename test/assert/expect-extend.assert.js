/**
 * @fileoverview Expect extension functions.
 */

const isUUID = require('validator/lib/isUUID');
const isISO8601 = require('validator/lib/isISO8601');
const isEmail = require('validator/lib/isEmail');

const ext = (module.exports = {});

/**
 * Asserts the provided string is a valid UUID.
 *
 * @param {Object} received the object to test.
 * @return {Object} Jest expected response.
 */
ext.toBeUUID = (received) => {
  const pass = isUUID(received);

  if (!pass) {
    return {
      message: () => `Not a UUID: ${received}`,
      pass: false,
    };
  }
  return {
    message: () => `is a UUID`,
    pass: true,
  };
};

/**
 * Asserts the provided string is a valid ISO8601 date.
 *
 * @param {Object} received the object to test.
 * @return {Object} Jest expected response.
 */
ext.toBeISODate = (received) => {
  const pass = isISO8601(received);

  if (!pass) {
    return {
      message: () => `Not an ISO8601 compliant date: ${received}`,
      pass: false,
    };
  }
  return {
    message: () => `is an ISO8601 compliant date`,
    pass: true,
  };
};

/**
 * Asserts the provided string is a valid email.
 *
 * @param {Object} received the object to test.
 * @return {Object} Jest expected response.
 */
ext.toBeEmail = (received) => {
  const pass = isEmail(received);

  if (!pass) {
    return {
      message: () => `Not an email: ${received}`,
      pass: false,
    };
  }
  return {
    message: () => `is an email`,
    pass: true,
  };
};
