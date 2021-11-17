import React from 'react';
import { Tag, TagIcon, TagCloseButton, TagProps } from '../Tag';
import {
  getTagAttributes,
  getDuplicateTagAlert,
  isWhitespace,
  getTags,
  cleanText,
  isDuplicate,
  isEmpty,
  noop
} from './utils';
import { useCombobox } from '../../combobox/hooks/useCombobox';
import useDebouncedCallback from '../../useDebounce/src/hooks/useDebouncedCallback';
import useAsync from '../../useDebounce/src/hooks/useAsync';
import { UseAsyncStatus } from '../../useDebounce/src/types';
import { BL } from '../../combobox/hooks/types';
import { BottomlineTag, BottomlineTags } from './types';
import { GoQuestion } from 'react-icons/go';
import classNames from 'classnames';
import './TagUseCase.scss';
import './TagEditor.scss';

/**
 * *******************
 *
 *     Tag Editor
 *
 * *******************
 *
 * Use Case:
 * - user inputs text in input
 * - user confirms text via an event (click, keyboard)
 * - tag is created and inserted in the box of tags
 * - user can remove tags
 * - user has option to use the editor as an autocomplete
 *
 * See: https://github.com/krfong916/bottomline/issues/6 for a formal spec on the use case
 */

export const TagEditor = () => {
  const [input, setInput] = React.useState('');
  const [selectedTags, setSelectedTags] = React.useState<BottomlineTags>({});
  const [tagSuggestions, setTagSuggestions] = React.useState({ data: null });
  const [duplicateTagAlert, setDuplicateTagAlert] = React.useState('');
  const debounce = useDebouncedCallback(
    (dispatch) => {
      console.log('dispatch:', dispatch);
      dispatch();
    },
    2000,
    { trailing: true }
  );

  function stateReducer(
    state: BL.ComboboxState<BottomlineTag>,
    actionAndChanges: BL.ComboboxActionAndChanges<BottomlineTag>
  ) {
    const { action, changes } = actionAndChanges;
    const recommendations = { ...changes };
    switch (action.type) {
      case BL.ComboboxActions.INPUT_ITEM_CLICK: {
        const newTags = { ...selectedTags };
        if (recommendations.selectedItem) {
          newTags[recommendations.selectedItem.name as keyof BottomlineTags] =
            recommendations.selectedItem;
          setSelectedTags(newTags);
        }
        return recommendations;
      }
      case BL.ComboboxActions.INPUT_BLUR: {
        recommendations.inputValue = state.inputValue;
        return recommendations;
      }
      default: {
        return changes;
      }
    }
  }

  const {
    isOpen,
    highlightedIndex,
    getLabelProps,
    getComboboxProps,
    getInputProps,
    getItemProps,
    getPopupProps
  } = useCombobox<BottomlineTag>({
    onInputValueChange: (changes: Partial<BL.ComboboxState<string>>) => {
      // piggy-back on the state change
      // set our own input value change
      setInput(changes as string);
    },
    stateReducer
  });

  React.useEffect(() => {
    console.log('our input:', input);
  }, [input]);

  // const { data: tags, status, error } = useAsync(
  //   () => {
  //     if (input && input !== '') {
  //       return fetchTags(input);
  //     }
  //   },
  //   { status: UseAsyncStatus.IDLE },
  //   [input]
  // );

  return (
    <section className="tag-editor-section">
      <span {...getLabelProps({ id: 'tagInputDescription' })}>
        Add up to 5 (five) tags to describe what your question is about
      </span>
      <div>
        <input
          {...getInputProps({ controlDispatch: debounce })}
          type="text"
          autoComplete="off"
          className="tag-editor-input"
          aria-describedby="tagInputDescription"
          ref={null}
        />
        {duplicateTagAlert ? <p role="alert">{duplicateTagAlert}</p> : null}
      </div>
    </section>
  );
};

/**
 * *******************
 *
 *     Screen Reader Dialogue and Form Errors
 *
 * *******************
 */

// /**
//  * *******************
//  *
//  *     Focusing
//  *
//  * *******************
//  *
//  * If leaving focus from text, convert the current text into a tag, apply TagCreation
//  *
//  */

// /**
//  * *******************
//  *
//  *     Update
//  *
//  * *******************
//  *
//  * Update an existing tag for a click event
//  * If a user click's on a tag, convert the tag into input an input
//  *
//  */
// const editTag = (e: React.MouseEvent<React.ReactNode>) => {
//   console.log('[EDIT_TAG]');
//   const { name, index, tagContainer } = getTagAttributes();
// };

// /**
//  * *******************
//  *
//  *     Deletion
//  *
//  * *******************
//  * There are two ways to delete a tag
//  * - remove the tag via its close button
//  * - edit and delete existing tags text
//  *
//  */
// const removeTag = (e: React.MouseEvent<HTMLButtonElement>) => {
//   // prevents other click handlers on the Tag component from firing
//   e.stopPropagation();
// };

// /**
//  * *******************
//  *
//  *     Create
//  *
//  * *******************
//  */
// const createTag = (userInput: string) => {
//   // strip text from characters not allowed
//   let text = cleanText(userInput);

//   // if the text contained bad characters, then return
//   if (text === '') return;

//   // check if we have a duplicate tag entry
//   if (isDuplicate(text, state)) {
//     setDuplicateTagAlert(getDuplicateTagAlert(text));

//     // create the tag
//   } else {
//     // create a fresh piece of state to modify
//     let newState = { ...state };

//     let newTag = {
//       name: text
//     } as EditorTag;

//     // insert the tag into our dictionary of tags
//     newState.tags.set(text, newTag);

//     // refresh the value of the input
//     newState.inputValue = '';

//     // update state
//     setState(newState);
//   }
// };

// const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
//   if (e.charCode === SPACEBAR && isEmpty(state.inputValue) == false) {
//   }
// };

// const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//   console.log('[HANDLE_ONCHANGE]: ', e.target.value);
//   // console.log('[HANDLE_ONCHANGE]: ', e.charCode);

//   const text = e.target.value;

//   if (isWhitespace(text) === false) {
//     // update the text value
//     console.log({ ...state, ...{ inputValue: text } });
//     setState({ ...state, ...{ inputValue: text } });

//     // if the editor has a duplicate tag, we remove the duplicate flag in the onChange handler
//     // because the user is signaling that they've decided to correct the duplicate
//     if (duplicateTagAlert) {
//       setDuplicateTagAlert('');
//     }
//   }
// };

// const handleOnPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
//   console.log('[ON_PASTE]');
//   const text = event.clipboardData.getData('text');

//   if (text.length > 1) {
//     // create tags from the user's pasted text
//     text.split(' ').forEach((pieceOfText) => createTag(pieceOfText));
//   }
// };
// {tagSuggestions.data ? (
//   <div className="tag-suggestions">
//     <ul className="tag-suggestions__list">
//       {tagSuggestions.suggestions.map((suggestion) => {
//         const url = `thebottomlineapp.com/tags/${suggestion.name}/info`;
//         return (
//           <li className="tag-suggestions__list-item" tabIndex={0}>
//             <div className="tag-suggestions__header">
//               <Tag size="small" type="no-outline" text={suggestion.name} />
//               <span className="tag-suggestions__count">{suggestion.count}</span>
//               <a href={url}>
//                 <GoQuestion className="tag-suggestions__info" />
//               </a>
//             </div>
//             <span className="tag-suggestions__body">{suggestion.excerpt}</span>
//           </li>
//         );
//       })}
