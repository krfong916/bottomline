import React from 'react';
import { ComboboxProps, ComboboxState, ComboboxActions } from './types';
import { ComponentProps } from '../types';
import { capitalizeString, generateId } from '../utils';
export const initialState = {
  selectedItem: null,
  isOpen: false,
  highlightedIndex: -1,
  inputValue: ''
};

export function computeInitialState<Item>(
  props: ComboboxProps<Item>
): ComboboxState<Item> {
  const isOpen = getInitialValue(props, 'isOpen');
  const inputValue = getInitialValue(props, 'inputValue');
  const selectedItem = getInitialValue(props, 'selectedItem');
  let highlightedIndex = getInitialValue(props, 'highlightedIndex');
  // console.log('[COMPUTE_INITIAL_STATE]:highlightedIndex', highlightedIndex);
  // console.log('items length:', props.items.length - 1);
  if (props.items && highlightedIndex > props.items.length - 1) {
    highlightedIndex = -1 as Partial<ComboboxState<Item>>;
  }
  return {
    isOpen,
    inputValue,
    highlightedIndex,
    selectedItem
  } as ComboboxState<Item>;
}

/**
 * Use the keys of state to get the initial values of properties defined in props
 * Props and State share the same keys.
 */
export function getInitialValue<Item>(
  props: ComboboxProps<Item>,
  propKey: keyof ComboboxState<Item>
): Partial<ComboboxState<Item>> {
  if (propKey in props) {
    return props[propKey as keyof ComboboxProps<Item>] as Partial<
      ComboboxState<Item>
    >;
  }

  // get the user-provided initial prop state, it is a piece of state
  const initialPropKey = `initial${capitalizeString(propKey)}` as keyof ComboboxProps<
    Item
  >;
  if (initialPropKey in props) {
    // console.log('initialPropKey', initialPropKey);
    // console.log('initialPropKey', props[initialPropKey]);
    return props[initialPropKey] as Partial<ComboboxState<Item>>;
  }

  // return values from statically defined initial state object
  return initialState[propKey] as Partial<ComboboxState<Item>>;
}

/**
 * Generates unique ids for the combobox component to avoid naming conflicts w/ other ids
 */
export function useElementId<Item>({
  id = `bottomline-${generateId()}`,
  labelId,
  inputId,
  menuId
}: Partial<ComboboxProps<Item>>) {
  const elementIds = React.useRef({
    id,
    labelId: labelId || `${id}-label`,
    inputId: inputId || `${id}-input`,
    menuId: menuId || `${id}-menu`,
    // computes id relative to other indices of items
    getItemId: (index: number) => `${id}-item-${index}`
  });
  return elementIds.current;
}

export function getNewIndex(
  currentIndex: number,
  length: number,
  action: ComboboxActions
): number {
  switch (action) {
    case ComboboxActions.INPUT_KEYDOWN_ARROW_DOWN: {
      if (currentIndex === length - 1) return currentIndex;
      return currentIndex + 1;
    }
    case ComboboxActions.INPUT_KEYDOWN_ARROW_UP: {
      if (currentIndex === -1) return currentIndex;
      return currentIndex - 1;
    }
    case ComboboxActions.INPUT_KEYDOWN_ARROW_LEFT: {
      if (currentIndex === -1 || currentIndex === 0) return currentIndex;
      return currentIndex - 1;
    }
    case ComboboxActions.INPUT_KEYDOWN_ARROW_RIGHT: {
      if (currentIndex === length - 1 || currentIndex === -1) return currentIndex;
      return currentIndex + 1;
    }
    default:
      return 0;
  }
}
