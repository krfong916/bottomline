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
  console.log(type);
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
      return newState;
    }
    case MultipleSelectionStateChangeTypes.KEYDOWN_BACKSPACE: {
      const { index } = action;

      newState.items = [
        ...currState.items.slice(0, index),
        ...currState.items.slice(index + 1)
      ];

      // check if items still exist
      if (newState.items.length === 0) newState.hasSelectedItems = false;

      newState.currentSelectedItemIndex = getNextItemIndex(
        MultipleSelectionStateChangeTypes.KEYDOWN_BACKSPACE,
        currState.currentSelectedItemIndex,
        currState.items,
        newState.items,
        index
      );

      newState.currentSelectedItem =
        newState.items[newState.currentSelectedItemIndex];

      return newState;
    }
    case MultipleSelectionStateChangeTypes.KEYDOWN_CLICK: {
      console.log('[USE_MULTIPLE_SELECTION_REDUCER] keydown click');
      console.log('state', state);
      console.log('action', action);
      newState.currentSelectedItemIndex = action.index;
      return newState;
    }
    case MultipleSelectionStateChangeTypes.FUNCTION_ADD_SELECTED_ITEM: {
      const { item } = action;
      newState.items = [...currState.items, item];
      if (currState.items.length === 0 && newState.items.length > 0) {
        newState.hasSelectedItems = true;
      }
      return newState;
    }
    case MultipleSelectionStateChangeTypes.FUNCTION_REMOVE_SELECTED_ITEM: {
      const { item, itemToString, index } = action;

      const itemToRemove = itemToString(item);
      newState.items = newState.items.filter(
        (curr) => itemToString(curr) !== itemToRemove
      );
      // check if items still exist
      if (newState.items.length === 0) newState.hasSelectedItems = false;

      newState.currentSelectedItemIndex = getNextItemIndex(
        MultipleSelectionStateChangeTypes.FUNCTION_REMOVE_SELECTED_ITEM,
        currState.currentSelectedItemIndex,
        currState.items,
        newState.items,
        index
      );

      newState.currentSelectedItem =
        newState.items[newState.currentSelectedItemIndex];
      console.log('[USE_MULTIPLE_SELECTION_REDUCER] remove item', newState);
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
