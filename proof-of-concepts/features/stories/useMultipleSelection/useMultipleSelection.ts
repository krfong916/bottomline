import React from 'react';
import { multipleSelectionReducer } from './reducer';
import { computeInitialState } from './utils';
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
  MultipleSelectionActionAndChanges
} from './types';

export default function useMultipleSelection<Item>(
  props: MultipleSelectionProps<Item>
) {
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

  const keydownHandlers = React.useCallback(
    (e: React.KeyboardEvent) => ({
      Enter: () => {
        dispatch({
          type: MultipleSelectionStateChangeTypes.KEYDOWN_ENTER
        });
      },
      Spacebar: () => {
        dispatch({
          type: MultipleSelectionStateChangeTypes.KEYDOWN_SPACEBAR
        });
      },
      ArrowDown: () => {
        dispatch({
          type: MultipleSelectionStateChangeTypes.KEYDOWN_ARROW_DOWN
        });
      },
      ArrowUp: () => {
        dispatch({
          type: MultipleSelectionStateChangeTypes.KEYDOWN_ARROW_UP
        });
      },
      ArrowLeft: () => {
        dispatch({
          type: MultipleSelectionStateChangeTypes.KEYDOWN_ARROW_LEFT
        });
      },
      ArrowRight: () => {
        dispatch({
          type: MultipleSelectionStateChangeTypes.KEYDOWN_ARROW_RIGHT
        });
      }
    }),
    [dispatch, state]
  );

  function getSelectedItemProps() {}

  function getMultiSelectionLabelProps() {}

  function removeSelectedItem(item: Item) {
    dispatch({
      type: MultipleSelectionStateChangeTypes.FUNCTION_REMOVE_SELECTED_ITEM,
      item
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
    getMultiSelectionLabelProps,
    removeSelectedItem,
    addSelectedItem
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
