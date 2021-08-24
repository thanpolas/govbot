/**
 * @fileoverview Test util/helpers.
 */

// const testLib = require('../lib/test.lib');
const helpers = require('../../app/utils/helpers');

describe('UNIT Helpers', () => {
  describe('splitString()', () => {
    test('Should return a single item', () => {
      const str = 'one two';
      const ret = helpers.splitString(str);

      expect(ret).toHaveLength(1);
      expect(ret[0]).toEqual(str);
    });
    test('Should return two items', () => {
      const str = 'one two';
      const ret = helpers.splitString(str, 4);

      expect(ret).toHaveLength(2);
      expect(ret[0]).toEqual('one ');
      expect(ret[1]).toEqual('two');
    });
  });

  describe('medianOfArr()', () => {
    test('Should process an even unsorted array small', () => {
      const arr = [9, 7, 1, 4];
      const res = helpers.medianOfArr(arr);
      expect(res).toEqual(5.5);
    });
    test('Should process an even unsorted array large', () => {
      const arr = [11, 13, 26, 34, 47, 2, 3, 17];
      const res = helpers.medianOfArr(arr);
      expect(res).toEqual(15);
    });
    test('Should process an odd unsorted array', () => {
      const arr = [3, 13, 2, 34, 11, 26, 47];
      const res = helpers.medianOfArr(arr);
      expect(res).toEqual(13);
    });
  });
  describe('arrToNumbers()', () => {
    test('Should convert strings to numbers', () => {
      const arr = ['11', '13', '26', '34.50', '47.03', '2', '3', '17'];
      const res = helpers.arrToNumbers(arr);

      const expectedAr = [11, 13, 26, 34.5, 47.03, 2, 3, 17];
      expect(res).toContainAllValues(expectedAr);
    });
  });
  describe('meanOfArr()', () => {
    test('Should calculate mean - integer result', () => {
      const arr = [6, 11, 7];
      const res = helpers.meanOfArr(arr);
      expect(res).toEqual(8);
    });
    test('Should calculate mean - large set, integer result', () => {
      const arr = [3, 7, 5, 13, 20, 23, 39, 23, 40, 23, 14, 12, 56, 23, 29];
      const res = helpers.meanOfArr(arr);
      expect(res).toEqual(22);
    });
    test('Should calculate mean - float result', () => {
      const arr = [6, 11, 7, 1];
      const res = helpers.meanOfArr(arr);
      expect(res).toEqual(6.25);
    });
  });
});
