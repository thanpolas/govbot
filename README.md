# Discord Bot Template

> Describe what your bot does

# Getting Started

You need to edit the following files:

-   [ ] `.env-template` and copy as `.env`
-   [ ] `package.json` - Specifically, define the "database_name" key. This name will be used to create two databases when you run the local db reset npm scripts:"dbname-dev" and "dbname-test".
-   [ ] `.circleci/config.yml`
-   [ ] `config/**` (all configurations).

# How To Install

## Clone and Build

```
git clone git@github.com:thanpolas/discord-bot-template.git

cd discord-bot-template

npm i
```

## Create The Bot

1. Go to the developer portal: https://discord.com/developers/applications
    1. Create Application.
    1. Go to "Bot" Menu and add expected permissions.
    1. Go to "OAuth2" menu and select the "bot" scope.
    1. Copy the OAuth2 URL and paste it on the browser.
    1. Help on creating a bot: https://discordpy.readthedocs.io/en/latest/discord.html

## Update Env variables with the bot tokens

1. Copy `.env-template` to `.env` and fill in the required values.
1. Update env variables on the project.

## Prepare Docker

If you need database support, use the Docker and docker-compose, configurations
so you will need to install the [Docker Desktop][docker-desktop] package
on your local machine.

Once that is done, enter the working directory and type:

```
docker-compose up -d
```

[More on all `docker-compose` available commands][docker-compose].

## Needed Environment Variables

All targets require the following environment variables (add new as needed):

-   `DISCORD_BOT_TOKEN` The Discord token of the bot.

This project also supports a [`.env` file][dotenv] which is on `.gitignore`
for your convenience when developing on your local.

# Development Operations / Maintenance

## Reset Local Database

```
npm run db:reset:local
```

## Database Migration Commands

### Create a New Migration Script

```
npm run knex:create_migration <name of migration>
```

### Run Migrations

```
npm run knex:migrate
```

## Running Tests Locally

Use the `jest` command to run all tests or specific ones.

### Reset Test Database

The tests will look for the `NUKE_TEST_DB` environment variable to be set to
initiate the test database nuking and re-population, use it like so:

```bash
NUKE_TEST_DB=1 jest
```

## Update Node Version

When a new node version is available you need to updated it in the following:

-   `/package.json`
-   `/.nvmrc`
-   `/.circleci/config.yml`
-   `/Dockerfile`

# Deployment

TBD

## License

Copyright © [Thanos Polychronakis][thanpolas] and Authors, Licensed under ISC.

[docker-compose]: https://docs.docker.com/compose/reference/overview/
[docker-desktop]: https://www.docker.com/products/docker-desktop
[dotenv]: https://github.com/motdotla/dotenv#readme
[thanpolas]: https://github.com/thanpolas
[tz]: https://momentjs.com/timezone
