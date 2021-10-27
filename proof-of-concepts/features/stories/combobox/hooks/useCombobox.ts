import * as React from 'react';

interface ComboBoxProps {
  onChange: () => {};
}

type Item = {};

type ComboboxState = {
  currentItem: Item;
  isOpen: boolean;
  currentIndex: number;
};

const initialState = {
  currentItem: null,
  isOpen: false,
  currentIndex: 0
};

export function useCombobox(props: ComboBoxProps) {
  /**
   * ****************
   *
   * Combobox State
   *
   * ****************
   *
   */
  const [state, setState] = React.useState<ComboboxState>(
    getInitialState(props, initialState)
  );

  /**
   * ******
   *
   * Refs
   *
   * ******
   *
   */
  // stores the DOM reference to the input element
  const inputRef = React.useRef(null);
  // stores the DOM reference to the popup box
  const comboboxRef = React.useRef(null);
  // stores the DOM reference to the list of items
  const itemsListRef = React.useRef(null);
  // stores the DOM reference to the current item
  const latestItem = React.useRef(null);

  /**
   * ******
   *
   *
   *
   * ******
   *
   */

  function getItemProps() {}
  function getPopupProps() {}
  function getInputProps() {}
  function getLabelProps() {}

  return {
    getItemProps,
    getPopupProps,
    getInputProps,
    getLabelProps
  };
}

function getInitialState(props: ComboBoxProps, state: ComboboxState): ComboboxState {
  return {
    ...props,
    ...state
  };
}
