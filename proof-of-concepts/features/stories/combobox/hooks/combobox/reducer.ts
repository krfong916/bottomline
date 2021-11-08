import { BL } from './types';
import { getNewIndex } from './utils';

export default function bottomlineComboboxReducer(
  state: BL.ComboboxState,
  action: BL.ComboboxAction
): BL.ComboboxState {
  console.log('[REDUCER] state', state);
  console.log('[REDUCER] action:', action);

  const { type, getItemFromIndex, props } = action;
  const { isOpen, highlightedIndex } = state;
  switch (type) {
    case BL.ComboboxActions.INPUT_KEYDOWN_ARROW_UP: {
      return state;
    }
    case BL.ComboboxActions.INPUT_KEYDOWN_ARROW_DOWN: {
      const newState = { ...state };
      const nextIndex = getNewIndex(
        state.highlightedIndex,
        props.items.length,
        BL.ComboboxActions.INPUT_KEYDOWN_ARROW_DOWN
      );
      console.log('[INPUT_KEYDOWN_ARROW_DOWN] nextIndex:', nextIndex);
      newState.highlightedIndex = nextIndex;
      newState.selectedItem = props.items[nextIndex];
      console.log('[INPUT_KEYDOWN_ARROW_DOWN] newstate:', newState);
      return newState;
    }
    case BL.ComboboxActions.INPUT_KEYDOWN_ARROW_LEFT: {
      return state;
    }
    case BL.ComboboxActions.INPUT_KEYDOWN_ARROW_RIGHT: {
      return state;
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
