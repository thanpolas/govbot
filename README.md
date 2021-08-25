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

## Twitter Tokens

Follow this guide to get twitter tokens:

1. From the account you want the tweets to happen [apply for a Developer Account][twitter-apply]. This will take about a day and they might ask for followup questions.
1. Once you have your developer account approved, [go to the developer portal and create an application][twitter-portal], do not mark down any keys or tokens at this step, just create the app.
1. Once the app is created and you see it on your dashboard, you should see two icons, a "cog" (App settings) and a "key" (Keys and tokens).
1. Click on the Cog (App Settings).
1. Edit the "App Permissions" and make sure the permissions are "Read and Write".
1. Go back to the Dashboard and click on the "key icon" (Keys and tokens).
1. Regenerate your "consumer keys" and note both keys and values down in a safe and temporary document.
1. Regenerate the "Access Token and Secret" and note both keys and values down in a safe and temporary document.

With the keys available, you now need to populate the following environmental variables:

-   `TWITTER_CONSUMER_KEY=...`
-   `TWITTER_CONSUMER_SECRET=...`
-   `TWITTER_ACCESS_TOKEN=...`
-   `TWITTER_ACCESS_TOKEN_SECRET=...`

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

Merge to `main`, deployment will happen automatically to heroku via circleci.

## License

Copyright © [Thanos Polychronakis][thanpolas] and Authors, Licensed under ISC.

[docker-compose]: https://docs.docker.com/compose/reference/overview/
[docker-desktop]: https://www.docker.com/products/docker-desktop
[dotenv]: https://github.com/motdotla/dotenv#readme
[thanpolas]: https://github.com/thanpolas
[tz]: https://momentjs.com/timezone
[twitter-apply]: https://developer.twitter.com/en/apply-for-access
[twitter-portal]: https://developer.twitter.com/en/portal/dashboard
