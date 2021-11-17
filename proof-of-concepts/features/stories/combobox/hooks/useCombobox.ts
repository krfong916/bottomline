import * as React from 'react';
import bottomlineComboboxReducer from './reducer';
import {
  useElementId,
  normalizeKey,
  useControlledReducer,
  computeInitialState
} from './utils';
import { BL } from './types';

export function useCombobox<Item>(props: BL.ComboboxProps<Item> = {}) {
  /**
   * ****************
   *
   * Combobox State
   *
   * ****************
   *
   */
  const [state, dispatch] = useControlledReducer<
    (
      state: BL.ComboboxState<Item>,
      action: BL.ComboboxAction<Item>
    ) => BL.ComboboxState<Item>,
    BL.ComboboxState<Item>,
    BL.ComboboxProps<Item>,
    BL.ComboBoxStateChangeTypes,
    BL.ComboboxActionAndChanges<Item>
  >(bottomlineComboboxReducer, computeInitialState<Item>(props), props);
  const { isOpen, highlightedIndex, inputValue } = state;

  React.useEffect(() => {
    console.log('combobox state:', state);
  });

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
  const elementIds = useElementId<Item>(props);

  /**
   * *************************
   *
   * Items List (Combobox Items)
   *
   * *************************
   *
   */
  if (props.items) {
    props.items.forEach((item, index) => {
      itemsListRef.current[elementIds.getItemId(index)] = item;
    });
  }
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

  // here is the area that we need to focus on
  // this is the entry point for handling the change event for the input value
  // I think that we can add a debounce function here as a prop
  // onchange prop will let the user control when the state updates
  function getInputProps(props?: BL.ComboboxInputProps) {
    const inputKeyDownHandler = (e: React.KeyboardEvent) => {
      console.log('[INPUT_KEYDOWN]');
      const keyEvt = normalizeKey(e);
      if (keyEvt.name in inputKeyDownHandlers) {
        inputKeyDownHandlers[keyEvt.name]();
      }
    };

    const inputBlurHandler = (e: React.FocusEvent<HTMLInputElement>) => {
      e.preventDefault();
      console.log('[INPUT_BLUR]');
      dispatch({
        type: BL.ComboboxActions.INPUT_BLUR
      });
    };

    const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.currentTarget.value;
      console.log('current target:', val);
      if (props?.controlDispatch) {
        const fn = () => {
          dispatch({
            type: BL.ComboboxActions.INPUT_VALUE_CHANGE,
            text: val
          });
        };
        props.controlDispatch(fn);
      } else {
        dispatch({
          type: BL.ComboboxActions.INPUT_VALUE_CHANGE,
          text: e.currentTarget.value
        });
      }
    };

    const eventHandlers = {
      onKeyDown: inputKeyDownHandler
    };

    return {
      ref: inputRef,
      onChange: inputChangeHandler,
      onBlur: inputBlurHandler,
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
    const handleClick = () => {
      dispatch({
        type: BL.ComboboxActions.INPUT_ITEM_CLICK,
        getItemFromIndex,
        index
      });
    };

    const selected = index === highlightedIndex;
    return {
      role: 'gridcell',
      id: elementIds.getItemId(index),
      'aria-selected': selected,
      onClick: handleClick
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
