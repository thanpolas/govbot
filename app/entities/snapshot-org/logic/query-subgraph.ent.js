/**
 * @fileoverview Querying snapshot's subgraph.
 * @see https://hub.snapshot.org/graphql
 */
const axios = require('axios');

const log = require('../../../services/log.service').get();

const entity = (module.exports = {});

/** @const {string} GQL_URL hardcode snapshot's url until we'll need GQL client for another endpoint */
entity.GQL_URL = 'https://hub.snapshot.org/graphql';

/**
 * Will query the graph.
 *
 * @param {Object} gqlQuery GQL Query.
 * @return {Promise<Object|void>} A Promise with the fetched data or void
 *    if query failed.
 */
entity.graphQuery = async (gqlQuery) => {
  try {
    const axiosParams = {
      method: 'post',
      url: entity.GQL_URL,
      data: gqlQuery,
    };

    const res = await axios(axiosParams);

    return res?.data;
  } catch (ex) {
    await log.error(`Error on graphQuery(): ${ex?.response?.data}`, {
      error: ex,
      gqlQuery,
    });
  }
};
