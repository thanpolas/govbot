// Update with your config settings.

module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      database: 'govbot-dev',
      user: 'postgres',
      password: 'postgres',
    },
    migrations: {
      directory: './migrations/',
    },
    seeds: {
      directory: './migrations/seeds',
    },
  },
};
