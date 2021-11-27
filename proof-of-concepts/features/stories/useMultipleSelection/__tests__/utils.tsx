import React from 'react';
import { useMultipleSelection } from '../useMultipleSelection';
import { MultipleSelectionProps } from '../types';
import { render, screen, getAllByRole } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';

const dataTestIds = {
  selectedItems: 'selectedItems-testid',
  item: 'item-testid',
  input: 'input-testid'
};

export function renderMultipleSelection<Item>(props: MultipleSelectionProps<Item>) {
  const container = render(<MultipleSelection {...props} />);
  const selectedItems = screen.getByTestId(dataTestIds.selectedItems);
  const textbox = screen.getByTestId(dataTestIds.input);
  // const  = screen.getByRole();
  return {
    container,
    selectedItems,
    textbox
  };
}

function MultipleSelection<Item>(props: MultipleSelectionProps<Item>) {
  const { items, itemToString } = props;
  const {
    getSelectedItemProps,
    getSelectedItemListProps,
    currentSelectedItemIndex,
    getDropdownProps
  } = useMultipleSelection<Item>(props);
  return (
    <div>
      <input tabIndex={0} data-testid={dataTestIds.input} {...getDropdownProps()} />
      <div data-testid={dataTestIds.selectedItems} {...getSelectedItemListProps()}>
        {items &&
          items.map((item, index) => {
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
              </span>
            );
          })}
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
