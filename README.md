# Uniswap Governance Bot

> Informs and populates information regarding uniswap governance.

[![CircleCI](https://circleci.com/gh/thanpolas/govbot.svg?style=svg)](https://circleci.com/gh/thanpolas/govbot)
[![codecov](https://codecov.io/gh/thanpolas/govbot/branch/main/graph/badge.svg?token=GMSGENFPYS)](https://codecov.io/gh/thanpolas/govbot)

# How To Install

## Clone and Build

```
git clone git@github.com:thanpolas/govbot.git

cd govbot

npm i
```

## Needed Environment Variables

This project supports [`.env` file][dotenv] which is on `.gitignore`
for your convenience when developing on your local. Needed environment variables
can be found on `.env-template` which you should copy to `.env` and edit.

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
