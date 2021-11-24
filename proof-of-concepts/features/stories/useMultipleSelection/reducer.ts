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
  switch (type) {
    case MultipleSelectionStateChangeTypes.KEYDOWN_ARROW_UP: {
      newState.currentSelectedItemIndex = getNextItemIndex(
        MultipleSelectionStateChangeTypes.KEYDOWN_ARROW_UP,
        newState.currentItems,
        newState.currentSelectedItemIndex
      );
      return newState;
    }
    case MultipleSelectionStateChangeTypes.KEYDOWN_ARROW_DOWN: {
      newState.currentSelectedItemIndex = getNextItemIndex(
        MultipleSelectionStateChangeTypes.KEYDOWN_ARROW_DOWN,
        newState.currentItems,
        newState.currentSelectedItemIndex
      );
      return newState;
    }
    case MultipleSelectionStateChangeTypes.KEYDOWN_ARROW_LEFT: {
      newState.currentSelectedItemIndex = getNextItemIndex(
        MultipleSelectionStateChangeTypes.KEYDOWN_ARROW_LEFT,
        newState.currentItems,
        newState.currentSelectedItemIndex
      );
      return newState;
    }
    case MultipleSelectionStateChangeTypes.KEYDOWN_ARROW_RIGHT: {
      newState.currentSelectedItemIndex = getNextItemIndex(
        MultipleSelectionStateChangeTypes.KEYDOWN_ARROW_RIGHT,
        newState.currentItems,
        newState.currentSelectedItemIndex
      );
      return newState;
    }
    case MultipleSelectionStateChangeTypes.KEYDOWN_ENTER: {
      return newState;
    }
    case MultipleSelectionStateChangeTypes.KEYDOWN_SPACEBAR: {
      return newState;
    }
    case MultipleSelectionStateChangeTypes.KEYDOWN_KEYDOWN_CLICK: {
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
      newState.currentItems.push(item);
      return newState;
    }
    case MultipleSelectionStateChangeTypes.FUNCTION_REMOVE_SELECTED_ITEM: {
      if (action.item) return newState;
      const { item } = action;
      newState.currentItems = newState.currentItems.filter(
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
