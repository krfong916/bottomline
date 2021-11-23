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
import { useCombobox } from '../../combobox/hooks/useCombobox';
import { useAbortController } from '../../useAbortController/useAbortController';
import useDebouncedCallback from '../../useDebounce/src/hooks/useDebouncedCallback';
import useAsync from '../../useDebounce/src/hooks/useAsync';
import { SearchLoader } from '../../loader/SearchLoader';
import { UseAsyncStatus, UseAsyncState } from '../../useDebounce/src/types';
import { BL } from '../../combobox/hooks/types';
import { BottomlineTag, BottomlineTags } from './types';
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

export const TagEditor = () => {
  const [input, setInput] = React.useState('');
  const prevInput = React.useRef('');
  const [selectedTags, setSelectedTags] = React.useState<BottomlineTags>({});
  const [tagSuggestions, setTagSuggestions] = React.useState<
    BottomlineTag[] | undefined
  >([
    {
      id: 1,
      name: 'material-analysis',
      count: 5,
      excerpt:
        "What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    {
      id: 2,
      name: 'class-analysis',
      count: 33,
      excerpt:
        "What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    {
      id: 3,
      name: 'materialism',
      count: 12,
      excerpt:
        "What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    {
      id: 4,
      name: 'dialectical-materialism',
      count: 9,
      excerpt:
        "What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    {
      id: 5,
      name: 'historical-materialism',
      count: 345435345,
      excerpt:
        "What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    {
      id: 6,
      name: 'materialist-theory',
      count: 2,
      excerpt:
        "What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    }
  ]);

  // we define state and change handler callbacks instead of a ref because we don't need to handle
  // we need the "appearance" of focus handling for the container when the input element is focused
  const [inputFocused, setInputFocused] = React.useState(false);
  const inputOnFocus = () => setInputFocused(true);
  const inputOnBlur = () => setInputFocused(false);
  let derivedLoaderState = false;

  const debounce = useDebouncedCallback(
    (dispatch) => {
      dispatch();
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
    console.log('[APP] error:', error);
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
        forceAbort();
        recommendations.inputValue = state.inputValue;
        return recommendations;
      }
      case BL.ComboboxActions.INPUT_VALUE_CHANGE: {
        if (action.inputValue === '' && changes.inputValue !== '') {
          recommendations.isOpen = false;
          setTagSuggestions(undefined);
        }
        recommendations.inputValue = action.inputValue;
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
      prevInput.current = input;
      setInput(changes as string);
    },
    stateReducer,
    items: tagSuggestions,
    initialIsOpen: tagSuggestions ? true : false
  });

  const noResultsFound = isOpen && tagSuggestions && tagSuggestions.length == 0;
  const resultsFound = isOpen && tagSuggestions && tagSuggestions.length >= 1;

  console.log('resultsFound:', resultsFound);
  console.log('noResultsFound:', noResultsFound);
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
          {selectedTags ? (
            <ul className="selected-tags">
              {Object.keys(selectedTags).map((tagName) => {
                const tag = selectedTags[tagName];
                return (
                  <li className="selected-tag">
                    <Tag size="small" type="outlined" text={tag.name}>
                      <TagCloseButton />
                    </Tag>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
        {/*{duplicateTagAlert ? <p role="alert">{duplicateTagAlert}</p> : null}*/}
        <div
          className={
            inputFocused
              ? 'tag-search-container tag-search-container--focused'
              : 'tag-search-container'
          }
          {...getComboboxProps()}
        >
          <input
            {...getInputProps<HTMLInputElement | undefined>({
              controlDispatch: debounce,
              onFocus: inputOnFocus,
              onBlur: inputOnBlur
            })}
            type="text"
            autoComplete="off"
            className="tag-search-input"
            ref={null}
          />
          {/*{derivedLoaderState ? (*/}
          <span className="tag-search-loader">
            <SearchLoader />
          </span>
          {/*) : null}*/}
        </div>
        <div className="tag-results-container" {...getPopupProps()}>
          {noResultsFound ? (
            <span className="tag-no-results">
              <span>No results found</span>
            </span>
          ) : null}
          {resultsFound ? (
            <ul className="tag-results">
              {tagSuggestions.map((tag, index: number) => (
                <li
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
              ))}
            </ul>
          ) : null}
        </div>
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
