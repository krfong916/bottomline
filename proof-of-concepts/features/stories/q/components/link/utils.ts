import {
  EditorState,
  SelectionState,
  ContentBlock,
  ContentState,
  CharacterMetadata
} from 'draft-js';
import { LinkState, LinkCoordinates } from './types';

/**
 * Iterates over the content block and determines the ranges of link entities
 * For example, suppose the following content block:
 * "Hello world I'm going.com to PEE.com"
 * The string would be considered a content block. 'going.com' and 'PEE.com'
 * would be considered Link entities. We call the callback on the two link ranges
 */
export const findLinkEntities = (
  contentBlock: ContentBlock,
  callback: (start: number, end: number) => void,
  contentState: ContentState
) => {
  contentBlock.findEntityRanges((character: CharacterMetadata): boolean => {
    const entityKey = character.getEntity();
    const test =
      entityKey !== null && contentState.getEntity(entityKey).getType('LINK');
    return test;
  }, callback);
};

export const initialLinkState = {
  linkSelection: null,
  textSelection: null,
  showDetails: false,
  showEditor: false,
  url: '',
  text: '',
  coords: {}
} as LinkState;

/**
 * Adds window location of the DOM element to the link state
 */
export function getLinkCoordinates(linkDimensions: DOMRect): LinkCoordinates {
  return {
    bottom: linkDimensions.bottom,
    height: linkDimensions.height,
    left: linkDimensions.left,
    right: linkDimensions.right,
    top: linkDimensions.top,
    width: linkDimensions.width,
    x: linkDimensions.x,
    y: linkDimensions.y
  };
}

/**
 * Returns the DOM node of the first content block, useful for when the editor state is empty
 */
export function getFirstBlockDOMNode(firstContentBlock: string): Element | null {
  const node = document.querySelector(`[data-offset-key='${firstContentBlock}-0-0']`);
  return node;
}

/**
 * Returns the DOM node of the text range selection, useful for when converting a text to link
 */
export function getTextDOMNode(): Range | null {
  let selection = window.getSelection() && window.getSelection();
  return selection ? selection.getRangeAt(0) : null;
}

/**
 * Grabs the DOM node of the selected link
 */
export function getSelectedLinkElement(): (Node & Element) | null {
  let selection = window.getSelection() && window.getSelection();
  if (!selection || selection.rangeCount == 0) return null;
  let node = selection.getRangeAt(0).startContainer as Node & Element;
  while (node != null) {
    if (node.getAttribute && node.getAttribute('class') === 'bottomline-link')
      return node;
    node = node.parentNode as Node & Element;
  }
  return null;
}

/**
 * Determine if the user's cursor selection is within the start and end range of a piece of text
 * @param  cursorStart - the anchor index of user's cursor selection
 * @param  cursorEnd - the focus index of the user's cursor selection
 * @param  start - the start index of the text range
 * @param  end - the end index of the text range
 */
export function cursorMatchesSingleLinkRange(
  cursorStart: number,
  cursorEnd: number,
  start: number,
  end: number
): boolean {
  return (
    cursorStart >= start &&
    cursorStart <= end &&
    cursorEnd >= start &&
    cursorEnd <= end
  );
}

/**
 * Checks if the user's selected range is on a single selection block
 * i.e. whether or not the selected range spans multiple lines
 * Definition: Block
 * - a block is synonymous with line of text
 * @param  selectionBlockID - the selection block that the user's cursor begins on
 * @param  selectionBlockEndID - the selection block that the user's cursor ends on
 */
export function cursorIsOnSingleBlock(
  selectionBlockID: string,
  selectionBlockEndID: string
): boolean {
  return selectionBlockID === selectionBlockEndID;
}

/**
 * Regex test to detect whether or not the url string contains an https scheme
 */
export function hasHTTPS(url: string): boolean {
  const httpsCheck = /^(?:(?:(?:https?):)?\/\/)/i;
  const urlExp = new RegExp(httpsCheck);
  return urlExp.test(url);
}

/**
 *
 * @param  state - link
 * @param  textSelection
 * @param  userSelection
 */
export function cursorIsSelectingOriginalText(
  state: LinkState,
  textSelection: SelectionState | null,
  userSelection: SelectionState
): boolean {
  if (textSelection === null) return false;
  return (
    state.showEditor &&
    textSelection.getAnchorKey() === userSelection.getAnchorKey() &&
    textSelection.getFocusKey() === userSelection.getFocusKey() &&
    textSelection.getAnchorOffset() === userSelection.getAnchorOffset() &&
    textSelection.getFocusOffset() === userSelection.getFocusOffset()
  );
}

export function getSelectionIndices(editorState: EditorState) {
  return {
    cursorStart: editorState.getSelection().getStartOffset(),
    cursorEnd: editorState.getSelection().getEndOffset()
  };
}

export function getSelectionBlockProps(editorState: EditorState) {
  let selectionBlockID = editorState.getSelection().getStartKey();
  return {
    selectionBlockID,
    selectionBlockEndID: editorState.getSelection().getEndKey(),
    selectionBlock: editorState.getCurrentContent().getBlockForKey(selectionBlockID)
  };
}
