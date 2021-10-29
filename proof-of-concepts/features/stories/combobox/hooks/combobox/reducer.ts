import { StateChangeTypes } from './stateChangeTypes';
import { ComboboxState } from '../useCombobox';

interface ComboboxAction {
  type: StateChangeTypes;
}

export default function bottomlineComboboxReducer(
  state: ComboboxState,
  action: ComboboxAction
) {
  const { type } = action;
  switch (type) {
    case StateChangeTypes.INPUT_KEYDOWN_ARROW_UP: {
      return state;
    }
    case StateChangeTypes.INPUT_KEYDOWN_ARROW_UP: {
      return state;
    }
    case StateChangeTypes.INPUT_KEYDOWN_ARROW_DOWN: {
      return state;
    }
    case StateChangeTypes.INPUT_KEYDOWN_ARROW_LEFT: {
      return state;
    }
    case StateChangeTypes.INPUT_KEYDOWN_ARROW_RIGHT: {
      return state;
    }
    case StateChangeTypes.INPUT_KEYDOWN_ESCAPE: {
      return state;
    }
    case StateChangeTypes.INPUT_KEYDOWN_ENTER: {
      return state;
    }
    case StateChangeTypes.INPUT_ITEM_CLICK: {
      return state;
    }
    case StateChangeTypes.INPUT_BLUR: {
      return state;
    }
    case StateChangeTypes.FUNCTION_OPEN_POPUP: {
      return state;
    }
    case StateChangeTypes.FUNCTION_CLOSE_POPUP: {
      return state;
    }
    case StateChangeTypes.FUNCTION_SET_HIGHLIGHTED_INDEX: {
      return state;
    }
    case StateChangeTypes.FUNCTION_SELECT_ITEM: {
      return state;
    }
    default:
      throw new TypeError(`Unhandled action: ${action.type} for Tag Editor Reducer`);
  }
}
