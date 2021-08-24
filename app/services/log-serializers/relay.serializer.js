/**
 * Serializes the relay boolean switch.
 *
 * @param {string=} usePath Set to override default log write path.
 * @return {function} Serializer for logality.
 */
module.exports = (usePath = 'relay') => {
  return (value) => {
    return {
      path: usePath,
      value,
    };
  };
};
