// @flow
const {describe, it} = global;
import expect from 'expect';
import {convertFromRaw} from 'draft-js';
import stateToMarkdown from '../stateToMarkdown';
import fs from 'fs';
import {join} from 'path';

// This separates the test cases in `data/test-cases.txt`.
const SEP = '\n\n>>';

let testCasesRaw = fs.readFileSync(
  join(__dirname, '..', '..', 'test', 'test-cases.txt'),
  'utf8',
);

let testCases = testCasesRaw
  .slice(2)
  .trim()
  .split(SEP)
  .map((text) => {
    let lines = text.split('\n');
    let [description, config] = lines.shift().split('|');
    description = description.trim();
    let options = config ? JSON.parse(config.trim()) : undefined;
    let state = JSON.parse(lines.shift());
    let markdown = lines.join('\n');
    return {description, state, markdown, options};
  });

describe('stateToMarkdown', () => {
  testCases.forEach((testCase) => {
    let {description, state, markdown, options} = testCase;
    it(`should render ${description}`, () => {
      let contentState = convertFromRaw(state);
      expect(stateToMarkdown(contentState, options)).toBe(markdown + '\n');
    });
  });
});
