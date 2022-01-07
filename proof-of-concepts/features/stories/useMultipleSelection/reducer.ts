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
  const newState = { ...state };
  const currState = { ...state };
  switch (type) {
    case MultipleSelectionStateChangeTypes.NAVIGATION_NEXT: {
      newState.currentSelectedItemIndex = getNextItemIndex(
        MultipleSelectionStateChangeTypes.NAVIGATION_NEXT,
        currState.currentSelectedItemIndex,
        currState.items
      );
      newState.currentSelectedItem =
        newState.items[newState.currentSelectedItemIndex];
      return newState;
    }
    case MultipleSelectionStateChangeTypes.NAVIGATION_PREV: {
      newState.currentSelectedItemIndex = getNextItemIndex(
        MultipleSelectionStateChangeTypes.NAVIGATION_PREV,
        currState.currentSelectedItemIndex,
        currState.items
      );
      newState.currentSelectedItem =
        newState.items[newState.currentSelectedItemIndex];
      return newState;
    }
    case MultipleSelectionStateChangeTypes.DROPDOWN_NAVIGATION_TO_ITEMS: {
      newState.currentSelectedItemIndex = currState.items.length - 1;
      newState.currentSelectedItem =
        currState.items[newState.currentSelectedItemIndex];
      return newState;
    }
    case MultipleSelectionStateChangeTypes.KEYDOWN_CLICK: {
      newState.currentSelectedItemIndex = action.index;
      return newState;
    }
    case MultipleSelectionStateChangeTypes.FUNCTION_ADD_SELECTED_ITEM: {
      newState.items = [...currState.items, action.item];
      return newState;
    }
    case MultipleSelectionStateChangeTypes.KEYDOWN_BACKSPACE: {
      newState.items = [
        ...currState.items.slice(0, action.index),
        ...currState.items.slice(action.index + 1)
      ];
      // check if items still exist
      newState.currentSelectedItemIndex = getNextItemIndex(
        MultipleSelectionStateChangeTypes.KEYDOWN_BACKSPACE,
        currState.currentSelectedItemIndex,
        currState.items,
        newState.items,
        action.index
      );
      newState.currentSelectedItem =
        newState.items[newState.currentSelectedItemIndex];
      return newState;
    }
    case MultipleSelectionStateChangeTypes.FUNCTION_REMOVE_SELECTED_ITEM: {
      const { item: removeItem, itemToString, index } = action;
      const itemToRemove = itemToString(removeItem);
      newState.items = newState.items.filter(
        (curr) => itemToString(curr) !== itemToRemove
      );
      // check if items still exist
      newState.currentSelectedItemIndex = getNextItemIndex(
        MultipleSelectionStateChangeTypes.FUNCTION_REMOVE_SELECTED_ITEM,
        currState.currentSelectedItemIndex,
        currState.items,
        newState.items,
        index
      );
      newState.currentSelectedItem =
        newState.items[newState.currentSelectedItemIndex];
      return newState;
    }
    case MultipleSelectionStateChangeTypes.FUNCTION_SET_CURRENT_INDEX: {
      newState.currentSelectedItemIndex = action.index;
      newState.currentSelectedItem =
        newState.items[newState.currentSelectedItemIndex];
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
