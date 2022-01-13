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
  noop,
  fetchTags
} from './utils';
import { useCombobox } from '../../combobox/useCombobox';
import { useMultipleSelection } from '../../useMultipleSelection/useMultipleSelection';
import { useAbortController } from '../../useAbortController/useAbortController';
import useDebouncedCallback from '../../useDebounce/src/hooks/useDebouncedCallback';
import useAsync from '../../useDebounce/src/hooks/useAsync';
import { SearchLoader } from '../../loader/SearchLoader';
import { UseAsyncStatus, UseAsyncState } from '../../useDebounce/src/types';
import { NavigationKeys } from '../../useMultipleSelection/types';
import {
  ComboboxState,
  ComboboxActionAndChanges,
  ComboboxActions
} from '../../combobox/types';
import { BottomlineTag, BottomlineTags, TagEditorProps } from './types';
import { AiFillQuestionCircle } from 'react-icons/ai';
import classNames from 'classnames';
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

export const TagEditor = ({ onTagsChanged = noop, ...props }: TagEditorProps) => {
  const [input, setInput] = React.useState('');
  const prevInput = React.useRef('');
  const [selectedTags, setSelectedTags] = React.useState<BottomlineTags>();
  const [tagSuggestions, setTagSuggestions] = React.useState<
    BottomlineTag[] | undefined
  >();
  // we define state and change handler callbacks instead of a ref because we don't need to handle
  // we need the "appearance" of focus handling for the container when the input element is focused
  const [inputFocused, setInputFocused] = React.useState(false);
  const inputOnFocus = () => setInputFocused(true);
  const inputOnBlur = () => {
    setInputFocused(false);
    if (props.onBlur) props.onBlur();
  };
  let derivedLoaderState = false;
  const inputRef = React.useRef<HTMLInputElement>();
  const cancelRequestRef = React.useRef(false);
  const debounce = useDebouncedCallback(
    (dispatch) => {
      if (cancelRequestRef.current === false) {
        dispatch();
      } else {
        cancelRequestRef.current = false;
      }
    },
    1000,
    { trailing: true }
  );

  const { data: tags, error, status, run } = useAsync({
    initialState: {
      status: UseAsyncStatus.IDLE
    } as UseAsyncState
  });
  if (error) {
    // console.log('[APP] error:', error);
  }

  const { getSignal, forceAbort } = useAbortController();

  React.useEffect(() => {
    if (!input || (prevInput.current === '' && input === '')) return;
    run(fetchTags(input, getSignal));
  }, [input, run]);

  if (status === UseAsyncStatus.PENDING) derivedLoaderState = true;

  React.useEffect(() => {
    if (tags) setTagSuggestions(tags);
  }, [tags]);

  const {
    getSelectedItemProps,
    removeSelectedItem,
    addSelectedItem,
    getDropdownProps,
    currentSelectedItemIndex,
    items
  } = useMultipleSelection<BottomlineTag>({
    items: [],
    itemToString: (item: BottomlineTag) => item.name,
    nextKey: NavigationKeys.ARROW_RIGHT,
    prevKey: NavigationKeys.ARROW_LEFT,
    onItemsChange: (tags: BottomlineTag[]) => {
      if (props.onChange) {
        console.log('[TagEditor ON_ITEMS_CHANGE]', tags);
        props.onChange(tags);
      }
      onTagsChanged(tags);
      setSelectedTags(tags);
    }
  });

  const handleRemove = (item: BottomlineTag, index: number) =>
    removeSelectedItem(item, index);

  function stateReducer(
    state: ComboboxState<BottomlineTag>,
    actionAndChanges: ComboboxActionAndChanges<BottomlineTag>
  ) {
    const { action, changes } = actionAndChanges;
    const recommendations = { ...changes };
    switch (action.type) {
      case ComboboxActions.ITEM_CLICK: {
        // console.log('[CUSTOM_REDUCER] item click');
        // console.log('recommendations', recommendations);
        // console.log('actionAndChanges', actionAndChanges);
        inputRef.current.value = '';
        const newTags = { ...selectedTags };
        if (recommendations.selectedItem) {
          if (!newTags[recommendations.selectedItem.name]) {
            newTags[recommendations.selectedItem.name as keyof BottomlineTags] =
              recommendations.selectedItem;
            addSelectedItem(recommendations.selectedItem);
            setSelectedTags(newTags);
            // issue a warning, item already selected
          }
          recommendations.isOpen = false;
        }

        return recommendations;
      }
      case ComboboxActions.INPUT_BLUR: {
        // console.log('[CUSTOM_REDUCER] input blur');
        forceAbort();
        recommendations.inputValue = state.inputValue;
        return recommendations;
      }
      case ComboboxActions.INPUT_VALUE_CHANGE: {
        // if we've deleted all text from the input, close the popup
        if (action.inputValue === '' && changes.inputValue !== '') {
          recommendations.isOpen = false;
          setTagSuggestions(undefined);
        }
        // console.log('[CUSTOM_REDUCER] input value change');
        // console.log('input', action.inputValue);
        recommendations.inputValue = action.inputValue;
        return recommendations;
      }
      case ComboboxActions.INPUT_KEYDOWN_ENTER: {
        const newTags = { ...selectedTags };
        const textboxValue = inputRef.current.value;
        let newSelectedItem;

        inputRef.current.value = '';
        cancelRequestRef.current = true;

        if (changes.selectedItem) {
          newSelectedItem = changes.selectedItem;
        } else {
          newSelectedItem = { name: textboxValue };
        }

        if (!newTags[newSelectedItem.name]) {
          newTags[newSelectedItem.name] = newSelectedItem;
          addSelectedItem(newSelectedItem);
          setSelectedTags(newTags);
        }

        recommendations.isOpen = false;
        return recommendations;
      }
      case ComboboxActions.FUNCTION_CLOSE_POPUP: {
        if (inputRef.current) inputRef.current.focus();
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
    onInputValueChange: (changes: Partial<ComboboxState<string>>) => {
      // piggy-back on the state change
      // set our own input value change
      // console.log('[ON_INPUT_VALUE_CHANGE_CALLBACK]', changes);
      prevInput.current = changes;
      setInput(changes as string);
    },
    itemToString: (tag: BottomlineTag) => tag.name,
    stateReducer,
    items: tagSuggestions,
    initialIsOpen: tagSuggestions ? true : false
  });

  const noResultsFound = isOpen && tagSuggestions && tagSuggestions.length == 0;
  const resultsFound = isOpen && tagSuggestions && tagSuggestions.length >= 1;

  const handleOnPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    console.log('[ON_PASTE]');
    console.log(e);
    let pastedText = e.clipboardData.getData('text');
    pastedText = cleanText(pastedText);
    cancelRequestRef.current = true;

    if (pastedText.length > 1) {
      // create tags from the user's pasted text
      pastedText.split(' ').forEach((pieceOfText) => {
        addSelectedItem({ name: pieceOfText });
      });
    }
    inputRef.current.value = '';
    setInput('');
  };

  return (
    <section className="tag-editor-section">
      <div className="tag-editor">
        <div className="tag-header-container">
          <label className="tag-header-title" {...getLabelProps()}>
            Add up to 5 (five) tags to describe what your question is about
          </label>
          <AiFillQuestionCircle size="1.25em" className="tag-header-description" />
        </div>
        <div className="selected-tags-container">
          {items ? (
            <ul className="selected-tags">
              {Object.keys(items).map((tagIndex, index) => {
                const tag = items[tagIndex];
                const key = `${tag.name} ${index}`;
                {
                  /*const active = currentSelectedItemIndex === index ? true : false;*/
                }
                return (
                  <li
                    className="selected-tag"
                    key={key}
                    {...getSelectedItemProps(tag, index)}
                  >
                    <Tag
                      size="small"
                      type="outlined"
                      // type={active ? 'solid' : 'outlined'}
                      text={tag.name}
                    >
                      <TagCloseButton
                        ariaLabel={`remove ${tag.name}`}
                        onClose={() => handleRemove(tag, index)}
                      />
                    </Tag>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
        <div
          className={props.className ? props.className : 'tag-search-container'}
          {...getComboboxProps()}
        >
          <input
            {...getInputProps<HTMLInputElement | undefined>({
              controlDispatch: debounce,
              onFocus: inputOnFocus,
              onBlur: inputOnBlur,
              ...getDropdownProps({ ref: inputRef })
            })}
            onPaste={handleOnPaste}
            type="text"
            autoComplete="off"
            className="tag-search-input"
          />
          {derivedLoaderState ? (
            <span className="tag-search-loader">
              <SearchLoader />
            </span>
          ) : null}
        </div>
        <div className="tag-results-container" {...getPopupProps()}>
          {noResultsFound ? (
            <span className="tag-no-results">
              <span>No results found</span>
            </span>
          ) : null}
          {resultsFound ? (
            <ul className="tag-results">
              {tagSuggestions.map((tag, index: number) => {
                const key = `${tag.name} ${index}`;
                return (
                  <li
                    key={key}
                    className={
                      highlightedIndex === index
                        ? 'tag-result tag-result--focused'
                        : 'tag-result'
                    }
                    {...getItemProps(index)}
                  >
                    <div className="tag-result-info">
                      <span className="tag-result-header">
                        <Tag className="tag-name" size="small" text={tag.name} />
                        <span className="tag-result-count">{tag.count}</span>
                        <AiFillQuestionCircle
                          size="1rem"
                          className="tag-result-details"
                        />
                      </span>
                    </div>
                    <p className="tag-result-excerpt">{tag.excerpt}</p>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  );
};
