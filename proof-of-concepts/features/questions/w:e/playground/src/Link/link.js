import React from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@chakra-ui/react';
import { RichUtils } from 'draft-js';

export function findLinkEntities(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();
    const test =
      entityKey !== null && contentState.getEntity(entityKey).getType('LINK');

    return test;
  }, callback);
}

export function RegularLink(props) {
  const { url } = props.contentState.getEntity(props.entityKey).getData();

  return (
    <a href={url} className="bottomline-link">
      {props.children}
    </a>
  );
}

export function LinkStyleControl(props) {
  const promptForLink = (e) => {
    e.preventDefault();
    const { editorState } = props;
    let selectionState = editorState.getSelection();
    if (!selectionState.isCollapsed()) {
      let anchorKey = selectionState.getAnchorKey();
      let currentContent = editorState.getCurrentContent();
      let currentContentBlock = currentContent.getBlockForKey(anchorKey);
      let start = selectionState.getStartOffset();
      let end = selectionState.getEndOffset();
      let selectedText = currentContentBlock.getText().slice(start, end);
    }
  };

  return (
    <div className="RichEditor-controls">
      <span
        onMouseDown={promptForLink}
        className="RichEditor-styleButton"
        key="Link"
        label="Link"
      >
        Link
      </span>
    </div>
  );
}

export function LinkDetails({ linkModifier, shouldShow, editLink, removeLink }) {
  if (!shouldShow) return null;

  return (
    <div unselectable="on" className="unselectable">
      <span>{linkModifier.url}</span>
      <button unselectable="on" className="unselectable" onClick={(e) => editLink(e)}>
        Change
      </button>
      <button onClick={(e) => removeLink(e)}>Remove</button>
    </div>
  );
}

function urlIsValid(url) {
  const validURL = /^(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i;
  const urlExp = new RegExp(validURL);
  return urlExp.test(url);
}

export function LinkEditor({ linkModifier, shouldShow, updateLink }) {
  if (!shouldShow) return null;
  // add validation for a correct url and show an error message
  // use chakra design here
  const { url, text } = linkModifier;
  const [state, setState] = React.useState({
    url,
    text
  });

  const [error, setError] = React.useState(false);

  const handleOnChange = ({ target }) => {
    console.log(target.value);
    console.log(error);
    setState((state) => ({ ...state, [target.name]: target.value }));

    if (error) {
      const res = urlIsValid(state.url);
      console.log(res);
      console.log(state);
      if (res) {
        setError(false);
      }
    }
  };

  const handleUpdate = () => {
    if (urlIsValid(state.url)) {
      updateLink(state);
      console.log('updateLink');
    } else {
      setError(true);
    }
  };

  return (
    <div>
      <input type="text" value={state.text} name="text" onChange={handleOnChange} />
      <input type="text" value={state.url} name="url" onChange={handleOnChange} />
      <button role="button" disabled={error} onClick={handleUpdate}>
        Apply
      </button>
      {error ? <span>The url doesn't look right</span> : null}
    </div>
  );
}

// use for parsing markdown string and inserting link elements
// const postText = contentBlock.getText();
// const validURL = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
// const urlExp = new RegExp(validURL);

// let plainTextLinks = Array.from(postText.matchAll(urlExp));
// if (plainTextLinks.length !== 0) {
//   plainTextLinks.forEach((link, i) => {
//     const contentStateWithEntity = contentState.createEntity('LINK', 'MUTABLE', {url: link[0]})
//     const linkKey = contentStateWithEntity.getLastCreatedEntityKey()
//     const contentStateWithLink = Modifier.applyEntity(contentStateWithEntity, link, linkKey);
//     EditorState.set(editorState, {currentContent: contentStateWithLink})
//   });
// }
