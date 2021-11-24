import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  renderMultipleSelection,
  sampleSelectedItems,
  sampleItemToString,
  SelectedItem
} from './utils';

describe('useMultipleSelection hook', () => {
  /**
   * *********************
   *
   * Keyboard Navigation
   *
   * *********************
   */
  test('a left or up arrow on the highest-indexed element does nothing', () => {
    const { container, selectedItems } = renderMultipleSelection<SelectedItem>({
      items: sampleSelectedItems,
      itemToString: sampleItemToString
    });
    selectedItems.focus();
    fireEvent.keyDown(selectedItems, {
      key: 'ArrowLeft',
      code: 'ArrowLeft',
      charCode: 37
    });
    let currentSelectedItem = screen.getByTestId('item-testid-1');
    expect(currentSelectedItem.classList).toContain(
      'current-selected-item-highlight'
    );
    fireEvent.keyDown(selectedItems, {
      key: 'ArrowUp',
      code: 'ArrowUp',
      charCode: 38
    });
    currentSelectedItem = screen.getByTestId('item-testid-2');
    expect(currentSelectedItem.classList).toContain(
      'current-selected-item-highlight'
    );
  });

  test('a right or down arrow on the lowest-indexed element places focus back on the textbox', () => {
    const { container, selectedItems } = renderMultipleSelection<SelectedItem>({
      items: sampleSelectedItems,
      itemToString: sampleItemToString
    });
    selectedItems.focus();
    fireEvent.keyDown(selectedItems, {
      key: 'ArrowRight',
      code: 'ArrowRight',
      charCode: 39
    });
    let currentSelectedItem = screen.getByTestId('item-testid-1');
    expect(currentSelectedItem).not.toContain('current-selected-item-highlight');
    fireEvent.keyDown(selectedItems, {
      key: 'ArrowLeft',
      code: 'ArrowLeft',
      charCode: 37
    });
    expect(currentSelectedItem.classList).toContain(
      'current-selected-item-highlight'
    );
    fireEvent.keyDown(selectedItems, {
      key: 'ArrowDown',
      code: 'ArrowDown',
      charCode: 40
    });
    currentSelectedItem = screen.getByTestId('item-testid-1');
    expect(currentSelectedItem).not.toContain('current-selected-item-highlight');
  });

  test('a left or up arrow navigates to higher-indexed elements', () => {});

  test('a right or down arrow navigates to lower-indexed elements', () => {});

  /**
   * *********************
   *
   * Keyboard Interaction
   *
   * *********************
   */
  test('enter or spacebar calls registered action', () => {});

  /**
   * *********************
   *
   * Accessibility
   *
   * *********************
   */
});
