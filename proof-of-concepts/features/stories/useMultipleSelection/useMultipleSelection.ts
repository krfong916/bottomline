import React from 'react';
import { multipleSelectionReducer } from './reducer';
import { computeInitialState, canNavigateToItems } from './utils';
import { normalizeKey, useControlledReducer, mergeRefs } from '../utils';
import {
  MultipleSelectionProps,
  MultipleSelectionState,
  MultipleSelectionAction,
  MultipleSelectionStateChangeTypes,
  MultipleSelectionActionAndChanges,
  DropdownGetterProps,
  NavigationKeys
} from './types';
import { ItemsList } from '../types';

export function useMultipleSelection<Item>(props: MultipleSelectionProps<Item>) {
  const [state, dispatch] = useControlledReducer<
    (
      state: MultipleSelectionState<Item>,
      action: MultipleSelectionAction<Item>
    ) => MultipleSelectionState<Item>,
    MultipleSelectionState<Item>,
    MultipleSelectionProps<Item>,
    MultipleSelectionStateChangeTypes,
    MultipleSelectionActionAndChanges<Item>
  >(multipleSelectionReducer, computeInitialState<Item>(props), props);
  const { items, currentSelectedItem, currentSelectedItemIndex } = state;
  const hasSelectedItems = items.length > 0;
  const {
    nextKey = NavigationKeys.ARROW_LEFT,
    prevKey = NavigationKeys.ARROW_RIGHT
  } = props;
  const dropdownRef = React.useRef<HTMLElement & HTMLInputElement>();
  const currentSelectedItemsRef = React.useRef<HTMLElement[]>();
  // reinitializes array on every re-render to "gc" unmounted components
  currentSelectedItemsRef.current = [];

  React.useEffect(() => {
    if (currentSelectedItemIndex === -1 && dropdownRef.current) {
      dropdownRef.current.focus();
    } else if (
      currentSelectedItemIndex >= 0 &&
      currentSelectedItemsRef.current &&
      currentSelectedItemsRef.current[currentSelectedItemIndex]
    ) {
      currentSelectedItemsRef.current[currentSelectedItemIndex].focus();
    }
  }, [currentSelectedItemIndex, currentSelectedItem]);

  const itemsList = React.useRef<ItemsList>({});
  if (props.items) {
    props.items.forEach((item) => itemsList.current[props.itemToString(item)]);
  }

  const itemKeydownHandlers: {
    [eventHandler: string]: (e: React.KeyboardEvent, index: number) => void;
  } = {
    [nextKey]: () => {
      dispatch({
        type: MultipleSelectionStateChangeTypes.NAVIGATION_NEXT
      });
    },
    [prevKey]: () => {
      dispatch({
        type: MultipleSelectionStateChangeTypes.NAVIGATION_PREV
      });
    },
    Enter: (e: React.KeyboardEvent) => {
      dispatch({
        type: MultipleSelectionStateChangeTypes.KEYDOWN_ENTER
      });
    },
    Spacebar: (e: React.KeyboardEvent) => {
      dispatch({
        type: MultipleSelectionStateChangeTypes.KEYDOWN_SPACEBAR
      });
    },
    Backspace: (e: React.KeyboardEvent, index: number) => {
      dispatch({
        type: MultipleSelectionStateChangeTypes.KEYDOWN_BACKSPACE,
        index
      });
    }
  };

  const dropdownKeydownHandlers: {
    [eventHandler: string]: (e: React.KeyboardEvent) => void;
  } = {
    [prevKey]: (e: React.KeyboardEvent) => {
      // e.stopPropagation();
      if (canNavigateToItems(e)) {
        dispatch({
          type: MultipleSelectionStateChangeTypes.DROPDOWN_NAVIGATION_TO_ITEMS
        });
      }
    }
  };

  function getDropdownProps({ ref = null, ...rest }: DropdownGetterProps) {
    const handleKeydown = (e: React.KeyboardEvent) => {
      const { name: keyName } = normalizeKey(e);
      if (keyName in dropdownKeydownHandlers) {
        dropdownKeydownHandlers[keyName](e);
      }
    };
    return {
      ref: mergeRefs(ref, dropdownRef),
      onKeyDown: handleKeydown,
      ...rest
    };
  }

  function getSelectedItemProps(selectedItem: Item, index: number) {
    const handleKeydown = (e: React.KeyboardEvent) => {
      const { name: keyName } = normalizeKey(e);
      if (keyName in itemKeydownHandlers) {
        itemKeydownHandlers[keyName](e, index);
      }
    };

    const handleClick = (e: React.KeyboardEvent) => {
      e.stopPropagation();
      dispatch({
        type: MultipleSelectionStateChangeTypes.KEYDOWN_CLICK,
        index
      });
    };

    return {
      tabIndex: index === currentSelectedItemIndex ? 0 : -1,
      onClick: handleClick,
      onKeyDown: handleKeydown,
      ref: mergeRefs((node) => {
        if (node) currentSelectedItemsRef.current.push(node);
      })
    };
  }

  const removeSelectedItem = React.useCallback((item: Item, index: number) => {
    dispatch({
      type: MultipleSelectionStateChangeTypes.FUNCTION_REMOVE_SELECTED_ITEM,
      item,
      itemToString: props.itemToString,
      index
    });
  }, []);

  const addSelectedItem = React.useCallback((item: Item) => {
    dispatch({
      type: MultipleSelectionStateChangeTypes.FUNCTION_ADD_SELECTED_ITEM,
      item
    });
  }, []);

  const setCurrentIndex = React.useCallback((index: number) => {
    dispatch({
      type: MultipleSelectionStateChangeTypes.FUNCTION_SET_CURRENT_INDEX,
      index
    });
  }, []);

  return {
    // state
    items,
    currentSelectedItem,
    currentSelectedItemIndex,
    hasSelectedItems,
    // functions
    removeSelectedItem,
    addSelectedItem,
    setCurrentIndex,
    // prop-getters
    getSelectedItemProps,
    getDropdownProps
  };
}
