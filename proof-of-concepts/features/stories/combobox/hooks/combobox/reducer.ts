import { StateChangeTypes } from './stateChangeTypes';

export default function bottomlineComboboxReducer(state, action) {
  const { type } = action;
  switch (type) {
    case StateChangeTypes.INPUT_KEYDOWN_ARROW_UP: {
    }
    case StateChangeTypes.INPUT_KEYDOWN_ARROW_UP: {
    }
    case StateChangeTypes.INPUT_KEYDOWN_ARROW_DOWN: {
    }
    case StateChangeTypes.INPUT_KEYDOWN_ARROW_LEFT: {
    }
    case StateChangeTypes.INPUT_KEYDOWN_ARROW_RIGHT: {
    }
    case StateChangeTypes.INPUT_KEYDOWN_ESCAPE: {
    }
    case StateChangeTypes.INPUT_KEYDOWN_ENTER: {
    }
    case StateChangeTypes.INPUT_ITEM_CLICK: {
    }
    case StateChangeTypes.INPUT_BLUR: {
    }
    case StateChangeTypes.FUNCTION_OPEN_POPUP: {
    }
    case StateChangeTypes.FUNCTION_CLOSE_POPUP: {
    }
    case StateChangeTypes.FUNCTION_SET_HIGHLIGHTED_INDEX: {
    }
    case StateChangeTypes.FUNCTION_SELECT_ITEM: {
    }
    default:
      throw new TypeError(`Unhandled action: ${action.type} for Tag Editor Reducer`);
  }
}
