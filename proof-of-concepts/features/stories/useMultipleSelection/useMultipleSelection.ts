import React from 'react';
import { multipleSelectionReducer } from './reducer';
import { computeInitialState, canNavigateToItems } from './utils';
import {
  normalizeKey,
  useControlledReducer,
  mergeRefs,
  callAllEventHandlers,
  noop
} from '../utils';
import {
  MultipleSelectionProps,
  MultipleSelectionState,
  MultipleSelectionAction,
  MultipleSelectionStateChangeTypes,
  MultipleSelectionActionAndChanges,
  DropdownGetterProps,
  NavigationKeys
} from './types';
import { ItemsList } from '../types';

export function useMultipleSelection<Item>(props: MultipleSelectionProps<Item>) {
  const [state, dispatch] = useControlledReducer<
    (
      state: MultipleSelectionState<Item>,
      action: MultipleSelectionAction<Item>
    ) => MultipleSelectionState<Item>,
    MultipleSelectionState<Item>,
    MultipleSelectionProps<Item>,
    MultipleSelectionStateChangeTypes,
    MultipleSelectionActionAndChanges<Item>
  >(multipleSelectionReducer, computeInitialState<Item>(props), props);
  const {
    items,
    currentSelectedItem,
    currentSelectedItemIndex,
    hasSelectedItems
  } = state;
  const {
    nextKey = NavigationKeys.ARROW_LEFT,
    prevKey = NavigationKeys.ARROW_RIGHT
  } = props;
  const dropdownRef = React.useRef<HTMLElement & HTMLInputElement>();
  const currentSelectedItemRef = React.useRef<HTMLElement>();

  React.useEffect(() => {
    console.log('dropdownRef.current:', dropdownRef.current);
    if (currentSelectedItemIndex === -1 && dropdownRef.current) {
      console.log('[CALLED FOCUS]');
      dropdownRef.current.focus();
    }
  }, [currentSelectedItemIndex]);

  React.useEffect(() => {
    if (currentSelectedItemIndex >= 0 && currentSelectedItemRef.current) {
      currentSelectedItemRef.current.focus();
    }
  }, [currentSelectedItemIndex]);

  const itemsList = React.useRef<ItemsList>({});
  if (props.items) {
    props.items.forEach((item) => itemsList.current[props.itemToString(item)]);
  }

  const itemKeydownHandlers: {
    [eventHandler: string]: (e: React.KeyboardEvent, index: number) => void;
  } = {
    [nextKey]: () => {
      dispatch({
        type: MultipleSelectionStateChangeTypes.NAVIGATION_NEXT
      });
    },
    [prevKey]: () => {
      dispatch({
        type: MultipleSelectionStateChangeTypes.NAVIGATION_PREV
      });
    },
    Enter: (e: React.KeyboardEvent) => {
      dispatch({
        type: MultipleSelectionStateChangeTypes.KEYDOWN_ENTER
      });
    },
    Spacebar: (e: React.KeyboardEvent) => {
      dispatch({
        type: MultipleSelectionStateChangeTypes.KEYDOWN_SPACEBAR
      });
    },
    Backspace: (e: React.KeyboardEvent, index: number) => {
      dispatch({
        type: MultipleSelectionStateChangeTypes.KEYDOWN_BACKSPACE,
        index
      });
    }
  };

  const dropdownKeydownHandlers: {
    [eventHandler: string]: (e: React.KeyboardEvent) => void;
  } = {
    [prevKey]: (e: React.KeyboardEvent) => {
      // e.stopPropagation();

      if (canNavigateToItems()) {
        dispatch({
          type: MultipleSelectionStateChangeTypes.DROPDOWN_NAVIGATION_TO_ITEMS
        });
      }
    }
  };

  function getDropdownProps({ ref = null, ...rest }: DropdownGetterProps) {
    const handleKeydown = (e: React.KeyboardEvent) => {
      const { name: keyName, code } = normalizeKey(e);
      if (keyName in dropdownKeydownHandlers) {
        console.log('[DROPDOWN_PROPS] ', keyName);
        dropdownKeydownHandlers[keyName](e);
      }
    };
    return {
      ref: mergeRefs(ref, dropdownRef),
      onKeyDown: handleKeydown,
      ...rest
    };
  }

  function getSelectedItemProps(selectedItem: Item, index: number) {
    let tabIndex = 0;
    let ref = null;
    if (index === currentSelectedItemIndex) {
      tabIndex = 1;
      ref = mergeRefs(currentSelectedItemRef);
    }

    const handleKeydown = (e: React.KeyboardEvent) => {
      const { name: keyName, code } = normalizeKey(e);
      if (keyName in itemKeydownHandlers) {
        console.log('[SELECTED_ITEM_PROPS]', keyName);
        itemKeydownHandlers[keyName](e, index);
      }
    };

    const handleClick = (e: React.KeyboardEvent) => {
      e.stopPropagation();
      dispatch({
        type: MultipleSelectionStateChangeTypes.KEYDOWN_CLICK,
        index
      });
    };

    return {
      tabIndex: tabIndex,
      onClick: handleClick,
      onKeyDown: handleKeydown,
      ref
    };
  }

  function removeSelectedItem(item: Item) {
    dispatch({
      type: MultipleSelectionStateChangeTypes.FUNCTION_REMOVE_SELECTED_ITEM,
      item,
      itemToString: props.itemToString
    });
  }

  function addSelectedItem(item: Item) {
    dispatch({
      type: MultipleSelectionStateChangeTypes.FUNCTION_ADD_SELECTED_ITEM,
      item
    });
  }

  return {
    getSelectedItemProps,
    removeSelectedItem,
    addSelectedItem,
    getDropdownProps,
    items,
    currentSelectedItem,
    currentSelectedItemIndex,
    hasSelectedItems
  };
}

/* the internal data structure of selected items will function as a queue */

/* Usage */
// [] the user can assign interactions to the selected elements

/* state */
// [] we want to have state of all currently selected items: Items[]
// [] we want to store the currently highlighted/active element: Item
// [] we want to have state of whether or not we have selected items: boolean based on undefined or defined list
// [] we want to store the index of the currently highlighted/active element: number

/* props */
// [x] when a new highlighted index occurs recommendations based on these state change types^

/* state change types - what does the user need? */
// [x] when the group is blurred
// [x] when the group is active
// [x] when an item is clicked
// [x] when a keyboard left
// [x] when a keyboard right
// [x] when a keyboard up
// [x] when a keyboard down happens
// [x] when a keyboard enter
// [x] when a keyboard spacebar

/* UI */
// [] selected items: list
// [] selected item: list element

/* UX */
// [x] we want to have keyboard navigation
// [] left up and down are the same
// [x] we want to have keyboard interaction
// [x] enter, spacebar

/* functions.operations */
// [x] getSelectedItemProps
// [] getLabelProps - associates/describes what the group belongs to

// [x] onHighlightedIndexChange
// [x] onHasSelectedItems

// [] remove a selected item
// [] the user specifies when/where the removal happens
// [] we just provide a callback for them to use/specify in their code
// [] add item to selected items
// [] the user specifies when/where the addition happens
// [] we just provide a callback for them to use/specify in their code

/* accessibility */
// [] we want the currently active item to have a dialogue to let the user know what item is active, number of total items, and what group the selected items belong to
// [] we want the selected item list to be associated with a parent/combobox
// [] we want to tell the user how to interact with the item?

/* questions */
// [] how to remove elements?
