import { ComboboxState, ComboboxAction, ComboboxActions } from './types';
import { getNewIndex, initialState } from './utils';

export default function bottomlineComboboxReducer<Item>(
  state: ComboboxState<Item>,
  action: ComboboxAction<Item>
): ComboboxState<Item> {
  const { type, getItemFromIndex, props, index, inputValue } = action;
  const { isOpen, highlightedIndex } = state;
  switch (type) {
    case ComboboxActions.INPUT_KEYDOWN_ARROW_UP: {
      if (!props || !props.items) return state;
      const newState = { ...state };
      const nextIndex = getNewIndex(
        state.highlightedIndex,
        props.items.length,
        ComboboxActions.INPUT_KEYDOWN_ARROW_UP
      );
      newState.highlightedIndex = nextIndex;
      return newState;
    }
    case ComboboxActions.INPUT_KEYDOWN_ARROW_DOWN: {
      if (!props || !props.items) return state;
      const newState = { ...state };
      const nextIndex = getNewIndex(
        state.highlightedIndex,
        props.items.length,
        ComboboxActions.INPUT_KEYDOWN_ARROW_DOWN
      );
      newState.highlightedIndex = nextIndex;
      return newState;
    }
    case ComboboxActions.INPUT_KEYDOWN_ARROW_LEFT: {
      if (!props || !props.items) return state;
      let newState = { ...state };
      const prevIndex = getNewIndex(
        state.highlightedIndex,
        props.items.length,
        ComboboxActions.INPUT_KEYDOWN_ARROW_LEFT
      );
      newState.highlightedIndex = prevIndex;
      return newState;
    }
    case ComboboxActions.INPUT_KEYDOWN_ARROW_RIGHT: {
      if (!props || !props.items) return state;
      const newState = { ...state };
      const nextIndex = getNewIndex(
        state.highlightedIndex,
        props.items.length,
        ComboboxActions.INPUT_KEYDOWN_ARROW_RIGHT
      );
      newState.highlightedIndex = nextIndex;
      return newState;
    }
    case ComboboxActions.INPUT_KEYDOWN_ESCAPE: {
      // close popup, set to initial state
      return initialState;
    }
    case ComboboxActions.INPUT_KEYDOWN_ENTER: {
      // select the item with the highlighted index
      console.log('[COMBOBOX_ACTION] state:', state);
      console.log('[COMBOBOX_ACTION] action:', action);
      if (!props || !props.items) return state;
      const newState = { ...state };
      if (newState.highlightedIndex !== -1) {
        newState.selectedItem = props.items[newState.highlightedIndex];
      }
      return newState;
    }
    case ComboboxActions.INPUT_VALUE_CHANGE: {
      // does nothing, does not move the input cursor, only when the highlightedIndex is -1
      // combobox can be open
      console.log('[INPUT_VALUE_CHANGE]');
      const newState = { ...state };
      if (newState.highlightedIndex === -1 && inputValue) {
        newState.inputValue = inputValue;
      }
      newState.isOpen = true;

      return newState;
    }
    case ComboboxActions.INPUT_KEYDOWN_HOME: {
      // only if highlightedIndex >= 0, goes to 0
      const newState = { ...state };
      if (newState.highlightedIndex !== -1) {
        newState.highlightedIndex = 0;
      }
      return newState;
    }
    case ComboboxActions.INPUT_KEYDOWN_END: {
      // only if highlightedIndex >= 0, goes to items.length-1
      if (!props || !props.items) return state;
      const newState = { ...state };
      if (newState.highlightedIndex !== -1) {
        newState.highlightedIndex = props.items.length - 1;
      }
      return newState;
    }
    case ComboboxActions.INPUT_ITEM_CLICK: {
      // select an item, selected item onchange event and highlight index on change
      const newState = { ...state };
      if (index && getItemFromIndex) {
        newState.highlightedIndex = index;
        newState.selectedItem = getItemFromIndex(index);
      }
      return newState;
    }
    case ComboboxActions.INPUT_BLUR: {
      return initialState;
    }
    default:
      throw new TypeError(`Unhandled action: ${action.type} for Tag Editor Reducer`);
  }
}
