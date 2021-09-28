import React from 'react';
import {
  styleMap,
  getBlockStyle,
  StyleButton,
  BlockStyleControls,
  InlineStyleControls
} from './FormatControls';
import { sampleMarkdown } from './stub';
import { stateToMarkdown } from 'draft-js-export-markdown';
import { stateFromMarkdown } from 'draft-js-import-markdown';
import {
  Editor,
  EditorState,
  RichUtils,
  getDefaultKeyBinding,
  convertToRaw,
  CompositeDecorator,
  SelectionState,
  Modifier,
  CharacterMetadata,
  ContentState
} from 'draft-js';
import './App.css';
import {
  RegularLink,
  findLinkEntities,
  LinkStyleControl,
  LinkDetails,
  LinkEditor
} from './Link/link';

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

  const logMarkdown = () => {
    const convertMd = stateToMarkdown(state.getCurrentContent());
    console.log(convertMd);
  };

  const logContentObj = () => {
    const obj = convertToRaw(state.getCurrentContent());
    const str = JSON.stringify(convertToRaw(state.getCurrentContent()));
    console.log(str);
  };

  const handleKeyCommand = (command, editorState) => {
    console.log('key command: ', command);
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      onChange(newState);
      return true;
    }
    return false;
  };

  const mapKeyToEditorCommand = (e) => {
    if (e.keyCode === 9 /* TAB */) {
      console.log('TAB MOTHERFUCKER');
      const newEditorState = RichUtils.onTab(e, state, 4 /* maxDepth */);
      if (newEditorState !== state) {
        console.log('TAB MOTHERFUCKER TAB');
        onChange(newEditorState);
      }
      return;
    }
    return getDefaultKeyBinding(e);
  };

  const toggleBlockType = (blockType) => {
    onChange(RichUtils.toggleBlockType(state, blockType));
  };

  const toggleInlineStyle = (inlineStyle) => {
    onChange(RichUtils.toggleInlineStyle(state, inlineStyle));
  };

  const toggleLink = () => {
    onChange(RichUtils.toggleLink(state, editorState.getSelection()));
  };

  // If the user changes block type before entering any text, we can
  // either style the placeholder or hide it. Let's just hide it now.
  let className = 'RichEditor-editor';
  var contentState = state.getCurrentContent();
  if (!contentState.hasText()) {
    if (
      contentState
        .getBlockMap()
        .first()
        .getType() !== 'unstyled'
    ) {
      className += ' RichEditor-hidePlaceholder';
    }
  }

  const [linkModifier, setLinkModifier] = React.useState({
    showDetails: false,
    showEditor: false,
    url: '',
    text: '',
    coords: {}
  });
  const [linkSelection, setLinkSelection] = React.useState(null);

  React.useEffect(() => {
    console.log('runs');
    // should check if the link format control button wasnt clicked
    let newLinkModifierState = { ...linkModifier };
    let cursorIsOnLink = false;
    const cursorStart = state.getSelection().getStartOffset();
    const cursorEnd = state.getSelection().getEndOffset();
    const selectionBlockID = state.getSelection().getStartKey();
    const selectionBlockEndID = state.getSelection().getEndKey();
    const selectionBlock = state.getCurrentContent().getBlockForKey(selectionBlockID);

    // console.log('cursor start position: ', cursorStart);
    // console.log('length: ', selectionBlock.getLength());
    console.log('useEffect re-render');
    console.log('start key: ', state.getSelection().getStartKey());
    console.log('end key: ');
    console.log('anchor key: ', state.getSelection().getAnchorKey());
    console.log('focus key: ', state.getSelection().getFocusKey());
    console.log('anchor offset: ', state.getSelection().getAnchorOffset());
    console.log('focus offset: ', state.getSelection().getFocusOffset());

    // This conditional solves the following bug:
    // when the content block starts with a link entity, and the entire block is
    // highlighted via a double/triple click of the user's mouse --> the selection anchor
    // and focus is considered to be "collapsed" (both anchor and focus offset is equal to 0).
    // We call this behavior a bug because the user's selection range is over the
    // **entire block** - evident by the blue highlight, but the anchor and focus offset do
    // not reflect the highlighted range. According to Draft-JS, the anchor and focus offset
    // is equal to 0. This behavior will cause the linkDetails popover to be displayed when
    // the user does not intend it to be displayed.
    //
    // We need a way of differentiating between a user's selection on the entire block range
    // and a user's selection just on a link.
    // Without the conditional check below, we might show the link details popover when the
    // user does not intend the popover to be displayed.
    // For now, our solution is to check the anchor and focus's selection block keys
    // When the entire block is highlighted via double/triple click, the anchor and focus
    // selection keys will be different.
    // When the cursor selection is just on the link element, the anchor and focus selection
    // keys will be the same
    if (selectionBlockID === selectionBlockEndID) {
      selectionBlock.findEntityRanges(
        (character) => {
          const entityKey = character.getEntity();
          const foundlink =
            entityKey !== null &&
            state
              .getCurrentContent()
              .getEntity(entityKey)
              .getType('LINK');
          return foundlink;
        },
        (start, end) => {
          console.log('FIND ENTITY RANGE');
          console.log('cursorStart: ', cursorStart);
          console.log('cursorEnd: ', cursorEnd);
          console.log('start: ', start);
          console.log('end: ', end);

          if (
            cursorStart >= start &&
            cursorStart <= end &&
            cursorEnd >= start &&
            cursorEnd <= end
          ) {
            const linkElement = getSelectedLinkElement();
            if (linkElement) {
              // we want to reveal a popover below or above the link element
              // we want to ensure the popover is entirely within the viewport of the user's screen
              // if 10% of the popover is off the screen, then that will result in a bad user exp.
              const linkDimensions = linkElement.getBoundingClientRect();
              cursorIsOnLink = true;

              newLinkModifierState.coords.bottom = linkDimensions.bottom;
              newLinkModifierState.coords.height = linkDimensions.height;
              newLinkModifierState.coords.left = linkDimensions.left;
              newLinkModifierState.coords.right = linkDimensions.right;
              newLinkModifierState.coords.top = linkDimensions.top;
              newLinkModifierState.coords.width = linkDimensions.width;
              newLinkModifierState.coords.x = linkDimensions.x;
              newLinkModifierState.coords.y = linkDimensions.y;

              const linkKey = selectionBlock.getEntityAt(start);
              const linkInstance = state.getCurrentContent().getEntity(linkKey);
              let url = linkInstance.getData().url;
              newLinkModifierState.url = url;
              newLinkModifierState.text = selectionBlock.getText().slice(start, end);
              newLinkModifierState.showDetails = true;
              newLinkModifierState.showEditor = false;
            }
          }
        }
      );
    }

    if (
      !cursorIsOnLink &&
      (newLinkModifierState.showDetails || newLinkModifierState.showEditor)
    ) {
      if (linkSelection && linkModifier.showEditor == true) {
        let contentState = Modifier.removeInlineStyle(
          state.getCurrentContent(),
          linkSelection,
          'HIGHLIGHT_LINK'
        );

        const newState = EditorState.push(
          state,
          contentState,
          'change-inline-styles'
        );
        setState(newState);
      }
      newLinkModifierState.linkKey = '';
      newLinkModifierState.url = '';
      newLinkModifierState.text = '';
      newLinkModifierState.showDetails = false;
      newLinkModifierState.showEditor = false;
      setLinkModifier(newLinkModifierState);
    } else if (cursorIsOnLink) {
      setLinkModifier(newLinkModifierState);
    }
  }, [
    state.getSelection().getStartOffset(),
    state.getSelection().getStartKey(),
    state.getSelection().getEndOffset(),
    setLinkModifier
  ]);

  // This functions grabs the DOM node of the selected link
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
    // console.log(selection.rangeCount);
    if (selection.rangeCount == 0) return null;
    var node = selection.getRangeAt(0).startContainer;
    // console.log(node);
    do {
      if (node.getAttribute && node.getAttribute('class') == 'bottomline-link')
        return node;
      node = node.parentNode;
    } while (node != null);
    return null;
  };

  function editLink(e) {
    const cursorStart = state.getSelection().getStartOffset();
    const cursorEnd = state.getSelection().getEndOffset();
    const selectionBlockID = state.getSelection().getStartKey();
    const selectionBlock = state.getCurrentContent().getBlockForKey(selectionBlockID);
    let linkSelectionRange = null;

    selectionBlock.findEntityRanges(
      (character) => {
        const entityKey = character.getEntity();
        const foundlink =
          entityKey !== null &&
          state
            .getCurrentContent()
            .getEntity(entityKey)
            .getType('LINK');
        return foundlink;
      },
      (start, end) => {
        if (
          cursorStart >= start &&
          cursorStart <= end &&
          cursorEnd >= start &&
          cursorEnd <= end
        ) {
          let selectionState = state.getSelection();
          let updatedSelection = selectionState.merge({
            anchorKey: selectionBlockID,
            anchorOffset: start,
            focusKey: selectionBlockID,
            focusOffset: end
          });

          linkSelectionRange = updatedSelection;

          const editorStateWithNewSelection = EditorState.forceSelection(
            state,
            updatedSelection
          );
          const editorStateWithStyles = RichUtils.toggleInlineStyle(
            editorStateWithNewSelection,
            'HIGHLIGHT_LINK'
          );
          const editorStateWithStylesAndPreviousSelection = EditorState.forceSelection(
            editorStateWithStyles,
            selectionState
          );
          setState(editorStateWithStylesAndPreviousSelection);
        }
      }
    );
    let newLinkModifierState = { ...linkModifier };
    console.log('newLinkModifierState: ', newLinkModifierState);
    newLinkModifierState.showDetails = false;
    newLinkModifierState.showEditor = true;
    setLinkModifier(newLinkModifierState);
    if (linkSelectionRange) {
      setLinkSelection(linkSelectionRange);
    }
  }

  function removeLink(e) {
    const cursorStart = state.getSelection().getStartOffset();
    const cursorEnd = state.getSelection().getEndOffset();
    const selectionBlockID = state.getSelection().getStartKey();
    const selectionBlock = state.getCurrentContent().getBlockForKey(selectionBlockID);

    selectionBlock.findEntityRanges(
      (character) => {
        const entityKey = character.getEntity();
        const foundlink =
          entityKey !== null &&
          state
            .getCurrentContent()
            .getEntity(entityKey)
            .getType('LINK');
        return foundlink;
      },
      (start, end) => {
        if (
          cursorStart >= start &&
          cursorStart <= end &&
          cursorEnd >= start &&
          cursorEnd <= end
        ) {
          let selectionState = SelectionState.createEmpty('link-to-remove');
          let updatedSelection = selectionState.merge({
            anchorKey: selectionBlockID,
            anchorOffset: start,
            focusKey: selectionBlockID,
            focusOffset: end
          });
          setState(RichUtils.toggleLink(state, updatedSelection, null));
        }
      }
    );
  }

  function updateLink({ url, text }) {
    selectionBlock.findEntityRanges(
      (character) => {
        const entityKey = character.getEntity();
        const foundlink =
          entityKey !== null &&
          state
            .getCurrentContent()
            .getEntity(entityKey)
            .getType('LINK');
        return foundlink;
      },
      (start, end) => {
        if (
          cursorStart >= start &&
          cursorStart <= end &&
          cursorEnd >= start &&
          cursorEnd <= end
        ) {
          // let selectionState = SelectionState.createEmpty('link-to-remove');
          // let updatedSelection = selectionState.merge({
          //   anchorKey: selectionBlockID,
          //   anchorOffset: start,
          //   focusKey: selectionBlockID,
          //   focusOffset: end
          // });
          // setState(RichUtils.toggleLink(state, updatedSelection, null));
        }
      }
    );
  }

  return (
    <div className="RichEditor-root">
      <BlockStyleControls editorState={state} onToggle={toggleBlockType} />
      <InlineStyleControls editorState={state} onToggle={toggleInlineStyle} />
      <LinkStyleControl editorState={state} onToggle={toggleLink} />
      <div className={className}>
        <Editor
          blockStyleFn={getBlockStyle}
          customStyleMap={styleMap}
          editorState={state}
          handleKeyCommand={handleKeyCommand}
          keyBindingFn={mapKeyToEditorCommand}
          onChange={onChange}
          spellCheck={true}
        />
      </div>
      <LinkDetails
        linkModifier={linkModifier}
        shouldShow={linkModifier.showDetails}
        removeLink={removeLink}
        editLink={editLink}
      />
      <LinkEditor
        linkModifier={linkModifier}
        shouldShow={linkModifier.showEditor}
        updateLink={updateLink}
      />
      <button onClick={logMarkdown}>Log Markdown</button>
      <button onClick={logContentObj}>Log to Content Object</button>
    </div>
  );
}
