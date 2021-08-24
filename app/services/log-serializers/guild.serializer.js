/**
 * Serializes the guild.
 *
 * @param {string=} usePath Set to override default log write path.
 * @return {function} Serializer for logality.
 */
module.exports = (usePath = 'context.guild') => {
  return (value) => {
    return {
      path: usePath,
      value: {
        guild_id: value.id,
        guild_name: value.name,
        guild_description: value.description,
      },
    };
  };
};
