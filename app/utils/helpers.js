/**
 * @fileoverview Generic helpers
 */

const _ = require('lodash');
const Bluebird = require('bluebird');
const format = require('date-fns/format');

const helpers = (module.exports = {});

/**
 * Executes concurrently the Function "fn" against all the  items in the array.
 * Throttles of concurrency to 5.
 *
 * Use when multiple I/O operations need to be performed.
 *
 * @param {Array<*>} items Items.
 * @param {function(*): Promise<*>} fn Function to be applied on the array items.
 * @param {number=} concurrency The concurrency, default 5.
 * @return {Promise<*>}
 */
helpers.asyncMapCap = (items, fn, concurrency = 5) =>
  Bluebird.map(items, fn, { concurrency });

/**
 * An async delay, to time sending messages.
 *
 * @param {number} seconds How many seconds to wait.
 * @return {Promise<void>}
 */
helpers.delay = (seconds) => {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
};

/**
 * Will split a string based on its length using numChars or the default value
 * of 1800 which is intented for spliting long discord messages (limit at 2000).
 *
 * @param {string} str The string to split.
 * @param {number=} [numChars=1800] Number of characters to split the string into.
 * @return {Array<string>} An array of strings, split based on the numChars.
 */
helpers.splitString = (str, numChars = 1800) => {
  if (!str) {
    return str;
  }
  const ret = [];
  let offset = 0;
  while (offset < str.length) {
    ret.push(str.substring(offset, numChars + offset));
    offset += numChars;
  }

  return ret;
};

/**
 * Returns a random number from 0 up to a total of maximum numbers
 * (not inclusive) as defined.
 *
 * @param {number} max Maximum random number to return.
 * @return {number} A random integer number.
 */
helpers.getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
};

/**
 * Formats a date string into human readable, extended format.
 *
 * @param {string} dt ISO8612 format Date.
 * @return {string} Appropriately formated date to be used on call.
 */
helpers.formatDate = (dt) => {
  return format(new Date(dt), "eee, do 'of' MMM yyyy 'at' HH:mm OOOO");
};

/**
 * Formats a date string into human readable, short format.
 *
 * @param {string} dt ISO8612 format Date.
 * @return {string} Appropriately formated date.
 */
helpers.formatDateShort = (dt) => {
  return format(new Date(dt), 'dd/MMM/yy hh:mm OOOO');
};

/**
 * Will normalize quotes in a given string. There are many variations of quotes
 * in the unicode character set, this function attempts to convert any variation
 * of quote to the standard Quotation Mark - U+0022 Standard Universal: "
 *
 * @param {string} str The string to normalize
 * @return {string} Normalized string.
 * @see https://unicode-table.com/en/sets/quotation-marks/
 */
helpers.stdQuote = (str) => {
  const allQuotes = [
    '“', // U+201c
    '«', // U+00AB
    '»', // U+00BB
    '„', // U+201E
    '“', // U+201C
    '‟', // U+201F
    '”', // U+201D
    '❝', // U+275D
    '❞', // U+275E
    '〝', // U+301D
    '〞', // U+301E
    '〟', // U+301F
    '＂', // U+FF02
  ];

  const stdQuote = '"'; // U+0022

  const normalized = allQuotes.reduce((strNorm, quoteChar) => {
    // eslint-disable-next-line security/detect-non-literal-regexp
    const re = new RegExp(quoteChar, 'g');
    return strNorm.replace(re, stdQuote);
  }, str);

  return normalized;
};

/**
 * Will index an array of objects into an object using the designated
 * property of the objects as the index pivot.
 *
 * @param {Array<Object>} arrayItems The array with objects to index.
 * @param {string} indexCol The column to index by.
 * @return {Object<Array<Object>>} Indexed array as an object.
 */
helpers.indexArrayToObject = (arrayItems, indexCol) => {
  const indexed = {};

  arrayItems.forEach((arrayItem) => {
    const itemId = arrayItem[indexCol];
    if (indexed[itemId]) {
      indexed[itemId].push(arrayItem);
    } else {
      indexed[itemId] = [arrayItem];
    }
  });
  return indexed;
};

/**
 * Will remove all items from the provided array except the one with the defined
 * index.
 *
 * @param {Array} ar An array.
 * @param {number} arIndex the index item to retain.
 * @return {void} Array is updated in place.
 */
helpers.arrayKeep = (ar, arIndex) => {
  ar.splice(0, arIndex);
  ar.splice(1);
};

/**
 * Will iterate through an object based on the keys of the object.
 *
 * @param {Object} obj The object to iterate on.
 * @param {function} fn The function to call back, with three arguments:
 *    - The value of the object iteration
 *    - The index of the iteration
 *    - The key of the object.
 * @return {void}
 */
helpers.iterObj = (obj, fn) => {
  const allKeys = Object.keys(obj);
  allKeys.forEach((key, index) => {
    fn(obj[key], index, key);
  });
};

/**
 * Will iterate through an object based on the keys of the object and return
 * the outcome of the callback, as per Array.map().
 *
 * @param {Object} obj The object to iterate on.
 * @param {function} fn The function to call back, with three arguments:
 *    - The value of the object iteration
 *    - The index of the iteration
 *    - The key of the object.
 * @return {*} The return of the callback.
 */
helpers.mapObj = (obj, fn) => {
  const allKeys = Object.keys(obj);
  return allKeys.map((key, index) => {
    return fn(obj[key], index, key);
  });
};

/**
 * Will run "allSettled()" on the given promises and return all fulfilled
 * results in a flattened array.
 *  - Does not care for rejected promises.
 *  - Expects that the results of fulfilled promises are Arrays.
 *
 * @param {Array<Promise>} arrayProms An array of promises.
 * @return {Promise<Array>} A Promise with an array of the outcome.
 */
helpers.allSettledArray = async (arrayProms) => {
  const results = await Promise.allSettled(arrayProms);

  const fulfilled = results.filter((res) => res.status === 'fulfilled');
  const result = fulfilled.reduce((allResults, current) => {
    const combined = allResults.concat(current.value);

    return combined;
  }, []);

  return result;
};

/**
 * Will deep flatten the given array and filter our falsy values.
 *
 * @param {Array<*>} ar Array with items.
 * @return {Array<*>} Flattened and filtered array.
 */
helpers.flatFilter = (ar) => {
  return _.flattenDeep(ar).filter((v) => !!v);
};

/**
 * Convert divergence value to human readable format.
 *
 * @param {number} divergence A divergence float.
 * @return {string} Human readable percentage.
 */
helpers.divergenceHr = (divergence) => {
  return `${(divergence * 100).toFixed(2)}%`;
};

/**
 * Converts an array of strings into numbers.
 *
 * @param {Array<string>} arr The array.
 * @return {Array<number>}
 */
helpers.arrToNumbers = (arr) => arr.map((item) => Number(item));

/**
 * Calculates the mean value.
 *
 * @param {Array<number>} arr The array to get the mean of.
 * @return {number} The mean value.
 */
helpers.meanOfArr = (arr) => {
  const total = arr.reduce((aggregate, val) => {
    return aggregate + val;
  }, 0);

  return total / arr.length;
};

/**
 * Calculates the median of an array.
 *
 * @param {Array<number>} arr The numbers to get the median from.
 * @return {number}
 */
helpers.medianOfArr = (arr) => {
  const arrSorted = arr.sort((a, b) => {
    return a - b;
  });

  const { length } = arrSorted;

  if (length % 2 === 1) {
    // If length is odd
    return arrSorted[length / 2 - 0.5];
  }

  return (arrSorted[length / 2] + arrSorted[length / 2 - 1]) / 2;
};

/**
 * Get the divergence between two numbered expressed in percentage as a float.
 *
 * @param {number} a Numerator.
 * @param {number} b Denominator
 * @return {number} 0.01 = 1%.
 */
helpers.getDivergence = (a, b) => {
  return a / b - 1;
};
