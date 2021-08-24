# Set the latest node version
ARG node_version=16.6.1
ARG node_image=node:${node_version}-alpine

#
# Get the production dependencies.
#
FROM ${node_image} AS skgtech_slackbot_prod_image

# Working directory
WORKDIR /home/node/slackbot

# Copy Needed files
COPY package.json package-lock.json ./

# Install python
RUN apk add build-base python

# Install production only dependencies
RUN npm ci --production

#
# Cascading build including development dependencies
#
FROM skgtech_slackbot_prod_image AS skgtech_slackbot_dev_image

# Install dev deps
RUN npm ci

#
# Build with the source
#
FROM ${node_image} AS slackbot_source_image

WORKDIR /home/node/slackbot

# Copy app files
COPY app ./app
COPY package.json ./
COPY package-lock.json ./
COPY config ./config
COPY migrations ./migrations

#
# Build the Production Image
#
FROM slackbot_source_image AS prod_image
ENV NODE_ENV=localdev

# Copy created node modules
COPY --from=skgtech_slackbot_prod_image /home/node/slackbot/node_modules ./node_modules

# Run as non-root user
USER node

CMD ["npm", "start"]
