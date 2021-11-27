import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NavigationKeys } from '../types';
import {
  renderMultipleSelection,
  sampleSelectedItems,
  sampleItemToString,
  SelectedItem
} from './utils';

describe('useMultipleSelection hook', () => {
  test('we can transition focus from the textbox to the last item in the list of selected items', () => {
    const { container, textbox, selectedItems } = renderMultipleSelection<
      SelectedItem
    >({
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
    let currentSelectedItem = screen.getByTestId(
      `item-testid-${sampleSelectedItems.length - 1}`
    );
    expect(currentSelectedItem.classList).toContain(
      'current-selected-item-highlight'
    );
  });
  // test('if we are at the start of the list, pressing the key to go to the prev element does nothing', () => {
  //   const { container, selectedItems } = renderMultipleSelection<SelectedItem>({
  //     items: sampleSelectedItems,
  //     itemToString: sampleItemToString,
  //     nextKey: NavigationKeys.ARROW_LEFT,
  //     prevKey: NavigationKeys.ARROW_RIGHT
  //   });
  //   selectedItems.focus();
  //   for (let i = 0; i < sampleSelectedItems.length; i++) {
  //     fireEvent.keyDown(selectedItems, {
  //       key: 'ArrowRight',
  //       code: 'ArrowRight',
  //       charCode: 39
  //     });
  //   }
  //   fireEvent.keyDown(selectedItems, {
  //     key: 'ArrowRight',
  //     code: 'ArrowRight',
  //     charCode: 39
  //   });
  //   let currentSelectedItem = screen.getByTestId(`item-testid-0`);
  //   expect(currentSelectedItem.classList).toContain(
  //     'current-selected-item-highlight'
  //   );
  // });

  // test('if the current index === -1, we place focus back on the textbox', () => {
  //   const { container, selectedItems, textbox } = renderMultipleSelection<
  //     SelectedItem
  //   >({
  //     items: sampleSelectedItems,
  //     itemToString: sampleItemToString,
  //     nextKey: NavigationKeys.ARROW_LEFT,
  //     prevKey: NavigationKeys.ARROW_RIGHT
  //   });
  //   textbox.focus();
  //   fireEvent.keyDown(selectedItems, {
  //     key: 'ArrowLeft',
  //     code: 'ArrowLeft',
  //     charCode: 37
  //   });
  //   let currentSelectedItem = screen.getByTestId(`item-testid-0`);
  //   expect(currentSelectedItem.classList).toContain(
  //     'current-selected-item-highlight'
  //   );
  //   fireEvent.keyDown(selectedItems, {
  //     key: 'ArrowRight',
  //     code: 'ArrowRight',
  //     charCode: 39
  //   });
  //   expect(currentSelectedItem).not.toContain('current-selected-item-highlight');
  //   screen.debug();
  //   expect(textbox).toHaveFocus();
  // });

  // test('removing a currently active item places focus on the next item, or none if the list is now empty', () => {});

  // test('adding a new element maintains focus on the current active item', () => {});

  // test('assigns -1 for non-active elements', () => {});

  // test('onclick places focus on the item', () => {});

  // test('backspace deletes the current item and moves the focus to the next element, if it exists', () => {});

  // test('we save the reference to the textbox so we can tab back to the textbox element when active index ===-1', () => {});
});
