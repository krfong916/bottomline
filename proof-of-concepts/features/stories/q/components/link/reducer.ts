import { LinkEditorStateChangeTypes, LinkState, LinkAction } from './types';
import {
  initialLinkState,
  getFirstBlockDOMNode,
  getSelectedLinkElement,
  getLinkCoordinates,
  getTextDOMNode
} from './utils';

export function linkStateReducer(state: LinkState, action: LinkAction) {
  const { type } = action;
  switch (type) {
    case LinkEditorStateChangeTypes.UPDATE_LINK: {
      return initialLinkState;
    }
    case LinkEditorStateChangeTypes.REMOVE_LINK: {
      return initialLinkState;
    }
    case LinkEditorStateChangeTypes.OPEN_EDITOR_BY_LINK_DETAILS: {
      const newLinkState = { ...state };
      const { linkRange, editorState } = action;
      const start = linkRange[0];
      const end = linkRange[1];
      const selectionBlockID = editorState.getSelection().getStartKey();
      const selectionBlock = editorState
        .getCurrentContent()
        .getBlockForKey(selectionBlockID);
      // Get the entire link entity range
      let selectionState = editorState.getSelection();
      let linkSelectionRange = selectionState.merge({
        anchorKey: selectionBlockID,
        anchorOffset: start,
        focusKey: selectionBlockID,
        focusOffset: end
      });
      // we need the link selection because we need to clean the selection up later
      newLinkState.linkSelection = linkSelectionRange;
      newLinkState.showDetails = false;
      newLinkState.showEditor = true;
      return newLinkState;
    }
    case LinkEditorStateChangeTypes.OPEN_DETAILS: {
      const newLinkState = { ...state };
      const { linkRange, editorState } = action;
      const start = linkRange[0];
      const end = linkRange[1];
      const selectionBlockID = editorState.getSelection().getStartKey();
      const selectionBlock = editorState
        .getCurrentContent()
        .getBlockForKey(selectionBlockID);

      const linkElement = getSelectedLinkElement();
      // determine if we need this
      if (linkElement) {
        // get current coords of link entity
        // in order to calculate link-details popover placement
        const linkDimensions = linkElement.getBoundingClientRect();
        newLinkState.coords = { ...getLinkCoordinates(linkDimensions) };

        // update link state
        const linkKey = selectionBlock.getEntityAt(start);
        const linkInstance = editorState.getCurrentContent().getEntity(linkKey);
        let url = linkInstance.getData().url;
        newLinkState.url = url;
        newLinkState.text = selectionBlock.getText().slice(start, end);
        newLinkState.showDetails = true;
        newLinkState.showEditor = false;
      }
      return newLinkState;
    }
    case LinkEditorStateChangeTypes.CLOSE_EDITOR: {
      return initialLinkState;
    }
    case LinkEditorStateChangeTypes.CLOSE_DETAILS: {
      return initialLinkState;
    }
    case LinkEditorStateChangeTypes.OPEN_EDITOR_BY_EDITOR_CONTROL_FOR_TEXT: {
      const newLinkState = { ...state };
      const { textRange, editorState, hasText } = action;
      const start = textRange[0];
      const end = textRange[1];
      const selectionState = editorState.getSelection(); // Get the text content range
      const selectionBlockID = editorState.getSelection().getStartKey();
      const firstContentBlock = editorState.getCurrentContent().getFirstBlock();

      let textDOMNode: Range | Element | null = hasText
        ? getTextDOMNode()
        : getFirstBlockDOMNode(firstContentBlock.getKey());

      const textBlockDimensions = textDOMNode!.getBoundingClientRect();
      newLinkState.coords = getLinkCoordinates(textBlockDimensions);

      const selectionBlock = editorState
        .getCurrentContent()
        .getBlockForKey(selectionBlockID);
      const selectionBlockText = selectionBlock.getText();
      const text = selectionBlockText.substring(start, end);

      // we need the link selection because we need to clean the selection up later
      newLinkState.text = text;
      newLinkState.textSelection = selectionState;
      newLinkState.showEditor = true;
      newLinkState.showDetails = false;
      return newLinkState;
    }
    case LinkEditorStateChangeTypes.OPEN_EDITOR_BY_EDITOR_CONTROL_FOR_LINK: {
      const newLinkState = { ...state };
      const { linkRange, editorState } = action;
      const start = linkRange[0];
      const end = linkRange[1];
      const selectionBlockID = editorState.getSelection().getStartKey();
      const selectionBlock = editorState
        .getCurrentContent()
        .getBlockForKey(selectionBlockID);
      // Get the entire link entity range
      let selectionState = editorState.getSelection();
      let linkSelectionRange = selectionState.merge({
        anchorKey: selectionBlockID,
        anchorOffset: start,
        focusKey: selectionBlockID,
        focusOffset: end
      });
      // we need the link selection because we need to clean the selection up later
      newLinkState.linkSelection = linkSelectionRange;
      newLinkState.showDetails = false;
      newLinkState.showEditor = true;
      return newLinkState;
    }
    default: {
      throw new Error('Unhandled Link Entity action type');
    }
  }
}
