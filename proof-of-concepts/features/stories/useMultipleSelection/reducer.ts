import {
  MultipleSelectionState,
  MultipleSelectionAction,
  MultipleSelectionStateChangeTypes
} from './types';
import { getNextItemIndex } from './utils';

export function multipleSelectionReducer<Item>(
  state: MultipleSelectionState<Item>,
  action: MultipleSelectionAction<Item>
) {
  const { type } = action;
  let newState = { ...state };
  switch (type) {
    case MultipleSelectionStateChangeTypes.NAVIGATION_NEXT: {
      newState.currentSelectedItemIndex = getNextItemIndex(
        MultipleSelectionStateChangeTypes.NAVIGATION_NEXT,
        newState.items,
        newState.currentSelectedItemIndex
      );
      return newState;
    }
    case MultipleSelectionStateChangeTypes.NAVIGATION_PREV: {
      newState.currentSelectedItemIndex = getNextItemIndex(
        MultipleSelectionStateChangeTypes.NAVIGATION_PREV,
        newState.items,
        newState.currentSelectedItemIndex
      );
      return newState;
    }
    case MultipleSelectionStateChangeTypes.DROPDOWN_NAVIGATION_TO_ITEMS: {
      newState.currentSelectedItemIndex = newState.items.length - 1;
      return newState;
    }
    case MultipleSelectionStateChangeTypes.KEYDOWN_BACKSPACE: {
      const { index } = action;
      newState.items = [
        ...newState.items.slice(0, index),
        ...newState.items.slice(index + 1)
      ];

      // check if items still exist
      if (newState.items.length === 0) newState.hasSelectedItems = false;
      // update index
      newState.currentSelectedItemIndex -= 1;
      return newState;
    }
    case MultipleSelectionStateChangeTypes.KEYDOWN_CLICK: {
      newState.currentSelectedItemIndex = action.index;
      return newState;
    }
    case MultipleSelectionStateChangeTypes.FUNCTION_ADD_SELECTED_ITEM: {
      const { item } = action;
      newState.items = [...newState.items, item];

      return newState;
    }
    case MultipleSelectionStateChangeTypes.FUNCTION_REMOVE_SELECTED_ITEM: {
      const { item, itemToString } = action;
      if (!item) return newState;
      if (!itemToString) return newState;
      // remove item
      const itemToRemove = itemToString(item);
      newState.items = newState.items.filter(
        (current) => itemToString(current) !== itemToRemove
      );
      // check if items still exist
      if (newState.items.length === 0) newState.hasSelectedItems = false;
      // if (newState.currentSelectedItemIndex ===)
      // update index
      newState.currentSelectedItemIndex -= 1;
      return newState;
    }
    case MultipleSelectionStateChangeTypes.KEYDOWN_ENTER: {
      return newState;
    }
    case MultipleSelectionStateChangeTypes.KEYDOWN_SPACEBAR: {
      return newState;
    }
    case MultipleSelectionStateChangeTypes.MULTIPLE_SELECTION_GROUP_BLUR: {
      return newState;
    }
    case MultipleSelectionStateChangeTypes.MULTIPLE_SELECTION_GROUP_FOCUS: {
      return newState;
    }
    default: {
      throw new TypeError(
        `Unhandled action in useMultipleSelection. Received ${type}`
      );
    }
  }
}
