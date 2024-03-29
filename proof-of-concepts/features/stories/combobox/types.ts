import React from 'react';
import { ComponentProps } from '../types';
// Combobox
export type ComboboxProps<Item> = {
  id?: string;
  labelId?: string;
  inputId?: string;
  menuId?: string;
  initialIsOpen?: boolean;
  initialInputValue?: string;
  initialHighlightedIndex?: number;
  selectedItem?: Item;
  items?: Item[];
  itemToString: (item: any) => string;
  onSelectedItemChange?: (changes: Partial<ComboboxState<Item>>) => void;
  onInputValueChange?: (changes: Partial<ComboboxState<string>>) => void;
  onHighightedIndexChange?: (changes: Partial<ComboboxState<number>>) => void;
  onIsOpenChange?: (changes: Partial<ComboboxState<boolean>>) => void;
} & ComponentProps<ComboboxState<Item>, ComboboxActionAndChanges<Item>>;

export type ComboboxState<Item> = {
  isOpen: boolean;
  inputValue: string;
  highlightedIndex: number;
  selectedItem: Item | null;
};

// Prop Getters
export interface ComboboxLabelGetterProps {
  id?: string;
  inputId?: string;
}

export interface ComboboxInputGetterProps<T> {
  controlDispatch?: (...args: any[]) => any;
  ref?: React.MutableRefObject<T>;
  onFocus?: (...args: any[]) => any;
  onBlur?: (...args: any[]) => any;
  onKeyDown?: (...args: any[]) => any;
  ariaDescribedBy: string;
  ariaLabelledBy: string;
}

export interface ComboboxGetterProps {
  ariaLabelledBy: string;
  ariaDescribedBy: string;
  ariaPopup?: ComboboxAriaPopup;
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
  ref?: React.MutableRefObject<any>;
}

// Combobox reducer
export enum ComboboxActions {
  INPUT_KEYDOWN_ARROW_UP = '[input-keydown-arrow-up]',
  INPUT_KEYDOWN_ARROW_DOWN = '[input-keydown-arrow-down]',
  INPUT_KEYDOWN_ARROW_LEFT = '[input-keydown-arrow-left]',
  INPUT_KEYDOWN_ARROW_RIGHT = '[input-keydown-arrow-right]',
  INPUT_KEYDOWN_ESCAPE = '[input-keydown-escape]',
  INPUT_KEYDOWN_DELETE = '[input-keydown-delete]',
  INPUT_KEYDOWN_ENTER = '[input-keydown-enter]',
  INPUT_KEYDOWN_HOME = '[input-keydown-home]',
  INPUT_KEYDOWN_END = '[input-keydown-end]',
  ITEM_CLICK = '[item-click]',
  INPUT_BLUR = '[input-blur]',
  INPUT_VALUE_CHANGE = '[input-value-change]',
  FUNCTION_OPEN_POPUP = '[function-open-popup]',
  FUNCTION_CLOSE_POPUP = '[function-close-popup]',
  FUNCTION_SET_HIGHLIGHTED_INDEX = '[function-set-highlighted-index]',
  FUNCTION_SELECT_ITEM = '[function-select-item]'
}

export type ComboBoxStateChangeTypes = ComboboxActions;

export type ComboboxActionAndChanges<Item> = {
  changes: ComboboxState<Item>;
  action: ComboboxAction<Item>;
};

export interface ComboboxAction<Item> {
  type: ComboBoxStateChangeTypes;
  getItemFromIndex?: (index: number) => any;
  index?: number;
  inputValue?: string;
  props?: ComboboxProps<Item>;
  selectedItem?: boolean;
}
