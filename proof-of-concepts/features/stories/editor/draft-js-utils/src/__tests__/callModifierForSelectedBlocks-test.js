// @flow
const {describe, it, beforeEach} = global;
import expect from 'expect';
import callModifierForSelectedBlocks from '../callModifierForSelectedBlocks';
import {EditorState, Modifier, SelectionState} from 'draft-js';

const insertText = (editorState, selection, text) => {
  const currentContentState = editorState.getCurrentContent();
  const targetRange = selection || editorState.getSelection();
  const contentStateWithAddedText = Modifier.insertText(
    currentContentState,
    targetRange,
    text,
  );

  const newEditorState = EditorState.push(
    editorState,
    contentStateWithAddedText,
    'insert-characters',
  );

  return EditorState.forceSelection(
    newEditorState,
    contentStateWithAddedText.getSelectionAfter(),
  );
};

const splitLastBlock = (editorState) => {
  const newContentState = Modifier.splitBlock(
    editorState.getCurrentContent(),
    editorState.getSelection(),
  );

  return EditorState.push(editorState, newContentState, 'split-block');
};

const emptyEditorState = EditorState.createEmpty();
let editorState = insertText(
  emptyEditorState,
  undefined,
  'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
);

const block = editorState
  .getCurrentContent()
  .getBlockMap()
  .first();
const blockKey = block.getKey();

editorState = EditorState.forceSelection(
  editorState,
  new SelectionState({
    anchorKey: blockKey,
    anchorOffset: 0,
    focusKey: blockKey,
    focusOffset: block.getLength(),
  }),
);

describe('callModifierForSelectedBlocks', () => {
  let splitState;
  let first;
  let last;
  beforeEach(() => {
    splitState = splitLastBlock(editorState);
    const blockMap = splitState.getCurrentContent().getBlockMap();
    first = blockMap.first();
    last = blockMap.last();
    splitState = EditorState.forceSelection(
      splitState,
      new SelectionState({
        anchorKey: first.getKey(),
        anchorOffset: 0,
        focusKey: last.getKey(),
        focusOffset: last.getLength(),
      }),
    );
  });

  it('should call the modifier function for each selected block', () => {
    const spy = expect.createSpy((editorState) => editorState).andCallThrough();
    callModifierForSelectedBlocks(splitState, spy);
    expect(spy.calls.length).toEqual(2);
  });

  it('should call the modifier function with editorState, a selection object and all additional arguments', () => {
    const spy = expect.createSpy((editorState) => editorState).andCallThrough();
    const anObject = {some: 'prop'};
    const anArray = [1, 2, 3];
    callModifierForSelectedBlocks(splitState, spy, anObject, anArray, true);

    const [state, selection, ...rest] = spy.calls[0].arguments;
    const anchorKey = selection.getStartKey();
    const focusKey = selection.getEndKey();
    const anchorOffset = selection.getStartOffset();
    const focusOffset = selection.getEndOffset();

    expect(state).toBe(splitState);
    expect(anchorKey).toBe(first.getKey());
    expect(focusKey).toBe(first.getKey());
    expect(anchorOffset).toBe(0);
    expect(focusOffset).toBe(first.getLength());
    expect(rest).toEqual([anObject, anArray, true]);
  });

  it('should pass the previously returned editor state the to then next modifier', () => {
    const newState = EditorState.createEmpty();
    const spy = expect.createSpy(() => newState).andCallThrough();
    callModifierForSelectedBlocks(splitState, spy);

    const [state] = spy.calls[1].arguments;

    expect(state).toBe(newState);
  });

  it('should return the modified editor state', () => {
    const spy = expect
      .createSpy((editorState, selection) =>
        insertText(editorState, selection, 'TEST'),
      )
      .andCallThrough();
    const finalState = callModifierForSelectedBlocks(splitState, spy);

    const blockMap = finalState.getCurrentContent().getBlockMap();

    expect(finalState).toNotBe(splitState);
    expect(
      blockMap
        .first()
        .getText()
        .endsWith('TEST'),
    ).toBe(true);
    expect(
      blockMap
        .last()
        .getText()
        .endsWith('TEST'),
    ).toBe(true);
  });

  it('should override any custom selection done within the modifier', () => {
    const spy = expect
      .createSpy((editorState, selection) =>
        EditorState.forceSelection(editorState, selection),
      )
      .andCallThrough();
    const finalState = callModifierForSelectedBlocks(splitState, spy);

    expect(finalState.getSelection()).toBe(splitState.getSelection());
  });

  it('should pass in the proper selections for start and end blocks if they are partially selected', () => {
    splitState = EditorState.forceSelection(
      splitState,
      new SelectionState({
        anchorKey: last.getKey(),
        anchorOffset: Math.round(last.getLength() / 2),
        focusKey: last.getKey(),
        focusOffset: Math.round(last.getLength() / 2),
      }),
    );

    splitState = splitLastBlock(splitState);
    const contentState = splitState.getCurrentContent();
    const blockMap = contentState.getBlockMap();
    const firstBlock = blockMap.first();
    const middleBlock = contentState.getBlockAfter(firstBlock.getKey());
    const lastBlock = blockMap.last();
    splitState = EditorState.forceSelection(
      splitState,
      new SelectionState({
        anchorKey: firstBlock.getKey(),
        anchorOffset: 10,
        focusKey: lastBlock.getKey(),
        focusOffset: last.getLength() - 10,
      }),
    );
    const spy = expect.createSpy((state) => state).andCallThrough();
    callModifierForSelectedBlocks(splitState, spy);
    const selections = spy.calls.map((obj) => obj.arguments[1]);
    const expected = [
      {
        anchorKey: firstBlock.getKey(),
        focusKey: firstBlock.getKey(),
        anchorOffset: 10,
        focusOffset: firstBlock.getLength(),
      },
      {
        anchorKey: middleBlock.getKey(),
        focusKey: middleBlock.getKey(),
        anchorOffset: 0,
        focusOffset: middleBlock.getLength(),
      },
      {
        anchorKey: lastBlock.getKey(),
        focusKey: lastBlock.getKey(),
        anchorOffset: 0,
        focusOffset: lastBlock.getLength() - 10,
      },
    ];

    selections.forEach((selection, index) => {
      const {anchorKey, focusKey, anchorOffset, focusOffset} = expected[index];

      expect(anchorKey).toBe(selection.getStartKey());
      expect(focusKey).toBe(selection.getEndKey());
      expect(anchorOffset).toBe(selection.getStartOffset());
      expect(focusOffset).toBe(selection.getEndOffset());
    });
  });
});
