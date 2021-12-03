import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NavigationKeys } from '../types';
import {
  renderMultipleSelection,
  sampleSelectedItems,
  sampleItemToString,
  SelectedItem,
  getItem,
  getAllItems
} from './utils';

describe('useMultipleSelection hook', () => {
  const lastItem = sampleSelectedItems.length - 1;

  test('we can transition focus from the textbox to the last item in the list of selected items', () => {
    let { container, textbox } = renderMultipleSelection<SelectedItem>({
      items: sampleSelectedItems,
      itemToString: sampleItemToString,
      nextKey: NavigationKeys.ARROW_RIGHT,
      prevKey: NavigationKeys.ARROW_LEFT
    });

    textbox.focus();
    fireEvent.keyDown(textbox, {
      key: 'ArrowLeft',
      code: 'ArrowLeft',
      charCode: 37
    });
    let currentSelectedItem = getItem(lastItem);
    expect(currentSelectedItem.classList).toContain(
      'current-selected-item-highlight'
    );
  });

  test('if we are at the start of the list, pressing the key to go to the prev element does nothing', () => {
    let { container, textbox, selectedItems } = renderMultipleSelection<SelectedItem>(
      {
        items: sampleSelectedItems,
        itemToString: sampleItemToString,
        nextKey: NavigationKeys.ARROW_RIGHT,
        prevKey: NavigationKeys.ARROW_LEFT
      }
    );

    textbox.focus();
    fireEvent.keyDown(textbox, {
      key: 'ArrowLeft',
      code: 'ArrowLeft',
      charCode: 37
    });

    let currentSelectedItem;
    let i = 0;
    while (i < sampleSelectedItems.length) {
      currentSelectedItem = getItem(i);
      fireEvent.keyDown(currentSelectedItem, {
        key: 'ArrowLeft',
        code: 'ArrowLeft',
        charCode: 37
      });
      i++;
    }
    fireEvent.keyDown(currentSelectedItem, {
      key: 'ArrowLeft',
      code: 'ArrowLeft',
      charCode: 37
    });

    currentSelectedItem = getItem(0);

    expect(currentSelectedItem.classList).toContain(
      'current-selected-item-highlight'
    );
  });

  test('all items have a -1 tabindex when not highlighted', () => {
    let { container, textbox } = renderMultipleSelection<SelectedItem>({
      items: sampleSelectedItems,
      itemToString: sampleItemToString,
      nextKey: NavigationKeys.ARROW_RIGHT,
      prevKey: NavigationKeys.ARROW_LEFT
    });

    const allItems = getAllItems();
    allItems.forEach((item) => {
      expect(item.getAttribute('tabindex')).toEqual('-1');
    });
  });

  test('if the current index === -1, we place focus back on the textbox', () => {
    let { container, textbox, selectedItems } = renderMultipleSelection<SelectedItem>(
      {
        items: sampleSelectedItems,
        itemToString: sampleItemToString,
        nextKey: NavigationKeys.ARROW_RIGHT,
        prevKey: NavigationKeys.ARROW_LEFT
      }
    );

    textbox.focus();
    fireEvent.keyDown(textbox, {
      key: 'ArrowLeft',
      code: 'ArrowLeft',
      charCode: 37
    });

    let currentSelectedItem = getItem(lastItem);
    expect(currentSelectedItem.classList).toContain(
      'current-selected-item-highlight'
    );
    fireEvent.keyDown(selectedItems, {
      key: 'ArrowRight',
      code: 'ArrowRight',
      charCode: 39
    });

    expect(currentSelectedItem).not.toContain('current-selected-item-highlight');
    userEvent.type(selectedItems, '{arrowright}');

    textbox.focus();
    expect(textbox).toHaveFocus();
  });

  test('removing a currently active item maintains focus on the item in the given index', () => {
    let { container, textbox } = renderMultipleSelection<SelectedItem>({
      items: sampleSelectedItems,
      itemToString: sampleItemToString,
      nextKey: NavigationKeys.ARROW_RIGHT,
      prevKey: NavigationKeys.ARROW_LEFT
    });

    textbox.focus();
    // place focus on a current item
    fireEvent.keyDown(textbox, {
      key: 'ArrowLeft',
      code: 'ArrowLeft',
      charCode: 37
    });

    // remove an item
    const item = getItem(lastItem);
    userEvent.click(item.querySelector('[aria-label="Close"]'));
    expect(item).not.toBeInTheDocument();
    expect(getItem(lastItem - 1)).toHaveClass('current-selected-item-highlight');
  });

  test('if we remove all items from the list, then list is empty state change is dispatched so the user can do something with it', () => {
    let numItems = sampleSelectedItems.length - 1;
    const mockFn = jest.fn(() => true);
    let { container, textbox } = renderMultipleSelection<SelectedItem>({
      items: sampleSelectedItems,
      itemToString: sampleItemToString,
      nextKey: NavigationKeys.ARROW_RIGHT,
      prevKey: NavigationKeys.ARROW_LEFT,
      onHasSelectedItemsChange: mockFn
    });

    textbox.focus();
    // place focus on a current item
    fireEvent.keyDown(textbox, {
      key: 'ArrowLeft',
      code: 'ArrowLeft',
      charCode: 37
    });
    while (numItems >= 0) {
      const ithItem = numItems;
      // remove an item
      const item = getItem(ithItem);
      userEvent.click(item.querySelector('[aria-label="Close"]'));
      numItems--;
    }
    expect(mockFn).toHaveBeenCalled();
  });

  test('onclick places focus on the item', () => {
    const { container, textbox } = renderMultipleSelection<SelectedItem>({
      items: sampleSelectedItems,
      itemToString: sampleItemToString,
      nextKey: NavigationKeys.ARROW_RIGHT,
      prevKey: NavigationKeys.ARROW_LEFT
    });
    const allItems = getAllItems();
    const itemToClick = allItems[allItems.length / 2];
    fireEvent.click(itemToClick);
    expect(itemToClick.classList).toContain('current-selected-item-highlight');
  });

  test('adding a new element is inserted at the end of the list', () => {
    renderMultipleSelection<SelectedItem>({
      items: sampleSelectedItems,
      itemToString: sampleItemToString
    });

    const addItem = screen.getByText(/add item/i);
    fireEvent.click(addItem);
    const allItems = getAllItems();
    expect(allItems.length).toBe(sampleSelectedItems.length + 1);
  });

  test('backspace deletes the current item and moves the focus to the next element, if it exists', () => {
    renderMultipleSelection<SelectedItem>({
      items: sampleSelectedItems,
      itemToString: sampleItemToString,
      nextKey: NavigationKeys.ARROW_RIGHT,
      prevKey: NavigationKeys.ARROW_LEFT
    });
    const item = getItem(lastItem);
    fireEvent.keyDown(item, { key: 'Backspace', code: 'Backspace', charCode: 8 });
    expect(getAllItems().length).toBe(sampleSelectedItems.length - 1);
  });
});
