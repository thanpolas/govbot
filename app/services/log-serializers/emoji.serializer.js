/**
 * Serializes the emoji icon for relayed messages.
 *
 * @param {string=} usePath Set to override default log write path.
 * @return {function} Serializer for logality.
 */
module.exports = (usePath = 'emoji') => {
  return (value) => {
    return {
      path: usePath,
      value,
    };
  };
};
