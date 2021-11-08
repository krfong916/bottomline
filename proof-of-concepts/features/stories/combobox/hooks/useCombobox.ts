import * as React from 'react';
import bottomlineComboboxReducer from './combobox/reducer';
import {
  useElementId,
  normalizeKey,
  useControlledReducer,
  computeInitialState
} from './combobox/utils';
import { BL } from './combobox/types';

export function useCombobox(props: BL.ComboboxProps = {}) {
  /**
   * ****************
   *
   * Combobox State
   *
   * ****************
   *
   */
  const [state, dispatch] = useControlledReducer<
    (state: BL.ComboboxState, action: BL.ComboboxAction) => BL.ComboboxState,
    BL.ComboboxState,
    BL.ComboboxProps,
    BL.ComboBoxStateChangeTypes,
    BL.ComboboxActionAndChanges
  >(bottomlineComboboxReducer, computeInitialState(props), props);
  const { isOpen, highlightedIndex } = state;

  /**
   * ******
   *
   * Refs
   *
   * ******
   * // stores the DOM reference to the label for the combobox
   * // const labelRef = React.useRef<HTMLElement>(null);
   * // stores the DOM reference to the popup box
   * // const popupRef = React.useRef(null);
   * // stores the DOM reference to the current item
   * // const latestItem = React.useRef(null);
   *
   */
  // stores the DOM reference to the input element
  const inputRef = React.useRef<HTMLElement & HTMLInputElement>(null);
  // stores the DOM reference to the list of items
  const itemsListRef = React.useRef<BL.ItemsList>({});

  /**
   * *************************
   *
   * Accessibility Identifiers
   *
   * *************************
   *
   */
  // Returns accessibility identifiers and identifiers for items
  const elementIds = useElementId(props);

  /**
   * *************************
   *
   * Items List (Combobox Items)
   *
   * *************************
   *
   */
  props.items.forEach((item: BL.Item, index: number) => {
    itemsListRef.current[elementIds.getItemId(index)] = item;
  });
  // fetches the item based on the index as argument
  const getItemFromIndex = React.useCallback(
    (index: number) => itemsListRef.current[elementIds.getItemId(index)],
    [elementIds]
  );

  /**
   * ******************
   *
   * Focus Management
   *
   * ******************
   *
   *
   */
  React.useEffect(() => {
    if (inputRef.current && isOpen) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Area of concern: when a combobox receives focus, DOM focus is placed on the textbox element
  const setComboboxFocus = () => {
    if (document.activeElement !== inputRef.current && inputRef.current) {
      inputRef.current.focus();
    }
  };
  // implement: when an item of the popup is box focused, DOM focus remains on thextbox

  /**
   * **************
   *
   * Event Handlers
   *
   * **************
   */
  const inputKeyDownHandlers: { [eventHandler: string]: () => void } = {
    Enter: () => {
      dispatch({
        type: BL.ComboboxActions.INPUT_KEYDOWN_ENTER,
        getItemFromIndex
      });
    },
    Escape: () => {
      dispatch({
        type: BL.ComboboxActions.INPUT_KEYDOWN_ESCAPE,
        getItemFromIndex
      });
    },
    Backspace: () => {
      dispatch({
        type: BL.ComboboxActions.INPUT_KEYDOWN_BACKSPACE,
        getItemFromIndex
      });
    },
    Delete: () => {
      dispatch({
        type: BL.ComboboxActions.INPUT_KEYDOWN_DELETE,
        getItemFromIndex
      });
    },
    ArrowRight: () => {
      dispatch({
        type: BL.ComboboxActions.INPUT_KEYDOWN_ARROW_RIGHT,
        getItemFromIndex
      });
    },
    ArrowLeft: () => {
      dispatch({
        type: BL.ComboboxActions.INPUT_KEYDOWN_ARROW_LEFT,
        getItemFromIndex
      });
    },
    ArrowDown: () => {
      dispatch({
        type: BL.ComboboxActions.INPUT_KEYDOWN_ARROW_DOWN,
        getItemFromIndex
      });
    },
    ArrowUp: () => {
      dispatch({
        type: BL.ComboboxActions.INPUT_KEYDOWN_ARROW_UP,
        getItemFromIndex
      });
    },
    Home: () => {
      dispatch({
        type: BL.ComboboxActions.INPUT_KEYDOWN_HOME,
        getItemFromIndex
      });
    },
    End: () => {
      dispatch({
        type: BL.ComboboxActions.INPUT_KEYDOWN_END,
        getItemFromIndex
      });
    }
  };

  /**
   * **************
   *
   * Prop Getters
   *
   * **************
   *
   * The combobox implements the ARIA 1.1 pattern
   * https://www.w3.org/TR/wai-aria-practices/#wai-aria-roles-states-and-properties-6
   *
   */
  function getLabelProps() {
    return {
      id: elementIds.labelId,
      htmlFor: elementIds.inputId
    };
  }

  /**
   * @param {ComboboxAriaPopup} = {} as ComboboxGetterProps} { ariaPopup }
   *   in the ugliest, most-verbose way possible, we're saying
   *   if the user has defined a specific type of popup, then destructure
   *   otherwise, the user may have not passed any args, so default to an empty object
   */
  function getComboboxProps(
    { ariaPopup }: { ariaPopup?: BL.ComboboxAriaPopup } = {} as BL.ComboboxGetterProps
  ) {
    let ariaHasPopup = ariaPopup ? ariaPopup : ('grid' as BL.ComboboxAriaPopup);
    // Implement: if the combobox has a visible label, the element with role combobox has aria-labelledby
    // set to a value that refers to the labelling element.
    // Otherwise, the combobox element has a label provided by aria-label.
    return {
      role: 'combobox',
      'aria-expanded': isOpen ? true : false,
      'aria-haspopup': ariaHasPopup,
      'aria-labelledby': elementIds.labelId,
      onClick: setComboboxFocus
    };
  }

  function getInputProps() {
    const inputKeyDownHandler = (e: React.KeyboardEvent) => {
      const keyEvt = normalizeKey(e);
      if (keyEvt.name in inputKeyDownHandlers) {
        inputKeyDownHandlers[keyEvt.name]();
      }
    };

    const eventHandlers = {
      onKeyDown: inputKeyDownHandler
    };

    return {
      ref: inputRef,
      role: 'textbox',
      'aria-controls': elementIds.menuId,
      'aria-multiline': false,
      'aria-autocomplete': 'list' as BL.ComboboxAriaAutoComplete,
      // fancy way of saying: assign the id of the item that is stored in the list of items
      // as the aria-activedescendant, otherwise, merge a "null" (false) value
      ...(isOpen &&
        highlightedIndex > -1 && {
          'aria-activedescendant': elementIds.getItemId(highlightedIndex)
        }),
      // event handlers
      ...eventHandlers
    };
  }
  function getPopupProps(
    {
      role,
      ariaLabel
    }: { ariaLabel?: string; role?: string } = {} as BL.ComboboxPopupProps
  ) {
    let popupRole = 'grid';
    if (role) popupRole = role;

    return {
      role: popupRole,
      id: elementIds.menuId,
      'aria-labelledby': elementIds.labelId
    };
  }

  // items are excluded from the tab sequence
  function getItemProps(index: number) {
    const selected = index === highlightedIndex;
    return {
      role: 'gridcell',
      id: elementIds.getItemId(index),
      'aria-selected': selected
    };
  }

  function getGridPopupRowProps() {
    return { role: 'row' };
  }

  return {
    isOpen,
    highlightedIndex,
    // combobox-specific prop getters
    getLabelProps,
    getComboboxProps,
    getInputProps,
    getItemProps,
    getPopupProps,
    // combobox-grid prop getters
    getGridPopupRowProps
  };
}
