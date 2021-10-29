import React from 'react';
import { Tag, TagIcon, TagCloseButton, TagProps } from './Tag';
import { GoQuestion } from 'react-icons/go';
import classNames from 'classnames';
import './TagUseCase.scss';
import './TagEditor.scss';
import { TagSuggestions } from './__tests__/testingUtils';
/**
 * *******************
 *
 *    Tag Use Case
 *
 * *******************
 * The Tag Editor is composed of four (4) properties
 * Tag Selection: an existing tag being edited, otherwise undefined
 * Dictionary of Tags: a Map of tags that contain all the valid user input tags
 * Left-Hand Side (lhs) Container: a list of tags that belong on the lhs of the tag-input
 * Right-Hand Side (rhs) Container: a list of tags that belong on the rhs of the tag-input
 *
 * In the interest of simplifying the implementation of the editor's UI/UX
 * we put the data structures for rendering in state. As a result, we use a little more space,
 * but we expect less than 5 tags per submission, so the tradeoff is negligible
 *
 */
type TagEditor = {
  inputState: inputState;
  tags: Map<string, EditorTag>;
  lhs: EditorTag[];
  rhs: EditorTag[];
  inputValue: string;
};

type inputState = {
  text: string;
  index: number;
};

interface EditorTag {
  name: string;
}

const initialState = {
  inputState: {
    index: 0,
    text: undefined
  },
  tags: new Map<string, EditorTag>(),
  lhs: [],
  rhs: [],
  inputValue: ''
} as TagEditor;

const props = {
  size: 'small',
  type: 'no-outline',
  text: '',
  orientation: 'right'
} as TagProps;

const ARROW_LEFT = 'ArrowLeft';
const ARROW_RIGHT = 'ArrowRight';
const BACKSPACE = 'Backspace';
const SPACEBAR = 32;
const initTagEditorValue = '';

interface TagUseCaseProps {
  maxLen?: number;
  maxNumTags: number;
  convertTextOnSubmission: boolean;
  onTagCreation?: () => void;
  onChange?: () => void;
  defaultIsHighlighted?: boolean;
}
const sugg = [
  { name: 'material-analysis', count: 5 },
  { name: 'class-analysis', count: 33 },
  { name: 'materialism', count: 12 },
  { name: 'dialectical-materialism', count: 9 },
  { name: 'historical-materialism', count: 5 },
  { name: 'materialist-theory', count: 2 }
];

/**
 * *******************
 *
 *     Tag Editor
 *
 * *******************
 *
 * user inputs text in input
 * user confirms text via an event (click, keyboard)
 * tag is created and inserted in the box of tags
 * user can remove tags
 * user has option to use the editor as an autocomplete
 *
 */

interface ItemsListRef {
  [key: string]: Item;
}
export const TagEditor = () => {
  const itemsListRef = React.useRef<ItemsListRef>({});
  // we want to store the items and only update the list reference when the items change
  // in the getItemProps, we want to assign each item an id that we can reference
  React.useCallback(() => {
    sugg.forEach((item: Item, index: number) => {
      console.log('num times ran');
      const id = `item-${index}`;
      itemsListRef.current[id] = item;
    });
  }, [itemsListRef]);
  console.log(itemsListRef);
  const [state, setState] = React.useState<TagEditor>(initialState);
  const [tagSuggestions, setTagSuggestions] = React.useState({ data: null });
  /*********************************************************
   *                                                       *
   *       Screen Reader Dialogue and Form Errors          *
   *                                                       *
   *********************************************************/
  const [duplicateTagAlert, setDuplicateTagAlert] = React.useState('');

  /**
   * *******************
   *
   *     Focusing
   *
   * *******************
   *
   * If leaving focus from text, convert the current text into a tag, apply TagCreation
   *
   */
  const focusRef = React.useRef<HTMLInputElement>();
  const [editorHasFocus, setEditorHasFocus] = React.useState(false);
  const focusTagEditor = () => {
    if (focusRef.current) {
      focusRef.current.focus();
      setEditorHasFocus(true);
    }
  };
  const tagEditorClass = classNames({
    'tag-editor-container': true,
    'tag-editor-focused': editorHasFocus
  });
  const handleBlur = () => {
    // console.log('[HANDLE_BLUR]');
    setEditorHasFocus(false);
  };
  const handleFocus = () => {
    // console.log('[HANDLE_FOCUS]');
    setEditorHasFocus(true);
  };

  /**
   * *******************
   *
   *     Update
   *
   * *******************
   *
   * Update an existing tag for a click event
   * If a user click's on a tag, convert the tag into input an input
   *
   */
  const editTag = (e: React.MouseEvent<React.ReactNode>) => {
    console.log('[EDIT_TAG]');
    const { name, index, tagContainer } = getTagAttributes(e.target);
    console.log(name, index, tagContainer);
    console.log(state.inputValue);
  };

  /**
   * *******************
   *
   *     Deletion
   *
   * *******************
   * There are two ways to delete a tag
   * - remove the tag via its close button
   * - edit and delete existing tags text
   *
   */
  const removeTag = (e: React.MouseEvent<HTMLButtonElement>) => {
    // prevents other click handlers on the Tag component from firing
    e.stopPropagation();
    console.log('[REMOVE_TAG]');
    const { name, index, tagContainer } = getTagAttributes(e.target);
    const newState = reconstructContainer(state, {
      name,
      index,
      tagContainer
    });
    newState.inputState.index = index;
    newState.inputValue = initTagEditorValue;
    newState.tags.delete(name);
    console.log('[REMOVE_TAG]:', newState);
    setState(newState);
    focusRef.current.focus();
  };

  /**
   * *******************
   *
   *     Rendering
   *
   * *******************
   *
   * Given the tag-input-rendering-state
   * if data-index is defined
   * iterate over the Tags State and a list of Tags*
   * must consider data-index over where to append the tags*
   * Use the Tag Component
   *
   */
  const LHSTags = () =>
    state.lhs.map((tag, index) => (
      <Tag
        onClick={editTag}
        size={props.size}
        type={props.type}
        text={tag.name}
        data-index={index}
        data-container="lhs"
        data-name={tag.name}
      >
        <TagCloseButton
          onClose={removeTag}
          data-container="lhs"
          data-index={index}
          data-name={tag.name}
        />
      </Tag>
    ));

  /**
   * *******************
   *
   *     Rendering
   *
   * *******************
   *
   * Given the tag-input-rendering-state
   * if data-index is defined
   * iterate over the Tags State and a list of Tags*
   * must consider data-index over where to append the tags*
   * Use the Tag Component
   */
  const RHSTags = () =>
    state.rhs.map((tag, index) => (
      <Tag
        onClick={editTag}
        size={props.size}
        type={props.type}
        text={tag.name}
        data-index={index}
        data-container="rhs"
        data-name={tag.name}
      >
        <TagCloseButton
          onClose={removeTag}
          data-container="rhs"
          data-index={index}
          data-name={tag.name}
        />
      </Tag>
    ));

  /**
   * *******************
   *
   *     Create
   *
   * *******************
   *
   * Pre-condition:
   * the tag container must be focused
   * Condition:
   * 1. pre is satisfied
   * 2. a spacebar or click event uses the existing input text
   * apply 3 and evaluate the returned string
   * apply 4 on the returned string and evaluate the result
   *   given the returned result
   *   if true
   *     do not create a tag
   *     delete the current text in the input box
   *     keep focus on the current input
   *     apply 5
   *   if false
   *     create the tag

   * 3. the text input is stripped of non-A-Z-0-9 characters
   *   underscores are transformed into hyphenations
   *   text input is converted into lowercase characters
   *   return the converted string

   * 4. the resulting string is then compared to other existing tags
   *   if there is a match, then apply 5. and return true
   *   else return false

   * 5. a screen-reader: you've already created a tag with the label: [text]
   * 
   */
  const createTag = (userInput: string) => {
    // strip text from characters not allowed
    let text = cleanText(userInput);

    // if the text contained bad characters, then return
    if (text === '') return;

    // check if we have a duplicate tag entry
    if (isDuplicate(text, state)) {
      setDuplicateTagAlert(getDuplicateTagAlert(text));

      // create the tag
    } else {
      // create a fresh piece of state to modify
      let newState = { ...state };

      let newTag = {
        name: text
      } as EditorTag;

      // move our input to the next index
      newState.inputState.index++;

      // insert the tag into our dictionary of tags
      newState.tags.set(text, newTag);

      // update our left-hand side container
      newState.lhs.push(newTag);

      // refresh the value of the input
      newState.inputValue = '';

      // update state
      setState(newState);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.charCode === SPACEBAR && isEmpty(state.inputValue) == false) {
      console.log('submit: ', { ...state, ...{ inputValue: initTagEditorValue } });
      setState({ ...state, ...{ inputValue: initTagEditorValue } });
      createTag(e.target.value);
    }
  };

  /**
   * *******************
   *
   *     Navigation
   *
   * *******************
   *
   * We allow the following key commands to navigate between tags in the editor
   * - Arrow Left: move cursor left and edit the previous tag
   * - Arrow Right: move cursor right and edit the next tag
   * - Backspace: move cursor left and merge the current input text with the previous tag's text
   */
  const handKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // while we have more than one tag and we're not currently editing the first tag of the LHS container
    if (editPrevIsValid(e, state)) {
      if (e.key === ARROW_LEFT) {
        // store value of the input's current value, used later to create a tag
        let inputTextValue = state.inputValue;

        // store the index of the left-hand container's last tag, used later to be the input value
        let index = state.lhs.length - 1;

        if (state.lhs.length > 0) {
          // store the last tag to operate on
          let leftMostTag = state.lhs[index];

          // delete the left hand-side tag
          let newState = reconstructContainer(state, {
            name: leftMostTag.name,
            tagContainer: 'lhs',
            index: state.lhs.length - 1
          });
          newState.tags.delete(leftMostTag.name);

          if (isEmpty(inputTextValue) === false) {
            // create and prepend the tag to the RHS container
            let newTag = { name: inputTextValue } as EditorTag;
            newState.rhs.unshift(newTag);
            newState.tags.set(newTag.name, newTag);
          }
          // update the current index of the input, relative to the items in the LH and RH containers
          newState.inputState.index = index;

          // update the controlled component's input value
          newState.inputValue = leftMostTag.name;

          // update the editor state
          console.log('[EDIT_PREV]:', newState);
          setState(newState);

          return;
        }
      } else if (e.key === BACKSPACE) {
        // prevent on change handle from firing, it will overrwrite our merged input text that we create below
        e.preventDefault();

        // store value of the input's current value, used later to create a tag
        let inputTextValue = state.inputValue;

        // store the index of the left-hand container's last tag, used later to be the input value
        let index = state.lhs.length - 1;

        if (state.lhs.length > 0) {
          // store the last tag to operate on
          let leftMostTag = state.lhs[index];
          let newInputText = leftMostTag.name.concat('', inputTextValue);

          // delete the left hand-side tag
          let newState = reconstructContainer(state, {
            name: leftMostTag.name,
            tagContainer: 'lhs',
            index: state.lhs.length - 1
          });
          newState.tags.delete(leftMostTag.name);

          // update the current index of the input, relative to the items in the LH and RH containers
          newState.inputState.index = index;

          // update the controlled component's input value
          newState.inputValue = newInputText;

          // update the editor state
          setState(newState);

          return;
        }
      }
    }

    if (editForwardIsValid(e, state)) {
      if (e.key === ARROW_RIGHT) {
        // store value of the input's current value, used later to create a tag
        let inputTextValue = state.inputValue;

        // the index of the new input, relateive to the lh and rh containers
        let newInputIndex = state.lhs.length + 1;

        // store the head of the rh container, the tag that we will edit
        let head = state.rhs[0];

        let newState = { ...state };

        // create a tag from the current input value
        if (isEmpty(inputTextValue) === false) {
          let newTag = { name: inputTextValue } as EditorTag;
          newState.lhs.push(newTag);
          newState.tags.set(newTag.name, newTag);
        }

        // delete the head from the rh container
        newState = reconstructContainer(newState, {
          name: head.name,
          index: 0, // the head of the RHS container
          tagContainer: 'rhs'
        });

        newState.tags.delete(head.name);

        // update the input state to be the new index
        newState.inputState.index = newInputIndex;

        // update the controlled component's input value
        newState.inputValue = head.name;

        // update the editor state
        console.log('[ARROW_RIGHT]:', newState);
        setState(newState);

        return;
      }
    }
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('[HANDLE_ONCHANGE]: ', e.target.value);
    // console.log('[HANDLE_ONCHANGE]: ', e.charCode);

    const text = e.target.value;

    if (isWhitespace(text) === false) {
      // update the text value
      console.log({ ...state, ...{ inputValue: text } });
      setState({ ...state, ...{ inputValue: text } });

      // if the editor has a duplicate tag, we remove the duplicate flag in the onChange handler
      // because the user is signaling that they've decided to correct the duplicate
      if (duplicateTagAlert) {
        setDuplicateTagAlert('');
      }
    }
  };

  const handleOnPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    console.log('[ON_PASTE]');
    const text = event.clipboardData.getData('text');

    if (text.length > 1) {
      // create tags from the user's pasted text
      text.split(' ').forEach((pieceOfText) => createTag(pieceOfText));
    }
  };

  return (
    <section onClick={focusTagEditor} className="tag-editor-section">
      <span id="tagInputDescription">
        Add up to 5 (five) tags to describe what your question is about
      </span>
      <div className={tagEditorClass}>
        <ul className="b-tag-list">
          {LHSTags().map((tag, index) => (
            <li key={index} data-index={index} className="b-tag">
              {tag}
            </li>
          ))}
        </ul>
        <input
          type="text"
          autoComplete="off"
          value={state.inputValue}
          onKeyDown={handKeyDown}
          onKeyPress={handleKeyPress}
          onChange={handleOnChange}
          onPaste={handleOnPaste}
          onBlur={handleBlur}
          onFocus={handleFocus}
          className="tag-editor-input"
          aria-describedby="tagInputDescription"
          style={{ width: 20 + state.inputValue.length + 'px' }}
          ref={focusRef}
        />
        <ul className="b-tag-list">
          {RHSTags().map((tag, index) => (
            <li key={index} data-index={index} className="b-tag">
              {tag}
            </li>
          ))}
        </ul>
        {duplicateTagAlert ? <p role="alert">{duplicateTagAlert}</p> : null}
      </div>
      {tagSuggestions.data ? (
        <div className="tag-suggestions">
          <ul className="tag-suggestions__list">
            {tagSuggestions.suggestions.map((suggestion) => {
              const url = `thebottomlineapp.com/tags/${suggestion.name}/info`;
              return (
                <li className="tag-suggestions__list-item" tabIndex={0}>
                  <div className="tag-suggestions__header">
                    <Tag size="small" type="no-outline" text={suggestion.name} />
                    <span className="tag-suggestions__count">{suggestion.count}</span>
                    <a href={url}>
                      <GoQuestion className="tag-suggestions__info" />
                    </a>
                  </div>
                  <span className="tag-suggestions__body">{suggestion.excerpt}</span>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </section>
  );
};

function reconstructContainer(state, { name, index, tagContainer }) {
  const newState = { ...state };
  switch (tagContainer) {
    case 'lhs':
      //
      //  LHS Tag Removal
      //
      //  -------------------------------------------------------------------------------------------
      //
      //  LHS Container:  0   1   2   3   4   5   6   7     k      RHS Container: k+1 k+2 ... k+n
      //                 tag tag tag tag tag tag tag tag <input>                  tag tag ... tag
      //                                  ^
      //                                  |
      //                                remove
      //
      //  -------------------------------------------------------------------------------------------
      //
      //  - Get the total length of all tags, len(lhs) + len(rhs)
      //  - Beginning from index + 1 of the removal tag
      //        (i.e. don't include the tag to be removed) to the index of the input
      //        Prepend tags to the RHS container
      //
      //  -------------------------------------------------------------------------------------------
      //
      //  LHS Container:  0   1   2   3   RHS Container:  5   6   7     k    k+1 k+2 ... k+n
      //                 tag tag tag tag                 tag tag tag <input> tag tag ... tag
      //
      //  -------------------------------------------------------------------------------------------
      //
      //  - Index of the input tag = index of the tag removed
      //
      //  -------------------------------------------------------------------------------------------
      //
      //  LHS Container:  0   1   2   3      4 (new k)    RHS Container:  5   6   7  k+1 k+2 ... k+n
      //                 tag tag tag tag      <input>                    tag tag tag tag tag ... tag
      //
      //  -------------------------------------------------------------------------------------------
      //

      if (index === 0) {
        // delete the head
        let tagsToPrepend = newState.lhs.splice(index + 1);

        newState.rhs = tagsToPrepend.concat(newState.rhs);

        newState.lhs = [];
      } else if (index === newState.lhs.length - 1) {
        // delete the tail
        newState.lhs.pop();
      } else {
        // otherwise, delete in-place
        let numItems = newState.inputState.index - index + 1;

        let tagsToPrepend = newState.lhs.splice(index + 1, numItems);

        newState.rhs = tagsToPrepend.concat(newState.rhs);

        newState.lhs.pop();
      }
      break;
    case 'rhs':
      //
      //  RHS Tag Removal
      //
      //  -------------------------------------------------------------------------------------------
      //
      //  LHS Container:  0   1   2   3   4   5   6   7     k      RHS Container: k+1 k+2 ... k+n
      //                 tag tag tag tag tag tag tag tag <input>                  tag tag     tag
      //                                                                               ^
      //                                                                               |
      //                                                                             remove
      //
      //  -------------------------------------------------------------------------------------------
      //
      //  - Get the total length of all tags, lhs + rhs
      //  - Beginning from the index of the input+1 to the index of the removal tag
      //        Append tags to the LHS container
      //
      //  -------------------------------------------------------------------------------------------
      //
      //  LHS Container:  0   1   2   3   4   5   6   7     k    k+1  RHS Container:  ... k+n
      //                 tag tag tag tag tag tag tag tag <input> tag                  tag tag
      //
      //  -------------------------------------------------------------------------------------------
      //
      //  - Index of the input tag = index of the tag removed
      //
      //  -------------------------------------------------------------------------------------------
      //
      //  LHS Container:  0   1   2   3   4   5   6   7   8     k       RHS Container: ... k+n
      //                 tag tag tag tag tag tag tag tag tag <input>                   tag tag
      //
      //  -------------------------------------------------------------------------------------------
      //

      if (index === 0) {
        // delete the head
        newState.rhs.shift();
      } else if (index === newState.rhs.length - 1) {
        // delete the tail
        newState.rhs.pop();

        newState.lhs = newState.lhs.concat(newState.rhs);

        newState.rhs = [];
      } else {
        // otherwise, delete in-place
        // delete up to the index, splice is right-boundary non-inclusive
        let appendRHS = newState.rhs.splice(0, index);

        newState.lhs = newState.lhs.concat(appendRHS);

        newState.rhs.shift();
      }
      break;
    default:
      throw new TypeError('Unhandled exception');
  }

  return newState;
}

function editForwardIsValid(
  e: React.KeyboardEvent<HTMLInputElement>,
  state: TagEditor
): boolean {
  return (
    e.target.selectionEnd === e.target.value.length &&
    state.rhs.length > 0 &&
    state.inputState.index !== state.lhs.length + state.rhs.length
  );
}
function editPrevIsValid(
  e: React.KeyboardEvent<HTMLInputElement>,
  state: TagEditor
): boolean {
  return (
    e.target.selectionStart === 0 &&
    state.lhs.length > 0 &&
    state.inputState.index !== 0
  );
}

function getTagAttributes(target: HTMLElement) {
  return {
    name: target.getAttribute('data-name'),
    index: parseInt(target.getAttribute('data-index')),
    tagContainer: target.getAttribute('data-container')
  };
}

function getDuplicateTagAlert(text: string): string {
  return `Unable to create the tag "${text}", duplicate of a tag that you've already created. Text cleared, please continue typing as you were`;
}

function isWhitespace(str: string): boolean {
  const whitespaceTest = new RegExp(/\s/);
  return whitespaceTest.test(str);
}

function getTags(state: TagEditor): string[] {
  let tags = state.tags;
  if (tags.size === 0) return [];
  let tagsList = [];
  tags.forEach((_, tagName) => tagsList.push(tagName));
  return tagsList;
}

function cleanText(text) {
  let regex = /[a-z]|[A-Z]|[0-9]|[\-]/g;
  let cleaned = text.match(regex);
  if (!cleaned) return '';
  const res = cleaned.join('').toLowerCase();
  return res;
}

function isDuplicate(tagText: string, state: TagEditor): boolean {
  let tags: string[] = getTags(state);
  if (tags.length === 0) return false;
  return tags.includes(tagText);
}

function isEmpty(text: string): boolean {
  return text === '';
}
