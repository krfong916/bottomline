import {
  MultipleSelectionState,
  MultipleSelectionAction,
  MultipleSelectionStateChangeTypes
} from './types';

export function multipleSelectionReducer<Item>(
  state: MultipleSelectionState<Item>,
  action: MultipleSelectionAction<Item>
) {
  const { type } = action;
  const newState = { ...state };
  switch (type) {
    case MultipleSelectionStateChangeTypes.KEYDOWN_ARROW_UP: {
      return newState;
    }
    case MultipleSelectionStateChangeTypes.KEYDOWN_ARROW_DOWN: {
      return newState;
    }
    case MultipleSelectionStateChangeTypes.KEYDOWN_ARROW_LEFT: {
      return newState;
    }
    case MultipleSelectionStateChangeTypes.KEYDOWN_ARROW_RIGHT: {
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

      return newState;
    }
    case MultipleSelectionStateChangeTypes.FUNCTION_REMOVE_SELECTED_ITEM: {
      if (action.item) return newState;
      const { item } = action;
      newState.currentItems = newState.currentItems.filter(
        (current) => current.name !== item.name
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
