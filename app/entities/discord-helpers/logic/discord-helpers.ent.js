/**
 * Will format an ETH address into a truncated discord link for embeds.
 *
 * @param {Object} network The network this address is on.
 * @param {Object} address The address to get.
 * @return {string} Properly formatted discord link.
 */

const entity = (module.exports = {});

/**
 * Will return a discord link for embedded messages.
 *
 * @param {string} label The label to show.
 * @param {string} link The link to use.
 * @param {string=} optTooltip define a custom tooltip.
 * @return {string} Properly formated link for embed message.
 * @private
 */
entity.getLink = (label, link, optTooltip) => {
  const tooltip = optTooltip || label;

  const embedLink = `[${label}](${link} '${tooltip}')`;
  return embedLink;
};

/**
 * Will remove the first word (command) from the message content, returning only
 * the command arguments.
 *
 * @param {DiscordMessage} message The discord message.
 * @param {function=} parsingErrorFn The error to send in case of parsing error.
 * @return {Promise<string>} The command arguments.
 */
entity.removeCommand = async (message, parsingErrorFn) => {
  const { content } = message;

  // remove the command part (first word)
  const firstSpaceIndex = content.indexOf(' ');
  if (firstSpaceIndex === -1) {
    if (parsingErrorFn) {
      await message.channel.send(parsingErrorFn());
    }
    return;
  }
  const commandArguments = content.substr(firstSpaceIndex + 1);
  if (!commandArguments) {
    if (parsingErrorFn) {
      await message.channel.send(parsingErrorFn());
    }
    return;
  }

  return commandArguments.trim();
};
