/**
 * Will format an ETH address into a truncated discord link for embeds.
 *
 * @param {Object} network The network this address is on.
 * @param {Object} address The address to get.
 * @return {string} Properly formatted discord link.
 */

const entity = (module.exports = {});

/**
 * Will format the address appropriately and link it to the respective
 * explorer depending on the network.
 *
 * @param {Object} network The token's network object.
 * @param {string} address The address to link.
 * @param {string=} text Optionally define the text to use as label for the link.
 * @return {string} Properly formated link for embed message.
 * @private
 */
entity.getAddressLink = (network, address, text = '') => {
  const tokenUrl = `${network.explorer}address/${address}`;

  let label = text;

  if (!label) {
    const firstPart = address.substr(0, 4);
    const lastPart = address.substr(-4);
    label = `${firstPart}...${lastPart}`;
  }

  const link = `[${label}](${tokenUrl} '${address}')`;
  return link;
};

/**
 * Will format the token's address appropriately and link it to the respective
 * explorer depending on the network.
 *
 * @param {Object} network The token's network object.
 * @param {string} address The address to link.
 * @param {string=} text Optionally define the text to use as label for the link.
 * @return {string} Properly formated link for embed message.
 * @private
 */
entity.getTokenLink = (network, address, text = '') => {
  const tokenUrl = `${network.explorer}token/${address}`;

  let label = text;

  if (!label) {
    const firstPart = address.substr(0, 4);
    const lastPart = address.substr(-4);
    label = `${firstPart}...${lastPart}`;
  }
  const link = `[${label}](${tokenUrl} '${address}')`;
  return link;
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
