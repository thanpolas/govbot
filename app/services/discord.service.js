/**
 * @fileoverview Service that provides connectivity and authentication to the
 *  discord API.
 */

const { Client, Intents } = require('discord.js');

const log = require('./log.service').get();

/**
 * @type {?Object<Discord>} Discord clients indexed by space name.
 * @private
 */
exports._clients = {};

/**
 * Returns the Discord Command instance.
 *
 * @param {Object|string} configuration runtime configuration or space name.
 * @return {Discord} Discord client.
 * @throws {Error} when discord is disconnected.
 */
exports.getClient = (configuration) => {
  const space = configuration?.space || configuration;
  if (!exports.isConnected(space)) {
    throw new Error(`Discord Service not initialized yet for space: ${space}`);
  }

  return exports._clients[space];
};

/**
 * Checks if service is connected to Discord.
 *
 * @param {Object|string} configuration runtime configuration or space name.
 * @return {boolean}
 */
exports.isConnected = (configuration) => {
  const space = configuration?.space || configuration;
  return !!exports._clients[space];
};

/**
 * Initialize and connect to the Discord API.
 *
 * @param {Object} bootOpts A set of app-boot options, docs in app index.
 * @param {Object} configuration runtime configuration.
 * @return {Promise<void>} A Promise.
 */
exports.init = async function (bootOpts, configuration) {
  if (bootOpts.testing) {
    return;
  }

  const { space, has_discord, discord_token } = configuration;

  if (!has_discord) {
    return;
  }
  if (!discord_token) {
    await log.warn(
      `No discord bot token was detected for space: "${space}", ` +
        `skipping discord init.`,
    );
    return;
  }

  return new Promise((resolve, reject) => {
    log.notice('Starting Discord Service...');

    const client = (exports._clients[space] = new Client({
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
      ],
      partials: ['CHANNEL'],
    }));

    client.on('ready', () => {
      log.notice(
        `Discord Connected for space: ${space} as: ${client.user.tag}`,
      );

      resolve();
    });

    client.on('error', async (error) => {
      await log.warn(
        `Discord Client Error for space: ${space}. Connected at: ${client.readyAt}`,
        {
          error,
        },
      );

      // When no connection has been established, the service is still in
      // initialization mode
      if (!client.readyAt) {
        reject();
      }
    });

    client.login(discord_token);
  });
};

/**
 * Disposes discord service.
 *
 * @return {Promise<void>}
 */
exports.dispose = async () => {
  const spaces = Object.keys(exports._clients);
  if (!spaces.length) {
    return;
  }

  const promises = spaces.map(async (space) => {
    if (!exports.isConnected(space)) {
      return;
    }
    return exports._clients[space].destroy();
  });

  await Promise.all(promises);
};
