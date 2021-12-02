import React from 'react';
import { render, screen, getAllByRole } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { Tag, TagIcon, TagCloseButton, TagProps } from '../../Tag';
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
} from '../utils';
import { useCombobox } from '../../../combobox/useCombobox';
import { useMultipleSelection } from '../../../useMultipleSelection/useMultipleSelection';
import { useAbortController } from '../../../useAbortController/useAbortController';
import useDebouncedCallback from '../../../useDebounce/src/hooks/useDebouncedCallback';
import useAsync from '../../../useDebounce/src/hooks/useAsync';
import { SearchLoader } from '../../../loader/SearchLoader';
import { UseAsyncStatus, UseAsyncState } from '../../../useDebounce/src/types';
import { NavigationKeys } from '../../../useMultipleSelection/types';
import {
  ComboboxState,
  ComboboxActionAndChanges,
  ComboboxActions
} from '../../../combobox/types';
import { BottomlineTag, BottomlineTags, TagEditorProps } from '../types';
import { AiFillQuestionCircle } from 'react-icons/ai';

const dataTestId = {
  input: 'input-testid',
  popup: 'popup-testid',
  selectedItem: 'selected-item-testid',
  suggestedItem: 'suggested-item-testid'
};

export function renderTagEditor() {
  const onTagCreated = jest.fn(() => true);
  const container = render(<TagEditor onTagCreated={onTagCreated} />);
  const input = screen.getByTestId(dataTestId.input);
  return {
    container,
    input
  };
}

export function getSelectedItem(index: number) {
  const items = screen.getAllByTestId(dataTestId.selectedItem);
  return items[index];
}
export function getAllSelectedItems() {
  return screen.getAllByTestId(dataTestId.selectedItem);
}
export function getPopup() {
  return screen.getByRole('grid');
}
export function getPopupItem(index: number) {
  const items = screen.getAllByTestId(dataTestId.suggestedItem);
  return items[index];
}
export function getPopupItems() {
  return screen.getAllByTestId(dataTestId.suggestedItem);
}

function TagEditor(props: TagEditorProps) {
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
  const inputOnBlur = () => setInputFocused(false);
  let derivedLoaderState = false;
  const inputRef = React.useRef<HTMLInputElement>();
  const cancelDebounceCallback = React.useRef(false);
  const debounce = useDebouncedCallback(
    (dispatch) => {
      if (cancelDebounceCallback.current === false) {
        dispatch();
      } else {
        cancelDebounceCallback.current = false;
      }
    },
    200,
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

  const {
    getSelectedItemProps,
    removeSelectedItem,
    addSelectedItem,
    getDropdownProps,
    currentSelectedItemIndex,
    items
  } = useMultipleSelection<BottomlineTag>({
    // items: presetSelectedItems,
    itemToString: (item: BottomlineTag) => item.name,
    nextKey: NavigationKeys.ARROW_RIGHT,
    prevKey: NavigationKeys.ARROW_LEFT
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
        console.log('[CUSTOM_REDUCER] item click');
        console.log('recommendations', recommendations);
        console.log('actionAndChanges', actionAndChanges);
        inputRef.current.value = '';
        const newTags = { ...selectedTags };
        if (recommendations.selectedItem) {
          newTags[recommendations.selectedItem.name as keyof BottomlineTags] =
            recommendations.selectedItem;
          addSelectedItem(recommendations.selectedItem);
          setSelectedTags(newTags);
        }
        return recommendations;
      }
      case ComboboxActions.INPUT_BLUR: {
        // forceAbort();
        // recommendations.inputValue = state.inputValue;
        return recommendations;
      }
      case ComboboxActions.INPUT_VALUE_CHANGE: {
        if (action.inputValue === '' && changes.inputValue !== '') {
          recommendations.isOpen = false;
          setTagSuggestions(undefined);
        }
        recommendations.inputValue = action.inputValue;
        return recommendations;
      }
      case ComboboxActions.INPUT_KEYDOWN_ENTER: {
        cancelDebounceCallback.current = true;
        inputRef.current.value = '';
        const newTags = { ...selectedTags };
        const value = inputRef.current.value;
        const newSelectedItem = {
          name: value
        };
        newTags[newSelectedItem.name] = newSelectedItem;
        addSelectedItem(newSelectedItem);
        setSelectedTags(newTags);
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
      prevInput.current = input;
      setInput(changes as string);
    },
    stateReducer,
    items: tagSuggestions,
    initialIsOpen: tagSuggestions ? true : false
  });

  const noResultsFound = isOpen && tagSuggestions && tagSuggestions.length == 0;
  const resultsFound = isOpen && tagSuggestions && tagSuggestions.length >= 1;

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
                const active = currentSelectedItemIndex === index ? true : false;
                return (
                  <li
                    data-testid={dataTestId.selectedItem}
                    className="selected-tag"
                    key={key}
                    {...getSelectedItemProps(tag, index)}
                  >
                    <Tag
                      size="small"
                      type={active ? 'solid' : 'outlined'}
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
              onBlur: inputOnBlur,
              ...getDropdownProps({ ref: inputRef })
            })}
            data-testid={dataTestId.input}
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
        <div
          className="tag-results-container"
          {...getPopupProps()}
          data-testid={dataTestId.popup}
        >
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
                    data-testid={dataTestId.suggestedItem}
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
}
