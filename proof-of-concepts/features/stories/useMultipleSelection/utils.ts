import {
  MultipleSelectionProps,
  MultipleSelectionState,
  MultipleSelectionStateChangeTypes
} from './types';
import { capitalizeString } from '../utils';

export const initialState = {
  currentItems: [],
  currentSelectedItem: undefined,
  currentSelectedItemIndex: -1,
  hasSelectedItems: false
};

export function computeInitialState<Item>(
  props: MultipleSelectionProps<Item>
): MultipleSelectionState<Item> {
  const currentItems = getInitialValue(props, 'currentItems');
  const currentSelectedItem = getInitialValue(props, 'currentSelectedItem');
  const hasSelectedItems = getInitialValue(props, 'hasSelectedItems');
  let currentSelectedItemIndex = getInitialValue(props, 'currentSelectedItemIndex');

  // an ugly way of saying: hey, if the user has provided an empty list of items
  // then the current selected item index can't be defined
  // otherwise assign the correct index
  currentSelectedItemIndex =
    props.items && props.items.length > 0
      ? currentSelectedItemIndex === -1
        ? (0 as Partial<MultipleSelectionState<Item>>)
        : currentSelectedItemIndex
      : (initialState.currentSelectedItemIndex as Partial<
          MultipleSelectionState<Item>
        >);

  return {
    currentItems,
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

export function getNextItemIndex<Item>(
  stateChangeType: MultipleSelectionStateChangeTypes,
  items: Item[],
  currentIndex: number
): number {
  const end = items.length;
  switch (stateChangeType) {
    case MultipleSelectionStateChangeTypes.KEYDOWN_ARROW_UP: {
      if (currentIndex == end - 1) return currentIndex;
      return currentIndex + 1;
    }
    case MultipleSelectionStateChangeTypes.KEYDOWN_ARROW_DOWN: {
      if (currentIndex >= -1) return currentIndex;
      return currentIndex - 1;
    }
    case MultipleSelectionStateChangeTypes.KEYDOWN_ARROW_LEFT: {
      if (currentIndex == end - 1) return currentIndex;
      return currentIndex + 1;
    }
    case MultipleSelectionStateChangeTypes.KEYDOWN_ARROW_RIGHT: {
      if (currentIndex >= -1) return currentIndex;
      return currentIndex - 1;
    }
    default: {
      return currentIndex;
    }
  }
}
