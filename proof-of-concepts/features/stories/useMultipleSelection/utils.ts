import {
  MultipleSelectionProps,
  MultipleSelectionState,
  MultipleSelectionStateChangeTypes
} from './types';
import { capitalizeString } from '../utils';

export const initialState = {
  items: [],
  currentSelectedItem: undefined,
  currentSelectedItemIndex: -1
};

export function computeInitialState<Item>(
  props: MultipleSelectionProps<Item>
): MultipleSelectionState<Item> {
  const items = getInitialValue(props, 'items');
  let currentSelectedItem = getInitialValue(props, 'currentSelectedItem');
  let currentSelectedItemIndex = getInitialValue(props, 'currentSelectedItemIndex');

  if (currentSelectedItemIndex > -1)
    currentSelectedItem = items[currentSelectedItemIndex];

  return {
    items,
    currentSelectedItem,
    currentSelectedItemIndex
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

export function canNavigateToItems(
  e: React.SyntheticEvent<HTMLDivElement, Event>
): boolean {
  const element = e.target as HTMLInputElement;
  console.log('element', element);
  console.log('element value', element.value);
  console.log('element selectionStart', element.selectionStart);
  console.log('element selectionEnd', element.selectionEnd);

  if (
    (element && element.value !== '') ||
    (element.selectionStart !== 0 && element.selectionEnd !== 0)
  ) {
    return false;
  } else {
    return true;
  }
}

export function getNextItemIndex<Item>(
  stateChangeType: MultipleSelectionStateChangeTypes,
  currItemIdx: number,
  currentItems: Item[],
  newItems?: Item[],
  index?: number
): number {
  const end = currentItems.length;
  switch (stateChangeType) {
    case MultipleSelectionStateChangeTypes.NAVIGATION_NEXT: {
      if (currItemIdx === end - 1) return -1;
      return currItemIdx + 1;
    }
    case MultipleSelectionStateChangeTypes.NAVIGATION_PREV: {
      if (currItemIdx === 0) return currItemIdx;
      return currItemIdx - 1;
    }
    case MultipleSelectionStateChangeTypes.KEYDOWN_BACKSPACE: {
      if (isHead(index) && !isEmpty(newItems)) {
        return 0;
      } else if (isHead(index) && isEmpty(newItems)) {
        return -1;
      }

      if (isTail(currItemIdx, currentItems) && !isEmpty(newItems)) {
        return newItems.length - 1;
      } else if (isTail(currItemIdx, currentItems) && isEmpty(newItems)) {
        return -1;
      }

      return currItemIdx - 1;
    }
    case MultipleSelectionStateChangeTypes.FUNCTION_REMOVE_SELECTED_ITEM: {
      if (isHead(index) && !isEmpty(newItems)) {
        return 0;
      } else if (isHead(index) && isEmpty(newItems)) {
        return -1;
        // if the user is not currently focused on a selected item and deletes an item
      } else if (currItemIdx === -1) {
        return -1;
      }

      if (
        isTail(currItemIdx, currentItems) &&
        isTail(index, currentItems) &&
        !isEmpty(newItems)
      ) {
        return newItems.length - 1;
      } else if (
        isTail(currItemIdx, currentItems) &&
        isTail(index, currentItems) &&
        isEmpty(newItems)
      ) {
        return -1;
      }
      return currItemIdx - 1;
    }
    default: {
      return currItemIdx;
    }
  }
}

function isHead(index: number) {
  return index === 0;
}
function isTail(currentIndex: number, itemsList: any[]) {
  return currentIndex === itemsList.length - 1;
}
function isEmpty(itemsList: any[]) {
  return itemsList.length > 0;
}
