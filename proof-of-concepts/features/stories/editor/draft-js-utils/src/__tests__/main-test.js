// @flow
const {describe, it} = global;
import expect from 'expect';
import {Constants, BLOCK_TYPE} from '../main';

describe('main exports', () => {
  it('two ways to import constants', () => {
    expect(Constants.BLOCK_TYPE).toBe(BLOCK_TYPE);
  });
});
