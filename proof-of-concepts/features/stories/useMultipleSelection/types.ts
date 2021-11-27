import React from 'react';
import { ComponentProps } from '../types';
export type MultipleSelectionProps<Item> = {
  items?: Item[];
  initialCurrentIndex?: number;
  nextKey?: NavigationKeys;
  prevKey?: NavigationKeys;
  itemToString: (item: Item) => string;
  onCurrentItemChange?: (item: Item) => {};
  onCurrentIndexChange?: (index: number) => {};
  onRemoveSelectedItem?: (itemRemoved: Item) => {};
  onAddSelectedItem?: (itemAdded: Item) => {};
  onSelectedItemsEmpty?: () => {};
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
  KEYDOWN_CLICK = '[multiple_selection_keydown_click]',
  MULTIPLE_SELECTION_GROUP_BLUR = '[multiple_selection_group_blur]',
  MULTIPLE_SELECTION_GROUP_FOCUS = '[multiple_selection_group_focus]',
  FUNCTION_ADD_SELECTED_ITEM = '[multiple_selection_function_add_seletected_item]',
  FUNCTION_REMOVE_SELECTED_ITEM = '[multiple_selection_function_remove_seletected_item]'
}

export type MultipleSelectionAction<Item> = {
  type: MultipleSelectionStateChangeTypes;
  item?: Partial<MultipleSelectionState<Item>>;
};

export type MultipleSelectionActionAndChanges<Item> = {
  changes: MultipleSelectionState<Item>;
  action: MultipleSelectionAction<Item>;
};
