/**
 * Disable format control
 * - Two links highlighted
 * - More than one selection block highlighted
 * - When the editor is not focused
 *
 * If Draft editor is currently not focused
 * When a format control is selected
 * - use the last cursor selection and focus there
 * - or begin at end of doc
 */

import React from 'react';
import {
  styleMap,
  getBlockStyle,
  StyleButton,
  BlockStyleControls,
  InlineStyleControls
} from './FormatControls';
import { sampleMarkdown } from './stub';
import { stateFromMarkdown } from 'draft-js-import-markdown';
import { stateToMarkdown } from 'draft-js-export-markdown';
import {
  Editor,
  EditorState,
  RichUtils,
  CompositeDecorator,
  SelectionState,
  Modifier
} from 'draft-js';
import './App.css';
import {
  RegularLink,
  findLinkEntities,
  LinkDetails,
  LinkEditor,
  LinkInlineControl
} from './Link/link';

const initialLinkState = {
  linkSelection: null,
  textSelection: null,
  showDetails: false,
  showEditor: false,
  url: '',
  text: '',
  coords: null
};

function linkStateReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_LINK': {
      return initialLinkState;
    }
    case 'REMOVE_LINK': {
      return initialLinkState;
    }
    case 'OPEN_EDITOR_BY_LINK_DETAILS': {
      const newLinkState = { ...state };
      const { linkRange, editorState } = action.props;
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
    case 'OPEN_DETAILS': {
      const newLinkState = { ...state };
      const { linkRange, editorState } = action.props;
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
        addLinkCoordinates(newLinkState, linkDimensions);

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
    case 'CLOSE_EDITOR': {
      return initialLinkState;
    }
    case 'CLOSE_DETAILS': {
      return initialLinkState;
    }
    case 'OPEN_EDITOR_BY_EDITOR_CONTROL_FOR_TEXT': {
      const newLinkState = { ...state };
      const { textRange, editorState } = action.props;
      const start = textRange[0];
      const end = textRange[1];
      const selectionState = editorState.getSelection(); // Get the text content range
      const selectionBlockID = editorState.getSelection().getStartKey();
      const textDOMNode = getTextDOMNode(selectionBlockID);
      const textBlockDimensions = textDOMNode.getBoundingClientRect();
      addLinkCoordinates(newLinkState, textBlockDimensions);

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
      console.log('Open Editor');
      return newLinkState;
    }
    default: {
      throw new Error('Unhandled Link Entity action type');
    }
  }
}

export default function App() {
  const decorator = new CompositeDecorator([
    {
      strategy: findLinkEntities,
      component: RegularLink
    }
  ]);

  const [state, setState] = React.useState(
    EditorState.createWithContent(stateFromMarkdown(sampleMarkdown), decorator)
  );
  const [linkState, dispatch] = React.useReducer(linkStateReducer, initialLinkState);
  const linkEditorRef = React.useRef(null);

  const onChange = (editorState) => setState(editorState);
  const toggleBlockType = (blockType) => {
    onChange(RichUtils.toggleBlockType(state, blockType));
  };
  const toggleInlineStyle = (inlineStyle) => {
    onChange(RichUtils.toggleInlineStyle(state, inlineStyle));
  };
  const toggleLink = () => {
    onChange(RichUtils.toggleLink(state, state.getSelection()));
  };

  function openEditor(e, control) {
    console.log(e);
    const cursorStart = state.getSelection().getStartOffset();
    const cursorEnd = state.getSelection().getEndOffset();
    const selectionBlockID = state.getSelection().getStartKey();
    const selectionBlock = state.getCurrentContent().getBlockForKey(selectionBlockID);

    switch (control.type) {
      case 'LINK_DETAILS':
        findLinkEntities(
          selectionBlock,
          (start, end) => {
            if (cursorMatchesSingleLinkRange(cursorStart, cursorEnd, start, end)) {
              dispatch({
                type: 'OPEN_EDITOR_BY_LINK_DETAILS',
                props: {
                  editorState: state,
                  linkRange: [start, end]
                }
              });
            }
          },
          state.getCurrentContent()
        );
        break;
      case 'EDITOR_CONTROL':
        // check if the cursor selection is on a link range
        const cursorIsOnLink = linkState.showDetails;
        if (cursorIsOnLink) {
          console.log('on a link');
        } else {
          // cursor is on text
          let cursorStart = state.getSelection().getStartOffset();
          let cursorEnd = state.getSelection().getEndOffset();
          dispatch({
            type: 'OPEN_EDITOR_BY_EDITOR_CONTROL_FOR_TEXT',
            props: {
              editorState: state,
              textRange: [cursorStart, cursorEnd]
            }
          });
        }
        break;
      default:
        throw new TypeError('Unhandled control to open editor ');
    }
  }

  /**
   * EFFECT: Highlight for Text
   * Apply a highlight to the Text DOM Node that the user wants to convert into a link
   */
  React.useEffect(() => {
    const { textSelection } = linkState;
    const userSelection = state.getSelection();
    if (
      linkState.showEditor &&
      linkState.textSelection &&
      cursorIsSelectingOriginalText(linkState, textSelection, userSelection)
    ) {
      const editorStateWithTextSelection = EditorState.forceSelection(
        state,
        textSelection
      );
      const contentState = Modifier.applyInlineStyle(
        editorStateWithTextSelection.getCurrentContent(),
        textSelection,
        'HIGHLIGHT_LINK'
      );
      console.log(contentState);
      const newState = EditorState.push(
        editorStateWithTextSelection,
        contentState,
        'change-inline-styles'
      );
      const editorStateWithTextHighlight = EditorState.forceSelection(
        newState,
        textSelection
      );
      setState(editorStateWithTextHighlight);
      console.log('Apply highlight');
    }
  }, [linkState.textSelection, linkState.showEditor, linkEditorRef.current]);

  /**
   * EFFECT: Highlight for link
   * Apply a highlight to the entire link entity range and focus the input box
   */
  React.useEffect(() => {
    if (linkState.linkSelection) {
      console.log('Highlight Link');
      let selectionState = SelectionState.createEmpty('foo');
      let updatedSelection = selectionState.merge({
        anchorKey: linkState.linkSelection.anchorKey,
        anchorOffset: linkState.linkSelection.getAnchorOffset(),
        focusKey: linkState.linkSelection.focusKey,
        focusOffset: linkState.linkSelection.getFocusOffset()
      });
      const editorWithLinkSelection = EditorState.forceSelection(
        state,
        updatedSelection
      );
      const contentState = Modifier.applyInlineStyle(
        editorWithLinkSelection.getCurrentContent(),
        updatedSelection,
        'HIGHLIGHT_LINK'
      );

      const newState = EditorState.push(
        editorWithLinkSelection,
        contentState,
        'change-inline-styles'
      );

      const editorWithLinkHighlightAndPreviousSelection = EditorState.forceSelection(
        newState,
        updatedSelection
      );
      setState(editorWithLinkHighlightAndPreviousSelection);
    }
  }, [linkState.linkSelection, linkEditorRef.current]);
  /**
   * EFFECT: Focus the link editor
   */
  React.useEffect(() => {
    if (linkEditorRef.current) {
      console.log('Focus Link Editor');
      linkEditorRef.current.focus();
    }
  }, [linkEditorRef.current]);
  /**
   * Change: check to see if the cursor is on two selection blocks
   * EFFECT: Closing Editor or Details for Link Entities
   * Detects if the user's cursor is still on the ~Link~ Entity
   * Closes the details || editor if the link no longer has selection
   */
  React.useEffect(() => {
    // determine if a cursor is on a link element
    // that tells us that we need to display the details popover - derived state
    // if so, get coordinates of where to display the popover
    // get information of what to display in the popover
    // get the ID of the link that we're displaying the details for
    const cursorStart = state.getSelection().getStartOffset();
    const cursorEnd = state.getSelection().getEndOffset();
    const selectionBlockID = state.getSelection().getStartKey();
    const selectionBlockEndID = state.getSelection().getEndKey();
    const selectionBlock = state.getCurrentContent().getBlockForKey(selectionBlockID);
    let cursorIsOnLink = false;

    if (cursorIsOnSingleBlock(selectionBlockID, selectionBlockEndID)) {
      findLinkEntities(
        selectionBlock,
        (start, end) => {
          if (cursorMatchesSingleLinkRange(cursorStart, cursorEnd, start, end)) {
            cursorIsOnLink = true; // do we need to know if the cursor is on the link in order to know when to keep our popovers open or to close them?
            dispatch({
              type: 'OPEN_DETAILS',
              props: { editorState: state, linkRange: [start, end] }
            });
          }
        },
        state.getCurrentContent()
      );
    }
    // If the current cursor is no longer on a link
    // and the link editor is open -> close the editor
    // and remove the highlight link class from the link range that was selected
    // in all other cases (the link details is open), close the link details
    if (!cursorIsOnLink && linkState.showDetails && linkState.textSelection === null)
      dispatch({ type: 'CLOSE_DETAILS' });
    // 🐛 remove highlight
    // we only remove highlight when the cursor is not on the link
    // BUT suppose, the user closes the editor and the cursor is still on the link
    //
    // fix: figure out a way to not show the editor
    // like if we focus away from the text input for the link editor
    // THEN close the link editor and cleanup
    if (!cursorIsOnLink && linkState.showEditor && linkState.linkSelection) {
      let contentState = Modifier.removeInlineStyle(
        state.getCurrentContent(),
        linkState.linkSelection,
        'HIGHLIGHT_LINK'
      );

      const newState = EditorState.push(state, contentState, 'change-inline-styles');
      setState(newState);
      dispatch({ type: 'CLOSE_EDITOR' });
    }
  }, [
    state.getSelection().getStartOffset(),
    state.getSelection().getEndOffset(),
    linkState.linkSelection
  ]);

  /**
   * Change: check to see if the cursor is on two selection blocks
   * EFFECT: Closing Editor For TEXT
   * Detects if the user's cursor is still on the ~Text~ DOM Node that they wanted to convert into a link
   * Closes the editor if the text no longer has selection
   */
  React.useEffect(() => {
    const { textSelection } = linkState;
    const userSelection = state.getSelection();

    // check if the user's cursor has moved i.e. it is on a different piece of text
    if (
      linkState.showEditor &&
      linkState.textSelection &&
      !cursorIsSelectingOriginalText(linkState, textSelection, userSelection)
    ) {
      const contentState = Modifier.removeInlineStyle(
        state.getCurrentContent(),
        linkState.textSelection,
        'HIGHLIGHT_LINK'
      );
      const stateWithoutTextHighlight = EditorState.push(
        state,
        contentState,
        'change-inline-styles'
      );
      const stateWithUserSelection = EditorState.forceSelection(
        stateWithoutTextHighlight,
        userSelection
      );
      setState(stateWithUserSelection);
      dispatch({ type: 'CLOSE_EDITOR' });
    }
  }, [
    linkState.textSelection,
    linkState.showEditor,
    state.getSelection().getStartOffset(),
    state.getSelection().getEndOffset()
  ]);

  function removeLink(e) {
    const cursorStart = state.getSelection().getStartOffset();
    const cursorEnd = state.getSelection().getEndOffset();
    const selectionBlockID = state.getSelection().getStartKey();
    const selectionBlock = state.getCurrentContent().getBlockForKey(selectionBlockID);
    // capture the original selection state
    // after removing the link
    // place the selectionstate back on the link
    findLinkEntities(
      selectionBlock,
      (start, end) => {
        if (cursorMatchesSingleLinkRange(cursorStart, cursorEnd, start, end)) {
          let selectionState = SelectionState.createEmpty('link-to-remove');
          let updatedSelection = selectionState.merge({
            anchorKey: selectionBlockID,
            anchorOffset: start,
            focusKey: selectionBlockID,
            focusOffset: end
          });

          const contentState = Modifier.removeInlineStyle(
            state.getCurrentContent(),
            updatedSelection,
            'HIGHLIGHT_LINK'
          );

          const newState = EditorState.push(
            state,
            contentState,
            'change-inline-styles'
          );

          dispatch({ type: 'REMOVE_LINK' });
          setState(RichUtils.toggleLink(newState, updatedSelection, null));
        }
      },
      state.getCurrentContent()
    );
  }

  function closeLinkEditor(e) {
    let contentState;
    if (linkState.linkSelection) {
      contentState = Modifier.removeInlineStyle(
        state.getCurrentContent(),
        linkState.linkSelection,
        'HIGHLIGHT_LINK'
      );
    } else if (linkState.textSelection) {
      contentState = Modifier.removeInlineStyle(
        state.getCurrentContent(),
        linkState.textSelection,
        'HIGHLIGHT_LINK'
      );
    }
    const newState = EditorState.push(state, contentState, 'change-inline-styles');
    setState(newState);
    dispatch({ type: 'CLOSE_EDITOR' });
  }

  /**
   * Update the existing link meaning:
   * change the link's URL or,
   * change the link's text
   */
  function updateLink({ url, text }) {
    if (!hasHTTPS(url)) url = 'https://'.concat(url);
    if (text === '') text = url;
    const { textSelection, linkSelection } = linkState;

    let contentState = state.getCurrentContent();
    let selectionState = SelectionState.createEmpty('link-to-update');
    let updatedSelection;
    if (linkSelection) {
      updatedSelection = selectionState.merge({
        anchorKey: selection.anchorKey,
        anchorOffset: selection.anchorOffset,
        focusKey: selection.focusKey,
        focusOffset: selection.focusOffset
      });
    } else {
      updatedSelection = textSelection;
    }

    let updatedContent = Modifier.removeInlineStyle(
      contentState,
      updatedSelection,
      'HIGHLIGHT_LINK'
    );
    let replacedContent = updatedContent.createEntity('LINK', 'MUTABLE', {
      url: url,
      text
    });

    const entityKey = replacedContent.getLastCreatedEntityKey();
    let newContentState = Modifier.replaceText(
      replacedContent,
      updatedSelection,
      text,
      null,
      entityKey
    );

    const blockType = state
      .getCurrentContent()
      .getBlockForKey(updatedSelection.getStartKey())
      .getType();
    console.log(blockType);

    setState(EditorState.push(state, newContentState, 'insert-characters'));
    dispatch({ type: 'UPDATE_LINK' });
  }

  const logMarkdown = () => {
    const convertMd = stateToMarkdown(state.getCurrentContent());
    console.log(convertMd);
  };

  const logContentObj = () => {
    console.log(str);
  };

  const [editorFocus, setEditorFocus] = React.useState(false);
  const onEditorFocus = () => setEditorFocus(true);
  const onEditorBlur = () => {
    console.log('editor blur');
    setEditorFocus(false);
  };

  const formattingControlOnClick = () => {
    if (editorFocus === false) {
      console.log('not focused');
    }
  };

  return (
    <div className="RichEditor-root">
      <BlockStyleControls
        editorState={state}
        onToggle={toggleBlockType}
        onClick={formattingControlOnClick}
      />
      <InlineStyleControls
        editorState={state}
        onToggle={toggleInlineStyle}
        onClick={formattingControlOnClick}
      />
      <LinkInlineControl
        active={linkState.showDetails || linkState.showEditor}
        editorState={state}
        onClick={openEditor}
        control={{ type: 'EDITOR_CONTROL' }}
      />
      <div className="RichEditor-editor">
        <Editor
          // onFocus={onEditorFocus}
          // onBlur={onEditorBlur}
          blockStyleFn={getBlockStyle}
          customStyleMap={styleMap}
          editorState={state}
          onChange={onChange}
          spellCheck={true}
        />
      </div>
      <LinkDetails
        linkState={linkState}
        shouldShow={linkState.showDetails}
        removeLink={removeLink}
        onDetailsChange={openEditor}
        control={{ type: 'LINK_DETAILS' }}
      />
      <LinkEditor
        onBlur={closeLinkEditor}
        editorRef={linkEditorRef}
        linkState={linkState}
        shouldShow={linkState.showEditor}
        updateLink={updateLink}
      />
      <button onClick={logMarkdown}>Log Markdown</button>
      <button onClick={logContentObj}>Log to Content Object</button>
    </div>
  );
}

function hasHTTPS(url) {
  const httpsCheck = /^(?:(?:(?:https?|ftp):)?\/\/)/i;
  const urlExp = new RegExp(httpsCheck);
  return urlExp.test(url);
}

// if the editor is open, compare cursor selection objects
function cursorIsSelectingOriginalText(state, textSelection, userSelection) {
  // console.log('state:', state);
  // console.log('textSelection:', textSelection);
  // console.log('userSelection:', userSelection);
  // console.log('');
  // console.log('');
  return (
    state.showEditor &&
    textSelection.anchorKey === userSelection.anchorKey &&
    textSelection.focusKey === userSelection.focusKey &&
    textSelection.anchorOffset === userSelection.anchorOffset &&
    textSelection.focusOffset === userSelection.focusOffset
  );
}

function getTextDOMNode(dataBlockKey) {
  var selection = window.getSelection();
  var node = selection.getRangeAt(0).startContainer;
  while (node != null) {
    if (
      node.getAttribute &&
      node.getAttribute('data-offset-key') &&
      node.getAttribute('data-offset-key').includes(`${dataBlockKey}`)
    ) {
      return node;
    }
    node = node.parentNode;
  }
  return null;
}

// To identify a link selection, we need to differentiate between
// - a user's selection on the entire block range
// - and a user's collapsed selection
// For now, our solution is to check the block IDs of the anchor and focus's selections
// When the entire block is highlighted via double/triple click, the anchor and focus
// selection keys will be different.
// When the cursor selection is just on the link element, the anchor and focus selection
// keys will be the same
// Without the conditional check below, we might show the link details popover when the
// user does not intend the popover to be displayed.
function cursorIsOnSingleBlock(selectionBlockID, selectionBlockEndID) {
  return selectionBlockID === selectionBlockEndID;
}

// getSelectedLinkElement() grabs the DOM node of the selected link
// Before we call this function,
// we must make sure that we've already guarded against the following:
// 1. our cursor selection is within the bounds of a *single* link
// 2. our cursor selection does not span multiple links
// ex: suppose linkA and linkB exist side-by-side
// - linkAlinkB
// and our cursor selection's anchor (a) is on some index within linkA
// and our cursor selection's offset (o) is on some index within linkB
// - linkAlinkB
//   a------o
// If we call this function without the cursor selection boundary check
// then we run the risk of revealing a popover on the wrong link
const getSelectedLinkElement = () => {
  var selection = window.getSelection();
  if (selection.rangeCount == 0) return null;
  var node = selection.getRangeAt(0).startContainer;
  do {
    if (node.getAttribute && node.getAttribute('class') == 'bottomline-link')
      return node;
    node = node.parentNode;
  } while (node != null);
  return null;
};

function cursorMatchesSingleLinkRange(cursorStart, cursorEnd, start, end) {
  return (
    cursorStart >= start &&
    cursorStart <= end &&
    cursorEnd >= start &&
    cursorEnd <= end
  );
}

function addLinkCoordinates(newLinkState, linkDimensions) {
  newLinkState.coords = {};
  newLinkState.coords.bottom = linkDimensions.bottom;
  newLinkState.coords.height = linkDimensions.height;
  newLinkState.coords.left = linkDimensions.left;
  newLinkState.coords.right = linkDimensions.right;
  newLinkState.coords.top = linkDimensions.top;
  newLinkState.coords.width = linkDimensions.width;
  newLinkState.coords.x = linkDimensions.x;
  newLinkState.coords.y = linkDimensions.y;
}
