/**
 * @fileoverview Application specific errors and error repository for the API.
 */

const errors = (module.exports = {});

/**
 * Get an error based on the error code.
 *
 * @param {string} errorCode The Error code to get.
 * @return {Error} An error object appropriately populated.
 */
errors.getError = (errorCode) => {
  const errorItem = errors.repository[errorCode];

  if (!errorItem) {
    throw new Error(`Invalid Error Code: ${errorCode}`);
  }

  const error = new Error(errorItem.message);
  error.code = errorCode;
  error.description = errorItem.description;
  error.httpCode = errorItem.httpCode;
  error.noBacktrace = true;
  error.botError = true;

  return error;
};

/**
 * Creates and throws the error.
 *
 * @param {string} errorCode The Error code to get and throw.
 * @throws {Error}
 */
errors.throwError = (errorCode) => {
  const error = errors.getError(errorCode);
  throw error;
};

/**
 * Repository of API Error types.
 *
 * The convention here is that when on production only the "message" property
 * is transmitted which is intended for end-users.
 *
 * The "description" property is a more technically descriptive error that is
 * intended for engineers and API developers.
 *
 * ## Code Naming Pattern
 *
 * 1. First part of the slug should indicate the particular domain they refer to.
 * 2. The next parts of the slug should describe the issue hierarchically.
 *
 * e.g. "signup_plan_error" the "signup" is the domain, "plan" is the next
 * hierarchical part of what the error refers to, "error" is the signia of
 * that particular error type, it is an error.
 *
 * @type {Object}
 */
errors.repository = {
  system_error_generic: {
    message: 'An error has occurred, please try again',
    description: 'Internal server error, the error has been logged',
    httpCode: 500,
  },
};
