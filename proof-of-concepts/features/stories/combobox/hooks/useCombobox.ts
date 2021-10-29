import * as React from 'react';
import bottomlineComboboxReducer from './combobox/reducer';
import { useElementId, generateId } from './combobox/utils';
type Item = {
  name: string;
};

interface ItemToStringFunction {
  (item: Item): string;
}

export interface ComboboxProps {
  items?: Item[];
  itemToString?: ItemToStringFunction;
  initialInputValue?: string;
  initialIsOpen?: boolean;
  onInputChange?: () => string;
  labelId?: string;
  inputId?: string;
  id?: string;
  menuId?: string;
}

interface ItemsListRef {
  [key: string]: Item;
}

export function useCombobox(props: ComboboxProps = {}) {
  /**
   * ****************
   *
   * Combobox State
   *
   * ****************
   *
   */
  const [state, setState] = React.useReducer(
    bottomlineComboboxReducer,
    getInitialState(props)
  );
  const { isOpen, highlightedIndex } = state;

  /**
   * ******
   *
   * Refs
   *
   * ******
   *
   */
  // stores the DOM reference to the input element
  const inputRef = React.useRef<HTMLElement & HTMLInputElement>(null);
  // stores the DOM reference to the label for the combobox
  const labelRef = React.useRef<HTMLElement>(null);
  // stores the DOM reference to the popup box
  const popupRef = React.useRef(null);
  // stores the DOM reference to the list of items
  const itemsListRef = React.useRef<ItemsListRef>({});
  // stores the DOM reference to the current item
  const latestItem = React.useRef(null);

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

  // fetches the item based on the index as argument
  const getItemFromIndex = React.useCallback(
    (index) => itemsListRef.current[elementIds.getItemId(index)],
    [itemsListRef]
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
    if (inputRef.current && state.isOpen) {
      inputRef.current.focus();
    }
  }, [state.isOpen]);

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
    { ariaPopup }: { ariaPopup?: ComboboxAriaPopup } = {} as ComboboxGetterProps
  ) {
    let ariaHasPopup = ariaPopup ? ariaPopup : ('grid' as ComboboxAriaPopup);
    // Implement: if the combobox has a visible label, the element with role combobox has aria-labelledby
    // set to a value that refers to the labelling element.
    // Otherwise, the combobox element has a label provided by aria-label.
    return {
      role: 'combobox',
      ['aria-expanded']: isOpen ? true : false,
      ['aria-haspopup']: ariaHasPopup,
      ['aria-labelledby']: elementIds.labelId,
      onClick: setComboboxFocus
    };
  }

  function getInputProps() {
    // Implement: when a descendant of a grid is focused DOM focus remains on the textbox
    // and the textbox has aria-activedescendant set to a value
    // that refers to the focused element within the popup.
    return {
      ref: inputRef,
      role: 'textbox',
      ['aria-controls']: elementIds.menuId,
      ['aria-multiline']: false,
      ['aria-autocomplete']: 'list' as ComboboxAriaAutoComplete,
      // fancy way of saying: assign the id of the item that is stored in the list of items
      // as the aria-activedescendant, otherwise, merge a "null" (false) value
      ...(isOpen &&
        highlightedIndex > -1 && {
          ['aria-activedescendant']: elementIds.getItemId(highlightedIndex)
        })
    };
  }
  function getPopupProps(
    {
      role,
      ariaLabel
    }: { ariaLabel?: string; role?: string } = {} as ComboboxPopupProps
  ) {
    let popupRole = 'grid';
    if (role) popupRole = role;

    return {
      role: popupRole,
      id: elementIds.menuId,
      ['aria-labelledby']: elementIds.labelId
    };
  }

  // items are excluded from the tab sequence
  function getItemProps(index: number) {
    return {
      role: 'gridcell',
      id: elementIds.getItemId(index),
      ['aria-selected']: `${index === highlightedIndex}`
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

export type ComboboxState = {
  currentItem: null | Item;
  isOpen: boolean;
  highlightedIndex: number;
  inputValue: string;
};

const initialState = {
  currentItem: null,
  isOpen: false,
  highlightedIndex: -1,
  inputValue: ''
};

function getInitialState(props: ComboboxProps): ComboboxState {
  const isOpen = getInitialValue(props, 'isOpen');
  const inputValue = getInitialValue(props, 'inputValue');
  const highlightedIndex = getInitialValue(props, 'highlightedIndex');
  const currentItem = getInitialValue(props, 'currentItem');

  return {
    isOpen,
    inputValue,
    highlightedIndex: isOpen ? (highlightedIndex !== -1 ? highlightedIndex : 0) : -1,
    currentItem
  };
}

function getInitialValue(props: ComboboxProps, propKey: keyof ComboboxState): any {
  // if props contains a key-name that also exists in the state object, word-for-word
  if (propKey in props) {
    return props[propKey as keyof ComboboxProps];
  }

  // get the user-provided initial prop state
  const initialPropKey = `initial${capitalizeString(propKey)}` as keyof ComboboxProps;
  if (props[initialPropKey]) {
    return props[initialPropKey];
  }

  // otherwise, just return the properties initial value that exists in state
  return initialState[propKey as keyof ComboboxState];
}

function capitalizeString(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
export interface ComboboxGetterProps {
  ariaPopup?: ComboboxAriaPopup;
}

export interface ComboboxInputProps {
  ariaAutoComplete?: ComboboxAriaAutoComplete;
}

export type ComboboxAriaAutoComplete = 'none' | 'list' | 'both';

export type ComboboxAriaPopup =
  | boolean
  | 'dialog'
  | 'menu'
  | 'grid'
  | 'false'
  | 'true'
  | 'listbox'
  | 'tree';

export interface ComboboxPopupProps {
  ariaLabel?: string;
  role?: string;
}
