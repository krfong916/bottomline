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
  let hasSelectedItems = getInitialValue(props, 'hasSelectedItems');
  let currentSelectedItem = getInitialValue(props, 'currentSelectedItem');
  let currentSelectedItemIndex = getInitialValue(props, 'currentSelectedItemIndex');

  currentSelectedItemIndex = computeSelectedIndex<Item>(
    items,
    currentSelectedItemIndex
  ) as Partial<MultipleSelectionState<Item>>;
  // index and item must be in sync
  currentSelectedItem = items[currentSelectedItemIndex];
  hasSelectedItems = items.length > 0 ? true : false;

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
): Partial<MultipleSelectionState<Item>> {
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

function computeSelectedIndex<Item>(items: Item[], index: number): number {
  if (items && items.length > 0) {
    if (index > 0 && index < items.length) return index;
    return 0;
  }

  return initialState.currentSelectedItemIndex;
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
  items: Item[],
  currentIndex: number
): number {
  const end = items.length;
  switch (stateChangeType) {
    case MultipleSelectionStateChangeTypes.NAVIGATION_NEXT: {
      if (currentIndex === end - 1) return -1;
      return currentIndex + 1;
    }
    case MultipleSelectionStateChangeTypes.NAVIGATION_PREV: {
      if (currentIndex === 0) return currentIndex;
      return currentIndex - 1;
    }
    default: {
      return currentIndex;
    }
  }
}
