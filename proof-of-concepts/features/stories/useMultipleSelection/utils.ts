import {
  MultipleSelectionProps,
  MultipleSelectionState,
  MultipleSelectionStateChangeTypes
} from './types';
import { capitalizeString } from '../utils';

export const initialState = {
  items: [],
  currentSelectedItem: undefined,
  currentSelectedItemIndex: -1,
  hasSelectedItems: false
};

export function computeInitialState<Item>(
  props: MultipleSelectionProps<Item>
): MultipleSelectionState<Item> {
  const items = getInitialValue(props, 'items');
  const hasSelectedItems = items.length > 0 ? true : false;
  let currentSelectedItem = getInitialValue(props, 'currentSelectedItem');
  let currentSelectedItemIndex = getInitialValue(props, 'currentSelectedItemIndex');

  if (currentSelectedItemIndex > -1)
    currentSelectedItem = items[currentSelectedItemIndex];

  return {
    items,
    currentSelectedItem,
    currentSelectedItemIndex,
    hasSelectedItems
  } as MultipleSelectionState<Item>;
}

/**
 * Use the keys of state to get the initial values of properties defined in props
 * Props and State share the same keys.
 */
export function getInitialValue<Item>(
  props: MultipleSelectionProps<Item>,
  propKey: keyof MultipleSelectionState<Item>
): any {
  if (propKey in props) {
    return props[propKey as keyof MultipleSelectionProps<Item>] as Partial<
      MultipleSelectionState<Item>
    >;
  }

  // get the user-provided initial prop state, it is a piece of state
  const initialPropKey = `initial${capitalizeString(
    propKey
  )}` as keyof MultipleSelectionProps<Item>;
  if (initialPropKey in props) {
    // console.log('initialPropKey', initialPropKey);
    // console.log('initialPropKey', props[initialPropKey]);
    return props[initialPropKey] as Partial<MultipleSelectionState<Item>>;
  }

  // return values from statically defined initial state object
  return initialState[propKey] as Partial<MultipleSelectionState<Item>>;
}

export function canNavigateToItems(): boolean {
  const selection = window.getSelection();
  if (selection && selection.isCollapsed && selection.anchorOffset === 0) {
    return true;
  } else {
    return false;
  }
}

export function getNextItemIndex<Item>(
  stateChangeType: MultipleSelectionStateChangeTypes,
  currentSelectedItemIndex: number,
  currentItems: Item[],
  newItems?: Item[],
  index?: number
): number {
  const end = currentItems.length;
  switch (stateChangeType) {
    case MultipleSelectionStateChangeTypes.NAVIGATION_NEXT: {
      // console.log('[NAVIGATION_NEXT] currentSelectedItemIndex: ', currentSelectedItemIndex);
      if (currentSelectedItemIndex === end - 1) return -1;
      return currentSelectedItemIndex + 1;
    }
    case MultipleSelectionStateChangeTypes.NAVIGATION_PREV: {
      // console.log('[NAVIGATION_PREV] currentSelectedItemIndex:', currentSelectedItemIndex);
      if (currentSelectedItemIndex === 0) return currentSelectedItemIndex;
      return currentSelectedItemIndex - 1;
    }
    case MultipleSelectionStateChangeTypes.KEYDOWN_BACKSPACE: {
      // if we are removing the head of the list and there are elements remaining
      if (currentSelectedItemIndex === 0 && index === 0 && newItems.length > 0) {
        return 0;
      }
      // if we are removing the head of the list and the list is empty
      else if (
        currentSelectedItemIndex === 0 &&
        index === 0 &&
        newItems.length === 0
      ) {
        return -1;
      }

      // if we are removing the tail of the list and there are elements remaining
      if (
        currentSelectedItemIndex === currentItems.length - 1 &&
        newItems.length > 0
      ) {
        return newItems.length - 1;
      }
      // if we are removing the tail of the list and the list is empty
      else if (
        currentSelectedItemIndex === currentItems.length - 1 &&
        newItems.length === 0
      ) {
        return -1;
      }
      return currentSelectedItemIndex - 1;
    }
    case MultipleSelectionStateChangeTypes.FUNCTION_REMOVE_SELECTED_ITEM: {
      // if we are removing the head of the list and there are elements remaining
      if (currentSelectedItemIndex === 0 && index === 0 && newItems.length > 0) {
        return 0;
      }
      // if we are removing the head of the list and the list is empty
      else if (
        currentSelectedItemIndex === 0 &&
        index === 0 &&
        newItems.length === 0
      ) {
        return -1;
      } else if (currentSelectedItemIndex === -1) {
        return -1;
      }

      // if we are removing the tail of the list and there are elements remaining
      if (
        currentSelectedItemIndex === currentItems.length - 1 &&
        index === currentItems.length - 1 &&
        newItems.length > 0
      ) {
        return newItems.length - 1;
      }
      // if we are removing the tail of the list and the list is empty
      else if (
        currentSelectedItemIndex === currentItems.length - 1 &&
        index === currentItems.length - 1 &&
        newItems.length === 0
      ) {
        return -1;
      }
      return currentSelectedItemIndex - 1;
    }
    default: {
      return currentSelectedItemIndex;
    }
  }
}
