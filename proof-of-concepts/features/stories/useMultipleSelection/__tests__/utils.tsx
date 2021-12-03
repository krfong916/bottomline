import React from 'react';
import { useMultipleSelection } from '../useMultipleSelection';
import {
  MultipleSelectionProps,
  MultipleSelectionState,
  MultipleSelectionActionAndChanges,
  MultipleSelectionStateChangeTypes
} from '../types';
import { render, screen, getAllByRole } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';

const dataTestIds = {
  selectedItems: 'selectedItems-testid',
  item: 'item-testid',
  input: 'input-testid'
};

export function getItem(itemNum: number) {
  return screen.getByTestId(`item-testid-${itemNum}`);
}

export function getAllItems() {
  return screen.getAllByTestId(/item-testid/);
}

export function renderMultipleSelection<Item>(props: MultipleSelectionProps<Item>) {
  const container = render(<MultipleSelection {...props} />);
  const selectedItems = screen.getByTestId(dataTestIds.selectedItems);
  const textbox = screen.getByTestId(dataTestIds.input);
  return {
    container,
    selectedItems,
    textbox
  };
}
const dummyItem = {
  name: 'dummy-item',
  count: -1,
  contents: ''
};

function MultipleSelection<Item>(props: MultipleSelectionProps<Item>) {
  const { items: initialItems, itemToString } = props;
  const [selectedItems, setSelectedItems] = React.useState<Item>(initialItems);

  function stateReducer(
    state: MultipleSelectionState<Item>,
    actionAndChanges: MultipleSelectionActionAndChanges<Item>
  ) {
    const { action, changes } = actionAndChanges;
    const recommendations = { ...changes };
    switch (action.type) {
      case MultipleSelectionStateChangeTypes.FUNCTION_REMOVE_SELECTED_ITEM: {
        setSelectedItems([...recommendations.items]);
        return recommendations;
      }
      case MultipleSelectionStateChangeTypes.FUNCTION_ADD_SELECTED_ITEM: {
        setSelectedItems([...recommendations.items]);
        return recommendations;
      }
      case MultipleSelectionStateChangeTypes.KEYDOWN_BACKSPACE: {
        setSelectedItems([...recommendations.items]);
        return recommendations;
      }
      default: {
        return recommendations;
      }
    }
  }

  const {
    getSelectedItemProps,
    currentSelectedItemIndex,
    getDropdownProps,
    removeSelectedItem,
    addSelectedItem
  } = useMultipleSelection<Item>({
    ...props,
    items: selectedItems,
    stateReducer
  });

  const handleAddItem = (e) => {
    e.stopPropagation();
    addSelectedItem((dummyItem as unknown) as Item);
  };

  return (
    <div>
      <input tabIndex={0} data-testid={dataTestIds.input} {...getDropdownProps({})} />
      <div data-testid={dataTestIds.selectedItems}>
        {selectedItems &&
          selectedItems.map((item, index) => {
            return (
              <span
                {...getSelectedItemProps(item, index)}
                key={`${itemToString(item)}-${index}`}
                data-testid={`${dataTestIds.item}-${index}`}
                className={
                  currentSelectedItemIndex === index
                    ? 'current-selected-item-highlight'
                    : ''
                }
              >
                {itemToString(item)}
                <button
                  aria-label="Close"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSelectedItem(item);
                  }}
                >
                  X
                </button>
              </span>
            );
          })}
        <button onClick={handleAddItem}>Add Item</button>
      </div>
    </div>
  );
}

/**
 * *******************
 *
 * Mock Data
 *
 * *******************
 * Not used by the functions above^
 * Used in the actual test suite 'useMultipleSelection.test.tsx'
 */
export const sampleSelectedItems = [
  { name: 'material-analysis', count: 5, contents: '' },
  { name: 'class-analysis', count: 33, contents: '' },
  { name: 'materialism', count: 12, contents: '' },
  { name: 'dialectical-materialism', count: 9, contents: '' },
  { name: 'historical-materialism', count: 5, contents: '' },
  { name: 'materialist-theory', count: 2, contents: '' }
] as SelectedItem[];

export const sampleItemToString = (item: SelectedItem) => item.name;

export interface SelectedItem {
  name: string;
  count: number;
  contents: string;
}
