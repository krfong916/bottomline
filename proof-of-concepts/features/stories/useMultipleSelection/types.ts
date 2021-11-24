import { ComponentProps } from '../types';
export type MultipleSelectionProps<Item> = {
  items?: Item[];
  itemToString: (item: Item) => string;
  initialCurrentItems?: Item[];
  initialCurrentSelectedItem?: Item;
  initialCurrentSelectedItemIndex?: number;
  initialHasSelectedItems?: boolean;
  onCurrentItemChange?: (item: Item) => {};
  onHighlightedIndexChange?: (index: number) => {};
  onRemoveSelectedItem?: (itemRemoved: Item) => {};
  onAddSelectedItem?: (itemAdded: Item) => {};
  onSelectedItemsEmpty?: () => {};
} & ComponentProps<
  MultipleSelectionState<Item>,
  MultipleSelectionActionAndChanges<Item>
>;

export type MultipleSelectionState<Item> = {
  currentItems: Item[];
  currentSelectedItem: Item;
  currentSelectedItemIndex: number;
  hasSelectedItems: boolean;
};

export enum MultipleSelectionStateChangeTypes {
  KEYDOWN_ARROW_UP = '[multiple_selection_arrow_up]',
  KEYDOWN_ARROW_DOWN = '[multiple_selection_arrow_down]',
  KEYDOWN_ARROW_LEFT = '[multiple_selection_arrow_left]',
  KEYDOWN_ARROW_RIGHT = '[multiple_selection_arrow_right]',
  KEYDOWN_ENTER = '[multiple_selection_keydown_enter]',
  KEYDOWN_SPACEBAR = '[multiple_selection_keydown_spacebar]',
  KEYDOWN_KEYDOWN_CLICK = '[multiple_selection_keydown_click]',
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
