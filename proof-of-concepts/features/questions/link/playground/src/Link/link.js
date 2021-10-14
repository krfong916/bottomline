import React from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@chakra-ui/react';
import { RichUtils } from 'draft-js';

// we use the mousedown event to prevent the focus from moving the cursor
// from the selected text range to this format control
export function LinkInlineControl({
  active,
  editorState,
  onClick,
  control,
  disabled
}) {
  console.log('disabled:', disabled);
  return (
    <div
      aria-disabled={disabled}
      className="RichEditor-controls"
      onMouseDown={(e) => {
        !disabled && e.preventDefault();
      }}
      onClick={(e) => {
        !disabled && e.preventDefault();
        onClick(e, control);
      }}
    >
      <span>Link</span>
    </div>
  );
}

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

export function LinkDetails({
  linkState,
  shouldShow,
  onDetailsChange,
  removeLink,
  control
}) {
  if (!shouldShow) return null;
  const position = {
    top: linkState.coords.bottom + 16,
    left: linkState.coords.left - 20,
    position: 'absolute'
  };

  return (
    <div unselectable="on" className="link-details" style={position}>
      <span className="link-details__url">{linkState.url}</span>
      <span className="link-details__spacer">-</span>
      <button
        unselectable="on"
        className="link-details__button"
        onClick={(e) => onDetailsChange(e, control)}
      >
        Change
      </button>
      <span className="link-details__spacer">|</span>
      <button className="link-details__button" onClick={(e) => removeLink(e)}>
        Remove
      </button>
    </div>
  );
}

function urlIsValid(url) {
  const validURL = /^(?:(?:(?:https?|ftp):)?\/\/)?(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i;
  const urlExp = new RegExp(validURL);
  return urlExp.test(url);
}

export function LinkEditor({
  onBlur,
  linkEditorRef,
  linkState,
  shouldShow,
  updateLink
}) {
  if (!shouldShow) return null;

  const position = {
    top: linkState.coords.bottom + 16,
    left: linkState.coords.left - 20,
    position: 'absolute'
  };

  // add validation for a correct url and show an error message
  // use chakra design here
  const { url, text } = linkState;
  const [state, setState] = React.useState({ url, text });
  const [error, setError] = React.useState(false);
  // const [focusFromDraftToEditor, setFocusFromDraftToEditor] = React.useState(true);
  const urlInputRef = React.useRef(null);
  React.useEffect(() => {
    if (error) {
      urlInputRef.current.focus();
    }
  }, [error, urlInputRef.current]);

  const handleKeyDown = (e) => {};

  const handleOnChange = ({ target }) => {
    setState((state) => ({ ...state, [target.name]: target.value }));

    if (error) {
      const res = urlIsValid(state.url);
      if (res) {
        setError(false);
      }
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (urlIsValid(state.url)) {
      updateLink(state);
    } else {
      setError(true);
    }
  };

  const handleBlur = (e) => {
    // the behavior that we're trying to capture here is
    // the link editor should call the callback if the user leaves focus from the component
    if (!e.currentTarget.contains(e.relatedTarget)) {
      console.log('handle blur');
      onBlur(e);
    }
  };

  const editorInputButtonClassname = error
    ? 'link-editor__button--disabled'
    : 'link-editor__button';

  return (
    <div onBlur={handleBlur} style={position}>
      <form onSubmit={handleUpdate} className="link-editor">
        <div className="link-editor__field">
          <label htmlFor="text" className="link-editor__label">
            Text:
          </label>
          <input
            className="link-editor__input"
            ref={linkEditorRef}
            type="text"
            value={state.text}
            name="text"
            onChange={handleOnChange}
            placeholder="Title of link (optional)"
            autoComplete="off"
          />
        </div>
        <div className="link-editor__field">
          <label htmlFor="url" className="link-editor__label">
            Link:
          </label>
          <input
            className="link-editor__input"
            ref={urlInputRef}
            type="text"
            value={state.url}
            name="url"
            onChange={handleOnChange}
            placeholder="Paste or type a link"
            autoComplete="off"
          />
        </div>
        <div className="link-editor__actions">
          {error ? (
            <span className="link-editor__error">The url doesn't look right</span>
          ) : null}
          <button
            disabled={error}
            type="submit"
            className={editorInputButtonClassname}
          >
            Apply
          </button>
        </div>
      </form>
    </div>
  );
}

// we want to reveal a popover below or above the link element
// we want to ensure the popover is entirely within the viewport of the user's screen
// if 10% of the popover is off the screen, then that will result in a bad user exp.

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
