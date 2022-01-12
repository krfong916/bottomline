import React from 'react';
import { LinkOutlinedIcon } from '../../assets/Icons';
import { LinkCoordinates } from './types';
export interface LinkDetailsProps {
  shouldShow: boolean;
  onDetailsChange: (control: LinkControl) => void;
  removeLink: (e: React.SyntheticEvent) => void;
  control: LinkControl;
  coords: LinkCoordinates | undefined;
  url: string;
}

export function LinkDetails({
  shouldShow,
  onDetailsChange,
  removeLink,
  control,
  coords,
  url
}: LinkDetailsProps) {
  if (!shouldShow) return null;
  const position = {
    top: coords!.bottom + 16 + window.scrollY,
    left: coords!.left - 20,
    position: 'absolute'
  } as React.CSSProperties;

  return (
    <div unselectable="on" className="link-details" style={position}>
      <span className="link-details__url">{url}</span>
      <span className="link-details__spacer">-</span>
      <button
        unselectable="on"
        className="link-details__button"
        onClick={(e) => onDetailsChange(control)}
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

export interface LinkEditorProps {
  onBlur: (event: React.SyntheticEvent) => void;
  ref: React.RefObject<HTMLInputElement>;
  shouldShow: boolean;
  updateLink: (obj: any) => void;
  coords: LinkCoordinates | undefined;
  url: string;
  text: string;
}

export function LinkEditor({
  onBlur,
  // ref,
  shouldShow,
  updateLink,
  coords,
  url,
  text
}: LinkEditorProps) {
  if (!shouldShow) return null;

  const position = {
    top: coords!.bottom + 16 + window.scrollY,
    left: coords!.left - 20,
    position: 'absolute'
  } as React.CSSProperties;

  // Ref for trapping focus in the editor when the user opens the editor
  const linkEditorRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (shouldShow && linkEditorRef.current) {
      linkEditorRef.current.focus();
    }
  }, [shouldShow]);

  // add validation for a correct url and show an error message
  // use chakra design here
  const [state, setState] = React.useState({ url: '', text });
  const [error, setError] = React.useState(false);
  // const [focusFromDraftToEditor, setFocusFromDraftToEditor] = React.useState(true);
  const urlInputRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    if (error && urlInputRef.current) {
      urlInputRef.current.focus();
    }
  }, [error]);

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let name = event.currentTarget.name;
    let value = event.currentTarget.value;
    setState((state) => ({
      ...state,
      [name]: value
    }));

    if (error) {
      const res = urlIsValid(state.url);
      if (res) {
        setError(false);
      }
    }
  };

  const handleUpdate = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (urlIsValid(state.url)) {
      updateLink(state);
    } else {
      setError(true);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
    // the behavior that we're trying to capture here is
    // the link editor should call the callback if the user leaves focus from the component
    if (!e.currentTarget.contains(e.relatedTarget as HTMLElement)) {
      console.log('[BOTTOMLINE_LINK] handle blur');
      onBlur(e);
    }
  };

  const editorInputButtonClassname = error
    ? 'link-editor__button--disabled'
    : 'link-editor__button';

  return (
    <div onBlur={handleBlur} style={position}>
      <div className="link-editor">
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
            type="button"
            onClick={handleUpdate}
            className={editorInputButtonClassname}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
/**
 * Determines whether or not the url is valid, excluding the url-scheme
 * Regex test
 */
function urlIsValid(url: string): boolean {
  const validURL = /^(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i;
  const urlExp = new RegExp(validURL);
  return urlExp.test(url);
}

export type LinkControl = 'EDITOR_CONTROL' | 'LINK_DETAILS';

export interface LinkControlProps {
  editorState: EditorState;
  onToggle: (control: LinkControl) => void;
  control: LinkControl;
  active?: boolean;
  disabled?: boolean;
}

export function LinkInlineControl(props: LinkControlProps) {
  const onToggle = (e: React.SyntheticEvent) => {
    e.preventDefault();
    props.onToggle(props.control);
  };
  const ariaLabel = 'Insert Link';
  const key = 'link-inline-control' + ariaLabel;
  let className = 'format-option';
  if (props.active) {
    className += ' format-option-active';
  }

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      key={key}
      className={className}
      onMouseDown={onToggle}
    >
      <LinkOutlinedIcon />
    </button>
  );
}

export interface RegularLinkProps {
  contentState: ContentState;
  children: React.ReactChildren;
  entityKey: string;
}

export function RegularLink(props: RegularLinkProps) {
  const { url } = props.contentState.getEntity(props.entityKey).getData();

  return (
    <a href={url} className="bottomline-link">
      {props.children}
    </a>
  );
}
