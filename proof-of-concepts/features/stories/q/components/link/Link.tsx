import React from 'react';
import {
  LinkState,
  LinkAction,
  LinkProps,
  LinkEditorStateChangeTypes,
  LinkActionAndChanges
} from './types';
import { useControlledReducer } from '../../../utils';
import {
  cursorMatchesSingleLinkRange,
  cursorIsOnSingleBlock,
  hasHTTPS,
  cursorIsSelectingOriginalText,
  getSelectionIndices,
  getSelectionBlockProps,
  initialLinkState,
  findLinkEntities
} from './utils';
import { linkStateReducer } from './reducer';
import { Modifier, SelectionState, RichUtils, EditorState } from 'draft-js';

export function useLinkEditor(props: LinkProps) {
  const [state, controlledDispatch] = useControlledReducer<
    (state: LinkState, action: LinkAction) => LinkState,
    LinkState,
    LinkProps,
    LinkEditorStateChangeTypes,
    LinkActionAndChanges
  >(linkStateReducer, initialLinkState, props);

  const { editorState, editorSetState } = props;
  const {
    linkSelection,
    textSelection,
    showDetails,
    showEditor,
    url,
    text,
    coords
  } = state;

  // Ref for trapping focus in the editor when the user opens the editor
  const linkEditorRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    console.log('[LINK_EDITOR_FOCUS_EFFECT]');
    if (showEditor && linkEditorRef.current) {
      linkEditorRef.current.focus();
    }
  }, [showEditor]);

  /**
   * ********************************
   *
   *    Detects if the user's cursor is still on the ~Text~ DOM Node that they wanted to convert into a link
   *
   * ********************************
   *
   * Side-effects:
   * - Transforms Text to a Link
   * - Closes Editor For TEXT
   * - Closes the editor if the text no longer has selection
   */
  React.useEffect(() => {
    const userSelection = editorState.getSelection();
    // check if the user's cursor has moved i.e. it is on a different piece of text
    if (
      showEditor &&
      textSelection &&
      !cursorIsSelectingOriginalText(state, textSelection, userSelection)
    ) {
      console.log('[CLOSE_EDITOR_FOR_TEXT EFFECT]');
      const contentState = Modifier.removeInlineStyle(
        editorState.getCurrentContent(),
        textSelection,
        'HIGHLIGHT_LINK'
      );
      const stateWithoutTextHighlight = EditorState.push(
        editorState,
        contentState,
        'change-inline-style'
      );
      const stateWithUserSelection = EditorState.forceSelection(
        stateWithoutTextHighlight,
        userSelection
      );
      editorSetState(stateWithUserSelection);
      controlledDispatch({ type: LinkEditorStateChangeTypes.CLOSE_EDITOR });
    }
  }, [
    controlledDispatch,
    editorState,
    editorSetState,
    showEditor,
    state,
    textSelection
  ]);

  /**
   * ***************************************
   *
   *     Show or Close Link Details Popup
   *
   * ***************************************
   *
   * - Show Details for Link Entities
   * - Detects if the user's cursor is still on the ~Link~ Entity
   * - Closes Detail Popup for links if the user is no longer selecting the link range
   */
  React.useEffect(() => {
    if (showEditor === false) {
      // move down under the findLinkEntities, it'll be part of the cb fn to run
      const { cursorStart, cursorEnd } = getSelectionIndices(editorState);
      const {
        selectionBlock,
        selectionBlockID,
        selectionBlockEndID
      } = getSelectionBlockProps(editorState);
      let cursorIsOnLink = false;
      if (cursorIsOnSingleBlock(selectionBlockID, selectionBlockEndID)) {
        findLinkEntities(
          selectionBlock,
          (start: number, end: number) => {
            if (cursorMatchesSingleLinkRange(cursorStart, cursorEnd, start, end)) {
              controlledDispatch({
                type: LinkEditorStateChangeTypes.OPEN_DETAILS,
                editorState,
                linkRange: [start, end]
              });
              cursorIsOnLink = true;
            }
          },
          editorState.getCurrentContent()
        );
      }
      // If the current cursor is no longer on a link
      // and the link details popup is open -> close the detail popup
      if (cursorIsOnLink === false)
        controlledDispatch({ type: LinkEditorStateChangeTypes.CLOSE_DETAILS });
    }
  }, [controlledDispatch, editorState, showEditor]);

  function closeLinkEditor() {
    console.log('[CLOSE_EDITOR]');
    let contentState = editorState.getCurrentContent();
    if (linkSelection) {
      contentState = Modifier.removeInlineStyle(
        editorState.getCurrentContent(),
        linkSelection,
        'HIGHLIGHT_LINK'
      );
    } else if (textSelection) {
      contentState = Modifier.removeInlineStyle(
        editorState.getCurrentContent(),
        textSelection,
        'HIGHLIGHT_LINK'
      );
    }
    const newState = EditorState.push(
      editorState,
      contentState,
      'change-inline-style'
    );
    editorSetState(newState);
    controlledDispatch({ type: LinkEditorStateChangeTypes.CLOSE_EDITOR });
  }

  /**
   * Explicitly remove the url from an existing link
   * without the url, the link becomes a piece of text
   * @param  {[type]} e [description]
   * @return {[type]}   [description]
   */
  function removeLink() {
    const { cursorStart, cursorEnd } = getSelectionIndices(editorState);
    const { selectionBlock, selectionBlockID } = getSelectionBlockProps(editorState);
    // capture the original selection state
    // after removing the link
    // place the selectionstate back on the link
    findLinkEntities(
      selectionBlock,
      (start: number, end: number) => {
        if (cursorMatchesSingleLinkRange(cursorStart, cursorEnd, start, end)) {
          let selectionState = SelectionState.createEmpty('link-to-remove');
          let updatedSelection = selectionState.merge({
            anchorKey: selectionBlockID,
            anchorOffset: start,
            focusKey: selectionBlockID,
            focusOffset: end
          });

          const contentState = Modifier.removeInlineStyle(
            editorState.getCurrentContent(),
            updatedSelection,
            'HIGHLIGHT_LINK'
          );

          const newState = EditorState.push(
            editorState,
            contentState,
            'change-inline-style'
          );

          controlledDispatch({ type: LinkEditorStateChangeTypes.REMOVE_LINK });
          editorSetState(RichUtils.toggleLink(newState, updatedSelection, null));
        }
      },
      editorState.getCurrentContent()
    );
  }

  /**
   * **********************
   *
   *   Update the Link
   *
   * **********************
   *
   * Update the existing link meaning:
   * - change the link's URL or,
   * - change the link's text
   */
  function updateLink({ url, text }: any) {
    console.log('[UPDATE_LINK]');
    if (!hasHTTPS(url)) {
      url = 'https://'.concat(url);
    }
    if (text === '') {
      text = url;
    }
    let contentState = editorState.getCurrentContent();
    let selectionState = SelectionState.createEmpty('link-to-update');
    let updatedSelection = editorState.getSelection();
    if (linkSelection) {
      updatedSelection = selectionState.merge({
        anchorKey: linkSelection.getAnchorKey(),
        anchorOffset: linkSelection.getAnchorOffset(),
        focusKey: linkSelection.getFocusKey(),
        focusOffset: linkSelection.getFocusOffset()
      });
    } else if (textSelection) {
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
      undefined,
      entityKey
    );

    // const blockType = editorState
    //   .getCurrentContent()
    //   .getBlockForKey(updatedSelection.getStartKey())
    //   .getType();

    editorSetState(
      EditorState.push(editorState, newContentState, 'insert-characters')
    );
    controlledDispatch({ type: LinkEditorStateChangeTypes.UPDATE_LINK });
  }

  /**
   * **********************
   *
   *   Open the Link editor
   *
   * **********************
   *
   */
  const openLinkEditor = React.useCallback(
    (control: LinkControl) => {
      switch (control) {
        case 'LINK_DETAILS':
          const { cursorStart, cursorEnd } = getSelectionIndices(editorState);
          const { selectionBlock } = getSelectionBlockProps(editorState);
          const currentLinkSelection = editorState.getSelection();
          findLinkEntities(
            selectionBlock,
            (start: number, end: number) => {
              if (cursorMatchesSingleLinkRange(cursorStart, cursorEnd, start, end)) {
                console.log('[APPLY_LINK_HIGHLIGHT EFFECT]');
                let selectionState = SelectionState.createEmpty('foo');
                let updatedSelection = selectionState.merge({
                  anchorKey: currentLinkSelection.getAnchorKey(),
                  anchorOffset: start,
                  focusKey: currentLinkSelection.getFocusKey(),
                  focusOffset: end
                });
                const editorWithLinkSelection = EditorState.forceSelection(
                  editorState,
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

                editorSetState(newState);
                controlledDispatch({
                  type: LinkEditorStateChangeTypes.OPEN_EDITOR_BY_LINK_DETAILS,
                  linkRange: [start, end],
                  editorState
                });
              }
            },
            editorState.getCurrentContent()
          );
          break;
        case 'EDITOR_CONTROL':
          console.log('[OPEN_EDITOR: EDITOR_CONTROL]');
          // if the link-editor is currently open
          // and the user is continually clicking the link control button
          // leave the link-editor open and keep the link-editor focused
          if (showEditor) {
            linkEditorRef!.current!.focus();
            return;
          }
          const cursorIsOnLink = showDetails;
          if (cursorIsOnLink) {
            const { cursorStart, cursorEnd } = getSelectionIndices(editorState);
            const { selectionBlock } = getSelectionBlockProps(editorState);

            findLinkEntities(
              selectionBlock,
              (start, end) => {
                if (
                  cursorMatchesSingleLinkRange(cursorStart, cursorEnd, start, end)
                ) {
                  controlledDispatch({
                    type:
                      LinkEditorStateChangeTypes.OPEN_EDITOR_BY_EDITOR_CONTROL_FOR_LINK,
                    linkRange: [start, end],
                    editorState
                  });
                }
              },
              editorState.getCurrentContent()
            );
            break;
          } else {
            // cursor is on text
            const { cursorStart, cursorEnd } = getSelectionIndices(editorState);
            const hasText = editorState.getCurrentContent().hasText();
            if (hasText) {
              const currentTextSelection = editorState.getSelection();
              const editorStateWithTextSelection = EditorState.forceSelection(
                editorState,
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
                'change-inline-style'
              );
              editorSetState(newState);
            }
            controlledDispatch({
              type: LinkEditorStateChangeTypes.OPEN_EDITOR_BY_EDITOR_CONTROL_FOR_TEXT,
              textRange: [cursorStart, cursorEnd],
              editorState,
              hasText
            });
          }
          break;
        default:
          throw new TypeError('Unhandled control to open editor ');
      }
    },
    [controlledDispatch, editorState, editorSetState, showDetails, showEditor]
  );

  function getLinkProps() {
    return {
      ref: linkEditorRef
    };
  }

  return {
    // state
    linkSelection,
    textSelection,
    showDetails,
    showEditor,
    url,
    text,
    coords,
    // functions
    closeLinkEditor,
    removeLink,
    updateLink,
    openLinkEditor,
    getLinkProps
  };
}
