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
  // console.log('state before update:', newState);
  switch (type) {
    case MultipleSelectionStateChangeTypes.NAVIGATION_NEXT: {
      newState.currentSelectedItemIndex = getNextItemIndex(
        MultipleSelectionStateChangeTypes.NAVIGATION_NEXT,
        newState.items,
        newState.currentSelectedItemIndex
      );
      // console.log('[REDUCER] next:', newState);
      return newState;
    }
    case MultipleSelectionStateChangeTypes.NAVIGATION_PREV: {
      newState.currentSelectedItemIndex = getNextItemIndex(
        MultipleSelectionStateChangeTypes.NAVIGATION_PREV,
        newState.items,
        newState.currentSelectedItemIndex
      );
      // console.log('[REDUCER] prev:', newState);
      return newState;
    }
    case MultipleSelectionStateChangeTypes.DROPDOWN_NAVIGATION_TO_ITEMS: {
      console.log('[REDUCER] navigating...');
      newState.currentSelectedItemIndex = newState.items.length - 1;
      return newState;
    }
    case MultipleSelectionStateChangeTypes.KEYDOWN_ENTER: {
      return newState;
    }
    case MultipleSelectionStateChangeTypes.KEYDOWN_SPACEBAR: {
      return newState;
    }
    case MultipleSelectionStateChangeTypes.KEYDOWN_CLICK: {
      return newState;
    }
    case MultipleSelectionStateChangeTypes.MULTIPLE_SELECTION_GROUP_BLUR: {
      return newState;
    }
    case MultipleSelectionStateChangeTypes.MULTIPLE_SELECTION_GROUP_FOCUS: {
      return newState;
    }
    case MultipleSelectionStateChangeTypes.FUNCTION_ADD_SELECTED_ITEM: {
      if (action.item) return newState;
      const { item } = action;
      newState.items.push(item);
      return newState;
    }
    case MultipleSelectionStateChangeTypes.FUNCTION_REMOVE_SELECTED_ITEM: {
      if (action.item) return newState;
      const { item } = action;
      newState.items = newState.items.filter(
        (current) => itemToString(current) !== itemToString(item)
      );
      return newState;
    }
    default: {
      throw new TypeError(
        `Unhandled action in useMultipleSelection. Received ${type}`
      );
    }
  }
}
