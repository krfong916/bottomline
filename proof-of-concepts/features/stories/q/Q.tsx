import * as React from 'react';
import {
  Editor,
  EditorState,
  CompositeDecorator,
  RichUtils,
  DraftHandleValue,
  convertToRaw
} from 'draft-js';
import { Input, Tooltip, Box } from '@chakra-ui/react';
import { TagEditor } from '../tags/TagEditor/TagEditor';
import { AddIcon } from '@chakra-ui/icons';
import { AiOutlineExclamationCircle } from 'react-icons/ai';
import {
  BlockStyleControls,
  InlineStyleControls,
  styleMap,
  blockStyleFn,
  bottomlineEditorKeyBindingFn
} from './Editor';
import { useLinkEditor } from './components/link/Link';
import { findLinkEntities, cursorIsOnSingleBlock } from './components/link/utils';
import {
  RegularLink,
  LinkEditor,
  LinkDetails,
  LinkInlineControl
} from './components/link/BottomlineLink';
import { linkStateReducer } from './components/link/reducer';
import './components/link/link.scss';
import './Q.scss';
import {
  Form,
  Field,
  useField,
  useFormState,
  FieldInputProps
} from 'react-final-form';
import createDecorator from 'final-form-focus';
import { Review } from './components/reviewSteps/Review';
import { Question, QuestionError } from './types';

const Error = ({ name }: { name: string }) => {
  const { meta } = useField(name, {
    subscription: { error: true, submitFailed: true, valid: true }
  });
  const { error, submitFailed, valid } = meta;
  // console.log('[ERROR_COMPONENT]', meta);
  // console.log('[ERROR_COMPONENT]', error);
  return submitFailed && !valid && error ? (
    Array.isArray(error) ? (
      <GroupError errors={error} />
    ) : (
      <SingleError error={error} />
    )
  ) : null;
};

const GroupError = ({ errors }: { errors: string[] }) => {
  return (
    <div className="field-error-group">
      {errors.map((error) => (
        <span className="field-error__group-message">
          <AiOutlineExclamationCircle className="field-error__icon" />
          {error}
        </span>
      ))}
    </div>
  );
};

const SingleError = ({ error }: { error: string }) => (
  <div className="field-error">
    <AiOutlineExclamationCircle className="field-error__icon" />
    <span className="field-error__message">{error}</span>
  </div>
);

export default function Q() {
  const decorator = new CompositeDecorator([
    {
      strategy: findLinkEntities,
      component: RegularLink
    }
  ]);
  // Draft-js editor state
  const [state, setState] = React.useState<EditorState>(
    EditorState.createEmpty(decorator)
  );

  const {
    showDetails: linkShowDetails,
    showEditor: linkShowEditor,
    url,
    text,
    coords,
    openLinkEditor,
    removeLink,
    closeLinkEditor,
    updateLink,
    // getLinkProps,
    toggleLinkEditor
  } = useLinkEditor({ editorState: state, editorSetState: setState });

  // for transition animation
  const [inProp, setInProp] = React.useState(false);

  const onChange = (
    editorState: EditorState,
    rffProps: FieldInputProps<any, HTMLElement>
  ) => {
    setState(editorState);
    rffProps.onChange(editorState.getCurrentContent().getPlainText('\u0001'));
  };

  const handleKeyCommand = (command: string): DraftHandleValue => {
    let newState;
    switch (command) {
      case 'bold':
        toggleInlineStyle('BOLD');
        break;
      case 'link':
        toggleLinkEditor();
        break;
      case 'italic':
        toggleInlineStyle('ITALIC');
        break;
      case 'blockquote':
        toggleBlockType('blockquote');
        break;
      case 'bulleted-list':
        toggleBlockType('unordered-list-item');
        break;
      case 'numbered-list':
        toggleBlockType('ordered-list-item');
        break;
      case 'newline':
        newState = RichUtils.insertSoftNewline(state);
        setState(newState);
        break;
      case 'backspace':
        let startKey = state.getSelection().getStartKey();
        let selectedBlock = state.getCurrentContent().getBlockForKey(startKey);
        const blockType = selectedBlock.getType();
        const text = selectedBlock.getText();
        if (
          text.length === 0 &&
          (blockType === 'blockquote' ||
            blockType === 'bulleted-list' ||
            blockType === 'numbered-list')
        ) {
          toggleBlockType(blockType);
          break;
        } else {
          return 'not-handled';
        }
        break;
      default:
        return 'not-handled';
    }

    return 'handled';
  };
  const toggleBlockType = (blockType: string) => {
    console.log('blockType:', blockType);
    setState(RichUtils.toggleBlockType(state, blockType));
  };
  const toggleInlineStyle = (inlineStyle: string) => {
    console.log('inlineStyle:', inlineStyle);
    setState(RichUtils.toggleInlineStyle(state, inlineStyle));
  };
  const toggleLink = () => {
    console.log('toggle link');
    setState(RichUtils.toggleLink(state, state.getSelection(), ''));
  };
  // State for enabling/disabling the formatting bar link button
  const [disableLinkControl, setDisableLinkControl] = React.useState(false);
  // State for signaling when the editor has/doesn't have focus
  const [editorFocus, setEditorFocus] = React.useState(false);
  // Ref for focusing the editor
  const editorRef = React.useRef<HTMLDivElement>(null);
  const editorErrorRef = React.useRef<boolean>(false);

  // We need this effect because when the link-editor is closed, we want to refocus the editor
  React.useEffect(() => {
    if (linkShowEditor === false) {
      console.log('[REFOCUS_EDITOR]');
      onEditorFocus();
    }
  }, [linkShowEditor]);

  /**
   * Enables/disables the formatting bar link button based on user cursor position in editor
   * Disabled: user's cursor range starts and ends on different lines ("blocks" in draft-js terms)
   * @dependency state.getSelection().getStartOffset() - the anchor index of the user's cursor
   * @dependency state.getSelection().getEndOffset()  - the focus index of the user's cursor
   */
  React.useEffect(() => {
    const selectionBlockID = state.getSelection().getStartKey();
    const selectionBlockEndID = state.getSelection().getEndKey();
    if (cursorIsOnSingleBlock(selectionBlockID, selectionBlockEndID) === false) {
      setDisableLinkControl(true);
    } else {
      setDisableLinkControl(false);
    }
  }, [state.getSelection().getStartOffset(), state.getSelection().getEndOffset()]);

  /* FIX: Need refactor? */
  const onEditorFocus = () => {
    setEditorFocus(true);
  };

  const handleOpen = () => {
    // if the editor isnt focused and has content
    // the link control button does nothing - move to be an effect
    if (editorFocus === false && state.getCurrentContent().hasText()) {
      console.log(
        '[OPEN_EDITOR: EDITOR_CONTROL]: editor has text and is not currently focused:',
        editorFocus
      );
      return;
    } else if (
      editorFocus === false &&
      state.getCurrentContent().hasText() === false
    ) {
      console.log(
        '[OPEN_EDITOR: EDITOR_CONTROL]: editor has no text and is not currently focused'
      );
      onEditorFocus();
    }
  };

  const onSubmit = (...args) => {
    console.log('[ON_SUBMIT] ', args);
  };

  const minLength = (field: string, requiredLen: number) =>
    field.length >= requiredLen;
  const exceeds = (field: string, requiredLen: number) =>
    minLength(field, requiredLen);

  const validate = (values: Question) => {
    const { title, body, tags } = values;
    const errors: QuestionError = {};
    if (!title) {
      errors.title = 'Title is missing.';
    } else if (!exceeds(title, 15)) {
      errors.title = `Title must be at least 15 characters. You entered ${title.length} characters`;
    }

    if (!body) {
      errors.body = 'Body is missing.';
    } else if (!exceeds(body, 30)) {
      errors.body = `Body must be at least 30 characters long, you entered ${body.length} characters.`;
    }
    console.log('validate tags', tags);
    if (tags && tags.length > 0) {
      let tagsWithManyChars = tags.filter((tag) => exceeds(tag.name, 35));
      let tagErrs = tagsWithManyChars.map(
        (tag) =>
          `The tag '${tag.name}' is too long. The maximum length is 35 characters.`
      );
      if (tagErrs.length > 0) errors.tags = tagErrs;
    } else {
      errors.tags = 'Please enter at least one tag';
    }
    console.log('errors', errors);
    return errors;
  };

  const focusOnErrors = createDecorator();

  return (
    <Form
      onSubmit={onSubmit}
      // validateOnBlur={true}
      validateOnChange={true}
      validate={validate}
      decorators={[focusOnErrors]}
    >
      {({ submitting, submitFailed, handleSubmit, hasValidationErrors, errors }) => {
        return (
          <div className="question-container">
            <Review
              transitionIn={inProp}
              className="question-review"
              displayErrors={submitFailed}
            />
            <form onSubmit={handleSubmit} className="question-ask">
              <div className="ask-question">
                <section className="ask-question__section">
                  <div className="ask-question__section-header">
                    <div className="ask-question__section-heading">
                      <h2 className="ask-question__section-title">Title</h2>
                      <p className="ask-question__section-info">
                        Be specific and try to imagine that you’re asking another
                        person your question.
                      </p>
                    </div>
                  </div>
                  <div className="ask-question__section-input">
                    <Field name="title">
                      {(props) => (
                        <Input
                          {...props.input}
                          className={
                            props.meta.submitFailed && props.meta.error
                              ? 'ask-question__title-input-error'
                              : 'ask-question__title-input'
                          }
                          type="text"
                          placeholder="For example: What is Mutual Aid?"
                        />
                      )}
                    </Field>
                  </div>
                  <Error name="title" />
                </section>

                <section className="ask-question__section">
                  <div className="ask-question__section-header">
                    <div className="ask-question__section-heading">
                      <h2 className="ask-question__section-title">Body</h2>
                      <p className="ask-question__section-info">
                        Include all context and information one would need to answer
                        your question.
                      </p>
                    </div>
                  </div>
                  <div className="ask-question__section-input">
                    <div className="editor">
                      <div className="editor__formatting-bar">
                        <InlineStyleControls
                          editorState={state}
                          onToggle={toggleInlineStyle}
                        />
                        <LinkInlineControl
                          disabled={disableLinkControl}
                          active={linkShowDetails || linkShowEditor}
                          editorState={state}
                          onToggle={toggleLinkEditor}
                          control="EDITOR_CONTROL"
                        />
                        <BlockStyleControls
                          editorState={state}
                          onToggle={toggleBlockType}
                        />
                      </div>

                      <Field name="body">
                        {(props) => (
                          <div
                            className={
                              props.meta.submitFailed && props.meta.error
                                ? 'RichEditor-editor-error'
                                : 'RichEditor-editor'
                            }
                            ref={editorRef}
                            tabIndex={-1}
                          >
                            <Editor
                              handleKeyCommand={handleKeyCommand}
                              keyBindingFn={bottomlineEditorKeyBindingFn}
                              onFocus={onEditorFocus}
                              customStyleMap={styleMap}
                              editorState={state}
                              onChange={(editorState) =>
                                onChange(editorState, props.input)
                              }
                              blockStyleFn={blockStyleFn}
                            />
                          </div>
                        )}
                      </Field>
                      <LinkDetails
                        coords={coords}
                        url={url}
                        shouldShow={linkShowDetails}
                        removeLink={removeLink}
                        onDetailsChange={openLinkEditor}
                        control={'LINK_DETAILS'}
                      />
                      <LinkEditor
                        coords={coords}
                        url={url}
                        text={text}
                        onBlur={closeLinkEditor}
                        shouldShow={linkShowEditor}
                        updateLink={updateLink}
                        // ref={linkEditorRef}
                      />
                    </div>
                  </div>
                  <Error name="body" />
                </section>

                <section className="ask-question__section">
                  <div className="ask-question__section-header">
                    <div className="ask-question__section-heading">
                      <div className="tags-header">
                        <h2 className="ask-question__section-title">Tags</h2>
                      </div>
                    </div>
                  </div>
                  <div className="ask-question__section-input">
                    <Field name="tags">
                      {(props) => (
                        <TagEditor
                          className={
                            props.meta.submitFailed && props.meta.error
                              ? 'tag-error'
                              : ''
                          }
                          {...props.input}
                        />
                      )}
                    </Field>
                  </div>
                  <Error name="tags" />
                </section>
                <section className="ask-question__section">
                  <div className="post-question">
                    <button
                      className="post-question__button"
                      type="submit"
                      disabled={submitting}
                    >
                      Post your question
                    </button>
                  </div>
                </section>
              </div>
            </form>
          </div>
        );
      }}
    </Form>
  );
}
