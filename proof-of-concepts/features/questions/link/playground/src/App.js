// link editor correct placement
// - bug happens when clicking the link editor and no selection with text
// - we should expect
//   - if draft contains no text
//   - place editor at beginning
//   - if draft contains text
//   - do nothing, because we don't know where you want the editor
//

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
 *
 * Bug, on a blank draft state
 * Formatting a link using the link control
 * Exiting out of the link editor
 * - click
 * - selecting a new range
 * - caret on a piece of text
 * then formatting that piece/range using the link control
 * - does not focus the editor
 * exiting out of the link editor
 * and then formatting any new piece of text - the link editor does not open
 *
 *
 * when using link details
 * entire range gets focus
 * then clicking out of the link editor
 * the link range is still highlighted
 *
 *
 * what we should do is, whenever the editor loses focus
 * close the editor and remove the highlight
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
import './Link/link.css';
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

function getTextDOMNodeParent() {
  let selectionRect = window.getSelection && window.getSelection();
  if (!selectionRect) {
    const range = sel.getRangeAt(0);
    selectionRect = range.startContainer.getBoundingClientRect();
  }
  console.log();
  return selectionRect.focusNode.parentNode;
}

function linkStateReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_LINK': {
      return initialLinkState;
    }
    case 'REMOVE_LINK': {
      return initialLinkState;
    }
    case 'OPEN_EDITOR_BY_LINK_DETAILS': {
      console.log('[LINK_STATE_REDUCER: OPEN_EDITOR_BY_LINK_DETAILS]');
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
      const { textRange, editorState, hasText } = action.props;
      const start = textRange[0];
      const end = textRange[1];
      const selectionState = editorState.getSelection(); // Get the text content range
      const selectionBlockID = editorState.getSelection().getStartKey();
      let textDOMNode = hasText
        ? getTextDOMNode(selectionBlockID)
        : getTextDOMNodeParent(selectionBlockID);
      console.log('[LINK_STATE_REDUCER]: get dom node:', textDOMNode);
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
      return newLinkState;
    }
    case 'OPEN_EDITOR_BY_EDITOR_CONTROL_FOR_LINK': {
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
  const logMarkdown = () => {
    const convertMd = stateToMarkdown(state.getCurrentContent());
    console.log(convertMd);
  };

  ////////////////////////////////////
  ///    Open the Link editor      ///
  ////////////////////////////////////
  function openEditor(e, control) {
    switch (control.type) {
      case 'LINK_DETAILS':
        const { cursorStart, cursorEnd } = getSelectionIndices(state);
        const { selectionBlock } = getSelectionBlockProps(state);
        const currentLinkSelection = state.getSelection();
        findLinkEntities(
          selectionBlock,
          (start, end) => {
            if (cursorMatchesSingleLinkRange(cursorStart, cursorEnd, start, end)) {
              console.log('[APPLY_LINK_HIGHLIGHT EFFECT]');
              let selectionState = SelectionState.createEmpty('foo');
              let updatedSelection = selectionState.merge({
                anchorKey: currentLinkSelection.getAnchorKey(),
                anchorOffset: start,
                focusKey: currentLinkSelection.focusKey,
                focusOffset: end
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
                'change-inline-style'
              );

              setState(newState);
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
        console.log('[OPEN_EDITOR: EDITOR_CONTROL]:', linkState);
        // if the link-editor is currently open
        // and the user is continually clicking the link control button
        // leave the link-editor open and keep the link-editor focused
        if (linkState.showEditor) {
          linkEditorRef.current.focus();
          return;
          // if the editor isnt focused and has content
          // the link control button does nothing - move to be an effect
        } else if (editorFocus == false && state.getCurrentContent().hasText()) {
          console.log(
            '[OPEN_EDITOR: EDITOR_CONTROL]: editor has text and is not currently focused:',
            editorFocus
          );
          return;
        } else if (
          editorFocus == false &&
          state.getCurrentContent().hasText() == false
        ) {
          console.log(
            '[OPEN_EDITOR: EDITOR_CONTROL]: editor has no text and is not currently focused'
          );
          onEditorFocus();
        }
        const cursorIsOnLink = linkState.showDetails;
        if (cursorIsOnLink) {
          const { cursorStart, cursorEnd } = getSelectionIndices(state);
          const { selectionBlock } = getSelectionBlockProps(state);

          findLinkEntities(
            selectionBlock,
            (start, end) => {
              if (cursorMatchesSingleLinkRange(cursorStart, cursorEnd, start, end)) {
                dispatch({
                  type: 'OPEN_EDITOR_BY_EDITOR_CONTROL_FOR_LINK',
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
        } else {
          // cursor is on text
          const { cursorStart, cursorEnd } = getSelectionIndices(state);
          const hasText = state.getCurrentContent().hasText();
          if (hasText) {
            const currentTextSelection = state.getSelection();
            const editorStateWithTextSelection = EditorState.forceSelection(
              state,
              currentTextSelection
            );
            const contentState = Modifier.applyInlineStyle(
              editorStateWithTextSelection.getCurrentContent(),
              currentTextSelection,
              'HIGHLIGHT_LINK'
            );

            const newState = EditorState.push(
              editorStateWithTextSelection,
              contentState,
              'change-inline-styles'
            );
            setState(newState);
          }
          dispatch({
            type: 'OPEN_EDITOR_BY_EDITOR_CONTROL_FOR_TEXT',
            props: {
              editorState: state,
              textRange: [cursorStart, cursorEnd],
              hasText
            }
          });
        }
        break;
      default:
        throw new TypeError('Unhandled control to open editor ');
    }
  }

  //////////////////////////////////////////////////
  ///     Link Control for Formatting Toolbar    ///
  //////////////////////////////////////////////////
  const [disableLinkControl, setDisableLinkControl] = React.useState(false);
  /**
   * Enables/disables the formatting bar link button based on user cursor position in editor
   * Disabled: user's cursor range starts and ends on different lines ("blocks" in draft-js terms)
   * @dependency state.getSelection().getStartOffset() - the anchor index of the user's cursor
   * @dependency state.getSelection().getEndOffset()  - the focus index of the user's cursor
   */
  React.useEffect(() => {
    const { selectionBlockID, selectionBlockEndID } = getSelectionBlockProps(state);
    if (cursorIsOnSingleBlock(selectionBlockID, selectionBlockEndID) === false) {
      setDisableLinkControl(true);
    } else {
      setDisableLinkControl(false);
    }
  }, [state.getSelection().getStartOffset(), state.getSelection().getEndOffset()]);

  ////////////////////////
  ///    Link State    ///
  ////////////////////////
  const [linkState, dispatch] = React.useReducer(linkStateReducer, initialLinkState);

  /////////////////////////////////////////
  ///    Transforming Text to a Link    ///
  /////////////////////////////////////////
  /**
   * EFFECT: Highlight for Text
   * Apply a highlight to the Text DOM Node that the user wants to convert into a link
   */
  // React.useEffect(() => {
  //   const { textSelection } = linkState;
  //   const userSelection = state.getSelection();
  //   if (
  //     linkState.showEditor &&
  //     linkState.textSelection &&
  //     cursorIsSelectingOriginalText(linkState, textSelection, userSelection)
  //   ) {
  //     console.log('Effect: Highlight for text');
  //     const editorStateWithTextSelection = EditorState.forceSelection(
  //       state,
  //       textSelection
  //     );
  //     const contentState = Modifier.applyInlineStyle(
  //       editorStateWithTextSelection.getCurrentContent(),
  //       textSelection,
  //       'HIGHLIGHT_LINK'
  //     );

  //     const newState = EditorState.push(
  //       editorStateWithTextSelection,
  //       contentState,
  //       'change-inline-styles'
  //     );
  //     const editorStateWithTextHighlight = EditorState.forceSelection(
  //       newState,
  //       textSelection
  //     );
  //     setState(editorStateWithTextHighlight);
  //   }
  // }, [linkState.textSelection, linkState.showEditor]);
  /**
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
      console.log('[CLOSE_EDITOR_FOR_TEXT EFFECT]');
      const contentState = Modifier.removeInlineStyle(
        state.getCurrentContent(),
        linkState.textSelection,
        'HIGHLIGHT_LINK'
      );
      const stateWithoutTextHighlight = EditorState.push(
        state,
        contentState,
        'change-inline-style'
      );
      const stateWithUserSelection = EditorState.forceSelection(
        stateWithoutTextHighlight,
        userSelection
      );
      setState(stateWithUserSelection);
      dispatch({ type: 'CLOSE_EDITOR' });
    }
  }, [state.getSelection().getStartOffset(), state.getSelection().getEndOffset()]);

  ////////////////////////////////////
  ///     Edit an existing Link    ///
  ////////////////////////////////////
  /**
   * Show Details for Link Entities
   * Detects if the user's cursor is still on the ~Link~ Entity
   */
  React.useEffect(() => {
    if (linkState.showEditor === false) {
      const { cursorStart, cursorEnd } = getSelectionIndices(state);
      const {
        selectionBlock,
        selectionBlockID,
        selectionBlockEndID
      } = getSelectionBlockProps(state);

      if (cursorIsOnSingleBlock(selectionBlockID, selectionBlockEndID)) {
        findLinkEntities(
          selectionBlock,
          (start, end) => {
            if (cursorMatchesSingleLinkRange(cursorStart, cursorEnd, start, end)) {
              dispatch({
                type: 'OPEN_DETAILS',
                props: { editorState: state, linkRange: [start, end] }
              });
            }
          },
          state.getCurrentContent()
        );
      }
    }
  }, [
    state.getSelection().getStartOffset(),
    state.getSelection().getEndOffset(),
    state.getSelection().getStartKey(),
    state.getSelection().getEndKey()
  ]);
  /**
   * EFFECT: Highlight for link
   * Apply a highlight to the entire link entity range and focus the input box
   */
  // React.useEffect(() => {
  //   if (linkState.linkSelection && linkState.showEditor) {
  //     console.log('[APPLY_LINK_HIGHLIGHT EFFECT]');
  //     let selectionState = SelectionState.createEmpty('foo');
  //     let updatedSelection = selectionState.merge({
  //       anchorKey: linkState.linkSelection.anchorKey,
  //       anchorOffset: linkState.linkSelection.getAnchorOffset(),
  //       focusKey: linkState.linkSelection.focusKey,
  //       focusOffset: linkState.linkSelection.getFocusOffset()
  //     });
  //     const editorWithLinkSelection = EditorState.forceSelection(
  //       state,
  //       updatedSelection
  //     );
  //     const contentState = Modifier.applyInlineStyle(
  //       editorWithLinkSelection.getCurrentContent(),
  //       updatedSelection,
  //       'HIGHLIGHT_LINK'
  //     );

  //     const newState = EditorState.push(
  //       editorWithLinkSelection,
  //       contentState,
  //       'change-inline-style'
  //     );

  //     const editorWithLinkHighlightAndPreviousSelection = EditorState.forceSelection(
  //       newState,
  //       updatedSelection
  //     );
  //     setState(editorWithLinkHighlightAndPreviousSelection);
  //   }
  // }, [linkState.linkSelection, linkState.showEditor]);
  /**
   * Explicitly remove the url from an existing link
   * without the url, the link becomes a piece of text
   * @param  {[type]} e [description]
   * @return {[type]}   [description]
   */
  function removeLink(e) {
    const { cursorStart, cursorEnd } = getSelectionIndices(state);
    const { selectionBlock, selectionBlockID } = getSelectionBlockIDs(state);
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
  /**
   * Closes Detail Popup for links if the user is no longer selecting the link range
   */
  React.useEffect(() => {
    if (linkState.showEditor === false) {
      console.log('[CLOSE_LINK_DETAILS EFFECT]');
      const { cursorStart, cursorEnd } = getSelectionIndices(state);
      const {
        selectionBlock,
        selectionBlockID,
        selectionBlockEndID
      } = getSelectionBlockProps(state);
      let cursorIsOnLink = false;
      if (cursorIsOnSingleBlock(selectionBlockID, selectionBlockEndID)) {
        findLinkEntities(
          selectionBlock,
          (start, end) => {
            if (cursorMatchesSingleLinkRange(cursorStart, cursorEnd, start, end)) {
              cursorIsOnLink = true;
            }
          },
          state.getCurrentContent()
        );
      }
      // If the current cursor is no longer on a link
      // and the link details popup is open -> close the detail popup
      if (!cursorIsOnLink) dispatch({ type: 'CLOSE_DETAILS' });
    }
  }, [
    state.getSelection().getStartOffset(),
    state.getSelection().getEndOffset(),
    state.getSelection().getStartKey(),
    state.getSelection().getEndKey()
  ]);

  ////////////////////////////////////
  ///     Close the Link Editor    ///
  ////////////////////////////////////
  /**
   * [closeLinkEditor description]
   * @param  {[type]} e [description]
   * @return {[type]}   [description]
   */
  function closeLinkEditor(e) {
    console.log('[CLOSE_EDITOR]');
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
    const newState = EditorState.push(state, contentState, 'change-inline-style');
    setState(newState);
    dispatch({ type: 'CLOSE_EDITOR' });
  }

  // We need this effect because when the editor is closed, we want to refocus the editor
  React.useEffect(() => {
    if (linkState.showEditor == false) {
      console.log('[REFOCUS_EDITOR]');
      onEditorFocus();
    }
  }, [linkState.showEditor]);
  ////////////////////////////////////
  ///       Focus the editor       ///
  ////////////////////////////////////
  const editorRef = React.useRef(null);
  const [editorFocus, setEditorFocus] = React.useState(false);
  /* FIX: Need refactor? */
  const onEditorFocus = () => {
    console.log('[ON_EDITOR_FOCUS]: focus the editor');
    setEditorFocus(true);
  };
  const onEditorBlur = () => {
    if (linkState.showDetails) return;
    console.log('[ON_EDITOR_BLUR]');
    setEditorFocus(false);
  };
  React.useEffect(() => {
    if (editorRef.current && editorFocus === true) {
      console.log('[EDITOR_FOCUS_EFFECT]');
      editorRef.current.focus();
    }
  }, [setEditorFocus, editorFocus]);
  ///////////////////////////////////
  ///    Focus the link editor    ///
  ///////////////////////////////////
  const linkEditorRef = React.useRef(null);
  React.useEffect(() => {
    console.log('[LINK_EDITOR_FOCUS_EFFECT]');
    if (linkState.showEditor && linkEditorRef.current) {
      linkEditorRef.current.focus();
    }
  }, [linkState.showEditor]);
  ////////////////////////////////////
  ///       Update the Link        ///
  ////////////////////////////////////
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
        anchorKey: linkSelection.anchorKey,
        anchorOffset: linkSelection.anchorOffset,
        focusKey: linkSelection.focusKey,
        focusOffset: linkSelection.focusOffset
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

    setState(EditorState.push(state, newContentState, 'insert-characters'));
    dispatch({ type: 'UPDATE_LINK' });
  }

  return (
    <div className="RichEditor-root">
      <BlockStyleControls editorState={state} onToggle={toggleBlockType} />
      <InlineStyleControls editorState={state} onToggle={toggleInlineStyle} />
      <LinkInlineControl
        disabled={disableLinkControl}
        active={linkState.showDetails || linkState.showEditor}
        editorState={state}
        onClick={openEditor}
        control={{ type: 'EDITOR_CONTROL' }}
      />

      <div className="RichEditor-editor">
        <Editor
          ref={editorRef}
          onBlur={onEditorBlur}
          onFocus={onEditorFocus}
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
        linkEditorRef={linkEditorRef}
        linkState={linkState}
        shouldShow={linkState.showEditor}
        updateLink={updateLink}
      />
      <button onClick={logMarkdown}>Log Markdown</button>
    </div>
  );
}

function getSelectionIndices(editorState) {
  return {
    cursorStart: editorState.getSelection().getStartOffset(),
    cursorEnd: editorState.getSelection().getEndOffset()
  };
}

function getSelectionBlockProps(editorState) {
  let selectionBlockID = editorState.getSelection().getStartKey();
  return {
    selectionBlockID,
    selectionBlockEndID: editorState.getSelection().getEndKey(),
    selectionBlock: editorState.getCurrentContent().getBlockForKey(selectionBlockID)
  };
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
  // console.log(selection);
  // console.log(selection.type);
  return selection.getRangeAt(0);
  // console.log(selection);
  // console.log(selection.getRangeAt(0));
  // console.log(selection.getRangeAt(0).startContainer);
  // var node = selection.getRangeAt(0).startContainer;

  // while (node != null) {
  //   if (
  //     node.getAttribute &&
  //     node.getAttribute('data-offset-key') &&
  //     node.getAttribute('data-offset-key').includes(`${dataBlockKey}`)
  //   ) {
  //     return node;
  //   }
  //   node = node.parentNode;
  // }
  // return null;
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
  // console.log(selection);
  // console.log(selection.type);
  // return selection.getRangeAt(0);
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
