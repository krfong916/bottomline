import { BL } from './types';
import { getNewIndex, initialState } from './utils';

export default function bottomlineComboboxReducer(
  state: BL.ComboboxState,
  action: BL.ComboboxAction
): BL.ComboboxState {
  const { type, getItemFromIndex, props, index, text } = action;
  const { isOpen, highlightedIndex } = state;
  switch (type) {
    case BL.ComboboxActions.INPUT_KEYDOWN_ARROW_UP: {
      if (!props) return state;
      const newState = { ...state };
      const nextIndex = getNewIndex(
        state.highlightedIndex,
        props.items.length,
        BL.ComboboxActions.INPUT_KEYDOWN_ARROW_UP
      );
      newState.highlightedIndex = nextIndex;
      return newState;
    }
    case BL.ComboboxActions.INPUT_KEYDOWN_ARROW_DOWN: {
      if (!props) return state;
      const newState = { ...state };
      const nextIndex = getNewIndex(
        state.highlightedIndex,
        props.items.length,
        BL.ComboboxActions.INPUT_KEYDOWN_ARROW_DOWN
      );
      newState.highlightedIndex = nextIndex;
      return newState;
    }
    case BL.ComboboxActions.INPUT_KEYDOWN_ARROW_LEFT: {
      if (!props) return state;
      let newState = { ...state };
      const prevIndex = getNewIndex(
        state.highlightedIndex,
        props.items.length,
        BL.ComboboxActions.INPUT_KEYDOWN_ARROW_LEFT
      );
      newState.highlightedIndex = prevIndex;
      return newState;
    }
    case BL.ComboboxActions.INPUT_KEYDOWN_ARROW_RIGHT: {
      if (!props) return state;
      const newState = { ...state };
      const nextIndex = getNewIndex(
        state.highlightedIndex,
        props.items.length,
        BL.ComboboxActions.INPUT_KEYDOWN_ARROW_RIGHT
      );
      newState.highlightedIndex = nextIndex;
      return newState;
    }
    case BL.ComboboxActions.INPUT_KEYDOWN_ESCAPE: {
      // close popup, set to initial state
      return initialState;
    }
    case BL.ComboboxActions.INPUT_KEYDOWN_ENTER: {
      // select the item with the highlighted index
      if (!props) return state;
      const newState = { ...state };
      if (newState.highlightedIndex !== -1) {
        newState.selectedItem = props.items[newState.highlightedIndex];
      }
      return newState;
    }
    case BL.ComboboxActions.INPUT_VALUE_CHANGE: {
      // does nothing, does not move the input cursor, only when the highlightedIndex is -1
      // combobox can be open
      const newState = { ...state };
      if (newState.highlightedIndex === -1 && text) {
        newState.inputValue = text;
      }

      return newState;
    }
    case BL.ComboboxActions.INPUT_KEYDOWN_HOME: {
      // only if highlightedIndex >= 0, goes to 0
      const newState = { ...state };
      if (newState.highlightedIndex !== -1) {
        newState.highlightedIndex = 0;
      }
      return newState;
    }
    case BL.ComboboxActions.INPUT_KEYDOWN_END: {
      // only if highlightedIndex >= 0, goes to items.length-1
      if (!props) return state;
      const newState = { ...state };
      if (newState.highlightedIndex !== -1) {
        newState.highlightedIndex = props.items.length - 1;
      }
      return newState;
    }
    case BL.ComboboxActions.INPUT_ITEM_CLICK: {
      // select an item, selected item onchange event and highlight index on change
      const newState = { ...state };
      if (index && getItemFromIndex) {
        newState.highlightedIndex = index;
        newState.selectedItem = getItemFromIndex(index);
      }
      return newState;
    }
    case BL.ComboboxActions.INPUT_BLUR: {
      return initialState;
    }
    // case BL.ComboboxActions.INPUT_KEYDOWN_DELETE: {
    //   // does nothing, does not move the input cursor, only when the highlightedIndex is -1
    //   // combobox can be open
    //   const newState = { ...state };
    //   return newState;
    // }
    // case BL.ComboboxActions.FUNCTION_OPEN_POPUP: {
    //   return state;
    // }
    // case BL.ComboboxActions.FUNCTION_CLOSE_POPUP: {
    //   return state;
    // }
    // case BL.ComboboxActions.FUNCTION_SET_HIGHLIGHTED_INDEX: {
    //   return state;
    // }
    // case BL.ComboboxActions.FUNCTION_SELECT_ITEM: {
    //   return state;
    // }
    default:
      throw new TypeError(`Unhandled action: ${action.type} for Tag Editor Reducer`);
  }
}
