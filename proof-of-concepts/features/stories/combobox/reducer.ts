import { ComboboxState, ComboboxAction, ComboboxActions } from './types';
import { getNewIndex, initialState } from './utils';

export default function bottomlineComboboxReducer<Item>(
  state: ComboboxState<Item>,
  action: ComboboxAction<Item>
): ComboboxState<Item> {
  // console.log('[STATE_REDUCER]', action.type);
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
      if (!props || !props.items) return state;
      const newState = { ...state };
      if (newState.highlightedIndex !== -1) {
        newState.selectedItem = props.items[newState.highlightedIndex];
        newState.inputValue = props.itemToString(newState.selectedItem);
      }
      return newState;
    }
    case ComboboxActions.INPUT_VALUE_CHANGE: {
      // does nothing, does not move the input cursor, only when the highlightedIndex is -1
      // combobox can be open
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
    case ComboboxActions.ITEM_CLICK: {
      // select an item, selected item onchange event and highlight index on change
      // console.log('[COMBOBOX_REDUCER]');
      // console.log('action', action);
      // console.log('state', state);

      const newState = { ...state };
      newState.highlightedIndex = index;
      newState.selectedItem = getItemFromIndex(index);
      return newState;
    }
    case ComboboxActions.INPUT_BLUR: {
      // may need props in order to truly reset to initial state
      // and call computeInitialState() from utils
      const newState = { ...initialState };
      newState.inputValue = state.inputValue;
      return initialState;
    }
    default:
      throw new TypeError(`Unhandled action: ${action.type} for Tag Editor Reducer`);
  }
}
