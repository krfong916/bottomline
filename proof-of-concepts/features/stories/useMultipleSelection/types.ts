import React from 'react';
import { ComponentProps } from '../types';
export type MultipleSelectionProps<Item> = {
  items?: Item[];
  initialCurrentSelectedItemIndex?: number;
  nextKey?: NavigationKeys;
  prevKey?: NavigationKeys;
  itemToString: (item: Item) => string;
  onCurrentSelectedItemIndexChange?: (index: number) => void;
  onCurrentSelectedItemChange?: (item: Item) => void;
  onItemsChange?: (items: Item[]) => void;
  onHasSelectedItemsChange?: () => void;
} & ComponentProps<
  MultipleSelectionState<Item>,
  MultipleSelectionActionAndChanges<Item>
>;

export enum NavigationKeys {
  ARROW_RIGHT = 'ArrowRight',
  ARROW_LEFT = 'ArrowLeft',
  ARROW_UP = 'ArrowUp',
  ARROW_DOWN = 'ArrowDown'
}

export interface DropdownGetterProps {
  ref?: React.MutableRefObject<any>;
}

export type MultipleSelectionState<Item> = {
  items: Item[];
  currentSelectedItem: Item;
  currentSelectedItemIndex: number;
  hasSelectedItems: boolean;
};

export enum MultipleSelectionStateChangeTypes {
  NAVIGATION_NEXT = '[multiple_selection_next_item]',
  NAVIGATION_PREV = '[multiple_selection_prev_item]',
  DROPDOWN_NAVIGATION_TO_ITEMS = '[multiple_selection_navigate_to_items]',
  KEYDOWN_ENTER = '[multiple_selection_keydown_enter]',
  KEYDOWN_SPACEBAR = '[multiple_selection_keydown_spacebar]',
  KEYDOWN_BACKSPACE = '[multiple_selection_keydown_backspace]',
  KEYDOWN_CLICK = '[multiple_selection_keydown_click]',
  MULTIPLE_SELECTION_GROUP_BLUR = '[multiple_selection_group_blur]',
  MULTIPLE_SELECTION_GROUP_FOCUS = '[multiple_selection_group_focus]',
  FUNCTION_SET_CURRENT_INDEX = '[multiple_selection_set_current_index]',
  FUNCTION_ADD_SELECTED_ITEM = '[multiple_selection_function_add_selected_item]',
  FUNCTION_REMOVE_SELECTED_ITEM = '[multiple_selection_function_remove_selected_item]'
}

export type MultipleSelectionAction<Item> = {
  type: MultipleSelectionStateChangeTypes;
  index?: number;
  item?: Item;
  itemToString?: (item: Item) => string;
};

export type MultipleSelectionActionAndChanges<Item> = {
  changes: MultipleSelectionState<Item>;
  action: MultipleSelectionAction<Item>;
};
