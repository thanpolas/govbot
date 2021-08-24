/**
 * @fileoverview Querying snapshot's subgraph.
 * @see https://hub.snapshot.org/graphql
 */
const axios = require('axios');

const log = require('../../../services/log.service').get();

const entity = (module.exports = {});

/**
 * Will query the graph.
 *
 * @param {Object} gqlQuery Standard formatted GQL query.
 * @return {Promise<Object|void>} A Promise with the fetched data or void
 *    if query failed.
 */
entity.graphQuery = async (gqlQuery) => {
  try {
    const axiosParams = {
      method: 'post',
      url: gqlQuery.endpoint,
      data: gqlQuery.query,
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
