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
  const [selectedTags, setSelectedTags] = React.useState<BottomlineTags>({});
  const [tagSuggestions, setTagSuggestions] = React.useState<
    BottomlineTag[] | undefined
  >(undefined);
  let derivedLoaderState = false;

  const debounce = useDebouncedCallback(
    (dispatch) => {
      dispatch();
    },
    2000,
    { trailing: true }
  );

  const { data: tags, error, status, run } = useAsync({
    initialState: {
      status: UseAsyncStatus.IDLE
    } as UseAsyncState
  });

  React.useEffect(() => {
    if (!input || input === '') return;
    run(fetchTags(input));
  }, [input, run]);

  if (status === UseAsyncStatus.PENDING) {
    console.log('[TAG_EDITOR_PENDING]');
    derivedLoaderState = true;
  }

  React.useEffect(() => {
    if (tags) {
      console.log('Use Effect, Setting Tags');
      setTagSuggestions(tags);
    }
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
    stateReducer,
    items: tagSuggestions,
    initialIsOpen: tagSuggestions ? true : false
  });

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
        <div className="tag-search-container" {...getComboboxProps()}>
          <input
            {...getInputProps({ controlDispatch: debounce })}
            type="text"
            autoComplete="off"
            className="tag-search-input"
            ref={null}
          />
          {derivedLoaderState ? (
            <span className="tag-search-loader">
              <SearchLoader />
            </span>
          ) : null}
        </div>
        <div className="tag-results-container" {...getPopupProps()}>
          {isOpen && tagSuggestions ? (
            <ul className="tag-results">
              {tagSuggestions.map((tag, index: number) => (
                <li
                  className={
                    highlightedIndex === index ? 'tag-result--focused' : 'tag-result'
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
