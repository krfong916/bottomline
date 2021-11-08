import { BL } from './types';
import { getNewIndex } from './utils';

export default function bottomlineComboboxReducer(
  state: BL.ComboboxState,
  action: BL.ComboboxAction
): BL.ComboboxState {
  // console.log('[REDUCER] state', state);
  // console.log('[REDUCER] action:', action);

  const { type, getItemFromIndex, props } = action;
  const { isOpen, highlightedIndex } = state;
  switch (type) {
    case BL.ComboboxActions.INPUT_KEYDOWN_ARROW_UP: {
      const newState = { ...state };
      const nextIndex = getNewIndex(
        state.highlightedIndex,
        props.items.length,
        BL.ComboboxActions.INPUT_KEYDOWN_ARROW_UP
      );
      newState.highlightedIndex = nextIndex;
      if (nextIndex === -1) {
        newState.selectedItem = null;
      } else {
        newState.selectedItem = props.items[nextIndex];
      }
      return newState;
    }
    case BL.ComboboxActions.INPUT_KEYDOWN_ARROW_DOWN: {
      const newState = { ...state };
      const nextIndex = getNewIndex(
        state.highlightedIndex,
        props.items.length,
        BL.ComboboxActions.INPUT_KEYDOWN_ARROW_DOWN
      );
      newState.highlightedIndex = nextIndex;
      newState.selectedItem = props.items[nextIndex];
      return newState;
    }
    case BL.ComboboxActions.INPUT_KEYDOWN_ARROW_LEFT: {
      let newState = { ...state };
      const prevIndex = getNewIndex(
        state.highlightedIndex,
        props.items.length,
        BL.ComboboxActions.INPUT_KEYDOWN_ARROW_LEFT
      );
      newState.highlightedIndex = prevIndex;
      if (prevIndex !== -1) {
        newState.selectedItem = props.items[prevIndex];
      }
      return newState;
    }
    case BL.ComboboxActions.INPUT_KEYDOWN_ARROW_RIGHT: {
      const newState = { ...state };
      const nextIndex = getNewIndex(
        state.highlightedIndex,
        props.items.length,
        BL.ComboboxActions.INPUT_KEYDOWN_ARROW_RIGHT
      );
      newState.highlightedIndex = nextIndex;
      newState.selectedItem = props.items[nextIndex];
      return newState;
    }
    case BL.ComboboxActions.INPUT_KEYDOWN_ESCAPE: {
      return state;
    }
    case BL.ComboboxActions.INPUT_KEYDOWN_ENTER: {
      return state;
    }
    case BL.ComboboxActions.INPUT_KEYDOWN_BACKSPACE: {
      return state;
    }
    case BL.ComboboxActions.INPUT_KEYDOWN_DELETE: {
      return state;
    }
    case BL.ComboboxActions.INPUT_KEYDOWN_HOME: {
      return state;
    }
    case BL.ComboboxActions.INPUT_KEYDOWN_END: {
      return state;
    }
    case BL.ComboboxActions.INPUT_ITEM_CLICK: {
      return state;
    }
    case BL.ComboboxActions.INPUT_BLUR: {
      return state;
    }
    case BL.ComboboxActions.FUNCTION_OPEN_POPUP: {
      return state;
    }
    case BL.ComboboxActions.FUNCTION_CLOSE_POPUP: {
      return state;
    }
    case BL.ComboboxActions.FUNCTION_SET_HIGHLIGHTED_INDEX: {
      return state;
    }
    case BL.ComboboxActions.FUNCTION_SELECT_ITEM: {
      return state;
    }
    default:
      throw new TypeError(`Unhandled action: ${action.type} for Tag Editor Reducer`);
  }
}
