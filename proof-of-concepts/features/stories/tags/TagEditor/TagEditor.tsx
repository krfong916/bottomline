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
import { UseAsyncStatus } from '../../useDebounce/src/types';
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
  const [tagSuggestions, setTagSuggestions] = React.useState({ data: null });
  const [duplicateTagAlert, setDuplicateTagAlert] = React.useState('');

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

  const debounce = useDebouncedCallback(
    (dispatch) => {
      console.log('dispatch:', dispatch);
      dispatch();
    },
    2000,
    { trailing: true }
  );

  const fetchTagResults = useAsync(
    () => {
      if (input && input !== '') {
        return fetchTags(input);
      }
    },
    { status: UseAsyncStatus.IDLE },
    [input]
  );

  const { data: tags, error, status } = fetchTagResults;
  if (status === UseAsyncStatus.IDLE) {
    console.log('we are idle');
  } else if (status === UseAsyncStatus.PENDING) {
    console.log('we are pending');
    // set the loader
  } else if (status === UseAsyncStatus.RESOLVED) {
    console.log('we are resolved');
    console.log(tags);
    // unset the loader
    // no results found
  } else {
    console.log('we are rejected');
    console.log(error);
    // keep the loader don't do anything with the error
  }

  return (
    <section className="tag-editor-section">
      <div className="tag-editor">
        <div className="tag-header-container">
          <span
            className="tag-header-title"
            {...getLabelProps({ id: 'tagInputDescription' })}
          >
            Add up to 5 (five) tags to describe what your question is about
          </span>
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
        {duplicateTagAlert ? <p role="alert">{duplicateTagAlert}</p> : null}
        <div className="tag-search-container">
          <input
            {...getInputProps({ controlDispatch: debounce })}
            type="text"
            autoComplete="off"
            className="tag-search-input"
            aria-describedby="tagInputDescription"
            ref={null}
          />
          <span className="tag-search-loader">loader</span>
        </div>
        <div className="tag-results-container">
          <ul className="tag-results">
            <li className="tag-result">
              <div className="tag-result-info">
                <span className="tag-result-header">
                  <Tag className="tag-name" size="small" text="material-analysis" />
                  <span className="tag-result-count">{5}</span>
                  <AiFillQuestionCircle size="1rem" className="tag-result-details" />
                </span>
              </div>
              <p className="tag-result-excerpt">
                Lorem ipsum dolor sit, amet consectetur, adipisicing elit. Qui
              </p>
            </li>
            <li className="tag-result">
              <div className="tag-result-info">
                <span className="tag-result-header">
                  <Tag className="tag-result" size="small" text="material-max" />
                  <span className="tag-result-count">{5}</span>
                  <AiFillQuestionCircle size="1rem" className="tag-result-details" />
                </span>
              </div>
              <p className="tag-result-excerpt">
                Lorem ipsum dolor sit, amet consectetur, adipisicing elit. Qui
                expedita ratione,
              </p>
            </li>
            <li className="tag-result">
              <span className="tag-result-header">
                <Tag className="tag-result" size="small" text="analysis" />
                <span className="tag-result-count">{5}</span>
                <AiFillQuestionCircle size="1rem" className="tag-result-details" />
              </span>

              <p className="tag-result-excerpt">
                Lorem ipsum dolor sit, amet consectetur, adipisicing elit. Qui
                expedita ratione, consectetur sint quibusdam placeat, beatae iusto
                ipsum perspiciatis consequuntur cupiditate omnis voluptatibus
                mollitia, fuga odio porro id praesentium. Dolore! Esse sunt,
                recusandae architecto praesentium consequuntur. Iusto quas odit
                pariatur fugiat ducimus itaque ad, natus dolore necessitatibus placeat
                corporis, sint voluptas ea impedit. Sit quasi, voluptas, blanditiis
                ullam fuga expedita? Accusamus distinctio praesentium deleniti saepe
                eum magnam et aperiam, dolorum voluptatem voluptates. Voluptate
                excepturi ipsa laudantium fugiat ex repellat magnam dolorum in.
                Dolores veritatis molestias saepe, nemo non molestiae repudiandae.
              </p>
            </li>
            <li className="tag-result">
              <div className="tag-result-info">
                <span className="tag-result-header">
                  <Tag className="tag-result" size="small" text="material" />
                  <span className="tag-result-count">{5}</span>
                  <AiFillQuestionCircle size="1rem" className="tag-result-details" />
                </span>
              </div>
              <p className="tag-result-excerpt">Lorem</p>
            </li>
          </ul>
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
