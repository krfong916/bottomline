// @flow
const {describe, it} = global;
import expect from 'expect';
import getSelectedBlocks from '../getSelectedBlocks';
import {EditorState, Modifier} from 'draft-js';

const splitLastBlock = (editorState) => {
  const newContentState = Modifier.splitBlock(
    editorState.getCurrentContent(),
    editorState.getSelection(),
  );

  const newEditorState = EditorState.push(
    editorState,
    newContentState,
    'split-block',
  );

  return EditorState.forceSelection(
    newEditorState,
    newContentState.getSelectionAfter(),
  );
};

const editorState = [...Array(3)].reduce(
  (state) => splitLastBlock(state),
  EditorState.createEmpty(),
);
const contentState = editorState.getCurrentContent();
const blockKeys = contentState
  .getBlockMap()
  .keySeq()
  .toArray();

describe('getSelectedBlocks', () => {
  it('should return the blocks between two blocks, inclusive', () => {
    const anchorKey = blockKeys[0];
    const focusKey = blockKeys[3];
    const allBlocks = blockKeys.map((key) => contentState.getBlockForKey(key));

    expect(getSelectedBlocks(contentState, anchorKey, focusKey)).toEqual(
      allBlocks,
    );
  });

  it('should return a single block if anchor and focus key are the same', () => {
    let anchorKey = blockKeys[0];
    let focusKey = blockKeys[0];
    let block = [contentState.getBlockForKey(anchorKey)];

    expect(getSelectedBlocks(contentState, anchorKey, focusKey)).toEqual(block);

    anchorKey = blockKeys[2];
    focusKey = blockKeys[2];
    block = [contentState.getBlockForKey(anchorKey)];

    expect(getSelectedBlocks(contentState, anchorKey, focusKey)).toEqual(block);
  });

  it('should return an empty array, if anchor and focus key are backwards', () => {
    const anchorKey = blockKeys[3];
    const focusKey = blockKeys[0];

    expect(getSelectedBlocks(contentState, anchorKey, focusKey)).toEqual([]);
  });

  it('should return an empty array, if anchor or focus key are invalid', () => {
    let anchorKey = blockKeys[0];
    let focusKey = 'INVALID';

    expect(getSelectedBlocks(contentState, anchorKey, focusKey)).toEqual([]);

    anchorKey = 'INVALID';
    focusKey = blockKeys[2];

    expect(getSelectedBlocks(contentState, anchorKey, focusKey)).toEqual([]);

    anchorKey = 'INVALID';
    focusKey = 'INVALID_TOO';

    expect(getSelectedBlocks(contentState, anchorKey, focusKey)).toEqual([]);

    anchorKey = 'INVALID';
    focusKey = 'INVALID';

    expect(getSelectedBlocks(contentState, anchorKey, focusKey)).toEqual([]);
  });
});
