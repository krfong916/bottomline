import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Tag, TagIcon, TagCloseButton, TagProps } from './Tag';
import { GoPlus } from 'react-icons/go';
import classNames from 'classnames';
import './TagUseCase.scss';

export default {
  title: 'Example/Tag',
  component: Tag,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof Tag>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const DefaultTemplate: ComponentStory<typeof Tag> = (args) => {
  let { size = 'medium', text = 'material-analysis', type } = args;
  // solid tag with sizes
  return <Tag size={size} type={type} text={text} />;
};

const IconTemplate: ComponentStory<typeof Tag> = (args) => {
  let { size = 'medium', text = 'Add a friend', type, orientation } = args;
  const onClick = () => console.log('Custom icon with custom click event listener');
  // tag with an icon
  // tag with left and right support
  return (
    <Tag size={size} type={type} text={text}>
      <TagIcon orientation={orientation}>
        <GoPlus style={{ height: '100%', cursor: 'pointer' }} />
      </TagIcon>
    </Tag>
  );
};

const CloseButtonTemplate: ComponentStory<typeof Tag> = (args) => {
  let { size = 'medium', text = 'material-analysis', type } = args;
  return (
    <Tag size={size} type={type} text={text}>
      <TagCloseButton />
    </Tag>
  );
};

export const Default = DefaultTemplate.bind({});
Default.args = {
  size: 'small',
  text: 'material-analysis',
  type: 'outlined'
};

export const WithAnIcon = IconTemplate.bind({});
WithAnIcon.args = {
  orientation: 'right',
  withCustomIcon: true
};

export const WithACloseButton = CloseButtonTemplate.bind({});
WithACloseButton.args = {
  size: 'small',
  text: 'material-analysis',
  type: 'outlined',
  orientation: 'right',
  ariaLabel: 'remove'
};

/***************************
 *                         *
 *     Tag Use Case        *
 *                         *
 ***************************/

/**
 * The Tag Editor is composed of four (4) properties
 * Tag Selection: an existing tag being edited, otherwise undefined
 * Dictionary of Tags: a Map of tags that contain all the valid user input tags
 * Left-Hand Side (lhs) Container: a list of tags that belong on the lhs of the tag-input
 * Right-Hand Side (rhs) Container: a list of tags that belong on the rhs of the tag-input
 *
 * In the interest of simplifying the implementation of the editor's UI/UX
 * we put the data structures for rendering in state. As a result, we use a little more space,
 * but we expect less than 5 tags per submission, so the tradeoff is negligible
 */
type TagEditor = {
  inputState: inputState;
  tags: Map<string, EditorTag>;
  lhs: EditorTag[];
  rhs: EditorTag[];
};

type inputState = {
  text: string;
  index: number;
};

interface EditorTag {
  name: string;
}

const initialTagEditorState = {
  inputState: {
    index: 0,
    text: undefined
  },
  tags: new Map<string, EditorTag>(),
  lhs: [],
  rhs: []
} as TagEditor;

const tagProps = {
  size: 'small',
  type: 'no-outline',
  orientation: 'right'
} as TagProps;

const ENTER = 'Enter';
const BACKSPACE = 'Backspace';
const SPACEBAR = 32;
const initTagEditorValue = '';

const UseCaseTemplate: ComponentStory<typeof Tag> = (args) => {
  const [tagEditorState, setTagEditorState] = React.useState<TagEditor>(
    initialTagEditorState
  );
  const [tagEditorInputValue, setTagEditorInputValue] = React.useState(
    initTagEditorValue
  );

  /*********************************************************
   *                                                       *
   *       Screen Reader Dialogue and Form Errors          *
   *                                                       *
   *********************************************************/
  const [duplicateTagAlert, setDuplicateTagAlert] = React.useState('');

  /*******************
   *                 *
   *    Focusing     *
   *                 *
   *******************/
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

  /****************
   *              *
   *   Summary    *
   *              *
   ****************/
  // Summary of Tag Creation
  // user inputs text in input
  // user confirms text via an event (click, keyboard)
  // tag is created and inserted in the box of tags

  /***************
   *             *
   *   Update    *
   *             *
   **************/

  /**
   *
   * Update an existing tag
   *
   * - Click event
   * - Navigation on a tag via keyboard events
   */
  // Pre-condition to Update a tag
  // if leaving focus from text, convert the current text into a tag, apply TagCreation
  // get the text of the selected tag element
  // remove the tag element
  // render an input with the text of the element pre-filled
  // if a user click's on a tag, convert the tag into input an input

  const editTag = (e: React.MouseEvent<React.ReactNode>) => {
    console.log('[EDIT_TAG]');
    const { name, index, tagContainer } = getTagAttributes(e.target);
  };

  /**
   *
   * Deletion
   *
   * There are two ways to delete a tag
   * - remove the tag via its close button
   * - edit and delete existing tags text
   */
  const removeTag = (e: React.MouseEvent<HTMLButtonElement>) => {
    // prevents other click handlers on the Tag component from firing
    e.stopPropagation();
    console.log('[REMOVE_TAG]');
    const newState = { ...tagEditorState };
    const { name, index, tagContainer } = getTagAttributes(e.target);

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

        // delete the head
        if (index === 0) {
          let tagsToPrepend = newState.lhs.splice(index + 1);
          newState.rhs = tagsToPrepend.concat(newState.rhs);
          newState.lhs = [];
          // delete the tail
        } else if (index === newState.lhs.length - 1) {
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

        // delete the head
        if (index === 0) {
          newState.rhs.shift();
          // delete the tail
        } else if (index === newState.rhs.length - 1) {
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
    newState.inputState.index = index;
    newState.tags.delete(name);
    setTagEditorState(newState);
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
   */
  const LHSTags = () =>
    tagEditorState.lhs.map((tag, index) => (
      <Tag
        onClick={editTag}
        size={tagProps.size}
        type={tagProps.type}
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
    tagEditorState.rhs.map((tag, index) => (
      <Tag
        onClick={editTag}
        size={tagProps.size}
        type={tagProps.type}
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

  /***************
   *             *
   *   Create    *
   *             *
   **************/
  // Pre-condition:
  // the tag container must be focused

  // Condition:
  // 1. pre is satisfied
  // 2. a spacebar or click event uses the existing input text
  // apply 3 and evaluate the returned string
  // apply 4 on the returned string and evaluate the result
  //   given the returned result
  //   if true
  //     do not create a tag
  //     delete the current text in the input box
  //     keep focus on the current input
  //     apply 5
  //   if false
  //     create the tag

  // 3. the text input is stripped of non-A-Z-0-9 characters
  //   underscores are transformed into hyphenations
  //   text input is converted into lowercase characters
  //   return the converted string

  // 4. the resulting string is then compared to other existing tags
  //   if there is a match, then apply 5. and return true
  //   else return false

  // 5. a screen-reader: you've already created a tag with the label: [text]
  const createTag = (userInput: string) => {
    console.log('[CREATE_TAG]');
    let text = cleanText(userInput);
    let tags = getTags(tagEditorState);
    if (isDuplicate(text, tags)) {
      setDuplicateTagAlert(getDuplicateTagAlert(text));
    } else {
      let newState = { ...tagEditorState };
      let tagIndex = newState.inputState.index;
      let newTag = {
        name: text
      } as EditorTag;
      newState.inputState.index = tagIndex + 1;
      newState.tags.set(text, newTag);
      newState.lhs.push(newTag);
      console.log('[CREATE_TAG]: ', newState);
      setTagEditorState(newState);
    }
  };

  /*******************
   *                 *
   *   Navigation    *
   *                 *
   *******************/
  // The tag list has a click event assigned to it
  // each tag has a data-index
  // when the list is clicked, allow the event to bubble
  // get the data-index of the node that was clicked and the text of the tag
  // given the data-index and text, do the following
  // remove the text node from the tags state
  // set new state for tags list
  // set new state for tag-input-render-info

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      (e.key === ENTER && isEmpty(tagEditorInputValue) == false) ||
      (e.charCode === SPACEBAR && isEmpty(tagEditorInputValue) == false)
    ) {
      createTag(e.target.value);
      setTagEditorInputValue(initTagEditorValue);
    }
  };

  const handKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowLeft') {
      console.log(e.target.selectionStart);
      console.log(e.target.selectionEnd);
    }
    console.log('[HANDLE_KEYDOWN]');
    if (e.key === BACKSPACE) {
      console.log(e.target.selectionStart);
      console.log(e.target.selectionEnd);
    }
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('[HANDLE_ONCHANGE]: ', e.target.value);
    console.log('[HANDLE_ONCHANGE]: ', e.charCode);
    const whitespaceTest = new RegExp(/\s/);
    if (whitespaceTest.test(e.target.value) === false) {
      setTagEditorInputValue(e.target.value);
      if (duplicateTagAlert) setDuplicateTagAlert('');
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
          value={tagEditorInputValue}
          onKeyDown={handKeyDown}
          onKeyPress={handleKeyPress}
          onChange={handleOnChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          className="tag-editor-input"
          aria-describedby="tagInputDescription"
          style={{ width: 20 + tagEditorInputValue.length + 'px' }}
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
    </section>
  );
};

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

function getTags(tagEditorState: TagEditor): string[] {
  let tags = tagEditorState.tags;
  if (tags.size === 0) return [];
  let tagsList = [];
  tags.forEach((_, tagName) => tagsList.push(tagName));
  return tagsList;
}

function cleanText(text: string): string {
  let regex = /[a-z]|[A-Z]|[0-9]|[\-]/g;
  let cleaned = text.match(regex);
  return cleaned.join('').toLowerCase();
}

function isDuplicate(tagText: string, tags: string[]): boolean {
  if (tags.length === 0) return false;
  return tags.includes(tagText);
}

function isEmpty(text: string): boolean {
  return text === '';
}

export const UseCase = UseCaseTemplate.bind({});
