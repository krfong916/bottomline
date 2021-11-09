import * as React from 'react';
import { act, renderHook } from '@testing-library/react-hooks';
import { renderCombobox, renderUseCombobox } from './utils';
import {
  screen,
  render,
  fireEvent,
  getAllByRole,
  getByText
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SampleItems } from './testingUtils';
import '@testing-library/jest-dom/extend-expect';

// prevent input cursor from moving on arrow keys and backspace
describe('useCombobox hook', () => {
  /**
   * ****************
   *
   * Props
   *
   * ****************
   */
  test('the popup is open when initial isOpen is true', () => {
    const { input } = renderCombobox({ initialIsOpen: true, items: SampleItems });
    expect(input).toHaveFocus();
  });

  /**
   * ****************
   *
   * Focusing
   *
   * ****************
   */
  // test('it focuses the input when the popup is open', () => {
  //   const { input } = renderCombobox({ initialIsOpen: true, items: SampleItems });
  //   expect(input).toHaveFocus();
  // });

  // test('it focuses the input and the first item is highlighted', () => {
  //   // we want to make sure the current index in state corresponds to the currently highlighted element
  // });

  /**
   * ****************
   *
   * Closing the popup
   *
   * ****************
   */
  test('when the popup is open, the escape keydown event closes the popup', () => {
    const { input } = renderCombobox({
      initialIsOpen: true,
      items: SampleItems
    });
    fireEvent.keyDown(input, { key: 'Escape', code: 'Escape', charCode: 27 });
    expect(input).toHaveFocus();
  });

  /**
   * ****************
   *
   * Selecting an element
   *
   * ****************
   */

  test('when an item is focused, a click event selects the item', () => {
    const { input, popup } = renderCombobox({
      initialIsOpen: true,
      items: SampleItems
    });
    const items = screen.getAllByRole('gridcell');
    const currentItem = items[3]; // random item
    fireEvent.click(currentItem);
    expect(currentItem.getAttribute('aria-selected')).toBe('true');
  });

  test('when an item is focused and the user issues an enter keydown event, the current element is selected', () => {
    const { input, popup } = renderCombobox({
      initialIsOpen: true,
      items: SampleItems
    });
    // go to a random item
    fireEvent.keyDown(input, { key: 'ArrowDown', code: 'ArrowDown', charCode: 40 });
    fireEvent.keyDown(input, { key: 'ArrowDown', code: 'ArrowDown', charCode: 40 });
    fireEvent.keyDown(input, { key: 'ArrowDown', code: 'ArrowDown', charCode: 40 });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', charCode: 13 });
    const items = screen.getAllByRole('gridcell');
    const currentItem = items[2];
    expect(currentItem.getAttribute('aria-selected')).toBe('true');
  });

  /**
   * ****************
   *
   * Deleting input characters
   *
   * ****************
   */
  test('backspace on an open popup with highlight does nothing', () => {
    const { combobox, input, popup } = renderCombobox({
      initialIsOpen: false,
      items: SampleItems
    });
    userEvent.click(input);
    userEvent.type(input, 'any-random-string');
    fireEvent.keyDown(input, { key: 'ArrowDown', code: 'ArrowDown', charCode: 40 });
    fireEvent.keyDown(input, { key: 'Backspace', code: 'Backspace', charCode: 8 });
    expect(screen.getByDisplayValue('any-random-string')).toBeDefined();
  });

  test('only when the highlightedIndex is -1, can we change the input value popup', () => {
    const { input, popup } = renderCombobox({
      initialIsOpen: true,
      items: SampleItems
    });
    userEvent.click(input);
    userEvent.type(input, 'any-random-string');
    userEvent.type(input, '{backspace}');
    fireEvent.keyDown(input, { key: 'ArrowDown', code: 'ArrowDown', charCode: 40 });
    fireEvent.keyDown(input, { key: 'ArrowUp', code: 'ArrowUp', charCode: 38 });
    userEvent.type(input, '{backspace}');
    expect(screen.getByDisplayValue('any-random-stri')).toBeDefined();
  });
  /**
   * ****************
   *
   * On Change while popup
   *
   * ****************
   */

  // a user should be able to type characters in the input while the dropdown is open and item is focused

  // deleting all characters closes the popup

  /**
   * ****************
   *
   * Blur
   *
   * ****************
   */

  /**
   * ****************
   *
   * Popup keyboard interaction, arrow events
   *
   * ****************
   */
  test('when the popup is open, a down arrow keydown event places highlighted index on the first grid item', () => {
    const { input, popup } = renderCombobox({
      initialIsOpen: true,
      items: SampleItems
    });
    const items = getAllByRole(popup, 'gridcell');
    const firstItem = items[0];
    expect(firstItem.classList).not.toContain('current-item-highlight');
    fireEvent.keyDown(input, { key: 'ArrowDown', code: 'ArrowDown', charCode: 40 });
    expect(input).toHaveFocus();
    expect(firstItem.classList).toContain('current-item-highlight');
  });

  test('when the popup is open, and selected item and highlightedIndex are not defined, any arrow down event that is not a down arrow does nothing', () => {
    const { input, popup } = renderCombobox({
      initialIsOpen: true,
      items: SampleItems
    });
    const items = getAllByRole(popup, 'gridcell');
    fireEvent.keyDown(input, { key: 'ArrowLeft', code: 'ArrowLeft', charCode: 37 });
    fireEvent.keyDown(input, { key: 'ArrowUp', code: 'ArrowUp', charCode: 38 });
    fireEvent.keyDown(input, { key: 'ArrowRight', code: 'ArrowRight', charCode: 39 });
    let highlightPresence = screen.queryByText('current-item-highlight');
    expect(highlightPresence).toBeNull();
    fireEvent.keyDown(input, { key: 'ArrowDown', code: 'ArrowDown', charCode: 40 });
    const firstItem = items[0];
    expect(firstItem.classList).toContain('current-item-highlight');
    expect(input).toHaveFocus();
  });

  test('up arrow when on the first element places focus back on the input but does not close the popup', () => {
    const { input, popup } = renderCombobox({
      initialIsOpen: true,
      items: SampleItems
    });
    fireEvent.keyDown(input, { key: 'ArrowDown', code: 'ArrowDown', charCode: 40 });
    fireEvent.keyDown(input, { key: 'ArrowUp', code: 'ArrowUp', charCode: 38 });
    const items = getAllByRole(popup, 'gridcell');
    const firstItem = items[0];
    expect(firstItem.classList).not.toContain('current-item-highlight');
    expect(input).toHaveFocus();
  });

  test('a down arrow keydown event selects the next element in grid order', () => {
    const { input, popup } = renderCombobox({
      initialIsOpen: true,
      items: SampleItems
    });
    const items = getAllByRole(popup, 'gridcell');
    const firstItem = items[0];
    const secondItem = items[1];
    fireEvent.keyDown(input, { key: 'ArrowDown', code: 'ArrowDown', charCode: 40 });
    fireEvent.keyDown(input, { key: 'ArrowDown', code: 'ArrowDown', charCode: 40 });
    expect(firstItem.classList).not.toContain('current-item-highlight');
    expect(secondItem.classList).toContain('current-item-highlight');
  });

  test('a left arrow keydown event sets highlight on the previous element in grid order', () => {
    const { input, popup } = renderCombobox({
      initialIsOpen: true,
      items: SampleItems,
      initialHighlightedIndex: 2,
      selectedItem: SampleItems[2]
    });
    const items = getAllByRole(popup, 'gridcell');
    const secondItem = items[1];
    const thirdItem = items[2];
    expect(thirdItem.classList).toContain('current-item-highlight');
    fireEvent.keyDown(input, { key: 'ArrowLeft', code: 'ArrowLeft', charCode: 37 });
    expect(secondItem.classList).toContain('current-item-highlight');
    expect(thirdItem.classList).not.toContain('current-item-highlight');
  });
  test('a left arrow keydown event does nothing if the current element and index is the left-most element and index, in the first row. It maintains highlight on the correct element', () => {
    const { input, popup } = renderCombobox({
      initialIsOpen: true,
      items: SampleItems
    });
    const items = getAllByRole(popup, 'gridcell');
    const firstItem = items[0];
    fireEvent.keyDown(input, { key: 'ArrowDown', code: 'ArrowDown', charCode: 40 });
    fireEvent.keyDown(input, { key: 'ArrowLeft', code: 'ArrowLeft', charCode: 37 });
    expect(firstItem.classList).toContain('current-item-highlight');
  });
  test('a right arrow keydown event selects the next element in grid order', () => {
    const { input, popup } = renderCombobox({
      initialIsOpen: true,
      items: SampleItems
    });
    const items = getAllByRole(popup, 'gridcell');
    const firstItem = items[0];
    const secondItem = items[1];
    fireEvent.keyDown(input, { key: 'ArrowDown', code: 'ArrowDown', charCode: 40 });
    fireEvent.keyDown(input, { key: 'ArrowRight', code: 'ArrowRight', charCode: 39 });
    expect(firstItem.classList).not.toContain('current-item-highlight');
    expect(secondItem.classList).toContain('current-item-highlight');
  });

  test('a right arrow or down arrow keydown event on the right-most element in the last row does nothing', () => {
    const lastItemIndex = SampleItems.length - 1;
    const { input, popup } = renderCombobox({
      initialIsOpen: true,
      items: SampleItems,
      initialHighlightedIndex: lastItemIndex,
      selectedItem: SampleItems[lastItemIndex]
    });
    const items = getAllByRole(popup, 'gridcell');
    const lastItem = items[lastItemIndex];
    fireEvent.keyDown(input, { key: 'ArrowRight', code: 'ArrowRight', charCode: 39 });
    expect(lastItem.classList).toContain('current-item-highlight');
  });

  /**
   * ****************
   *
   * Pre-defined element
   *
   * ****************
   */

  test('if defined, the combobox assigns an initially selected item and highlighted index', () => {
    const { input, popup } = renderCombobox({
      initialIsOpen: true,
      items: SampleItems,
      initialHighlightedIndex: 0,
      selectedItem: SampleItems[0]
    });
    const items = getAllByRole(popup, 'gridcell');
    const firstItem = items[0];
    expect(firstItem.classList).toContain('current-item-highlight');
  });

  test('a user is able to use keydown event navigation keys when an initially selected item and highlighted index is defined', () => {
    const lastItemIndex = SampleItems.length - 1;
    const { input, popup } = renderCombobox({
      initialIsOpen: true,
      items: SampleItems,
      initialHighlightedIndex: lastItemIndex,
      selectedItem: SampleItems[lastItemIndex]
    });
    const items = getAllByRole(popup, 'gridcell');
    const secondToLastItem = items[lastItemIndex - 1];
    const lastItem = items[lastItemIndex];
    fireEvent.keyDown(input, { key: 'ArrowLeft', code: 'ArrowLeft', charCode: 37 });
    expect(secondToLastItem.classList).toContain('current-item-highlight');
    expect(lastItem.classList).not.toContain('current-item-highlight');
  });
});

// /**
//  * ****************
//  *
//  * Accessibility
//  *
//  * ****************
//  *
//  * We want to make sure accessibility props are placed correctly
//  * Our implementation follows the ARIA 1.1 pattern for a Combobox
//  * https://www.w3.org/TR/wai-aria-practices/#wai-aria-roles-states-and-properties-6
//  */
describe('combobox accessibility', () => {
  test('the combobox has the role of combobox', () => {
    renderCombobox({ initialIsOpen: true, items: SampleItems });
    expect(screen.getByRole('combobox')).toBeDefined();
  });

  test('the element with combobox contains an element with role: textbox', () => {
    renderCombobox({ initialIsOpen: true, items: SampleItems });
    expect(screen.getByRole('textbox')).toBeDefined();
  });

  // our implementation of combobox defaults to grid rather than listbox
  test('when the popup is visible the combobox contains an element with role that defaults to grid', () => {
    renderCombobox({ initialIsOpen: true, items: SampleItems });
    expect(screen.getByRole('grid')).toBeDefined();
  });

  test('the combobox has value aria-haspopup === grid', () => {
    const { combobox } = renderCombobox({ initialIsOpen: true, items: SampleItems });
    expect(combobox).toHaveAttribute('aria-haspopup', 'grid');
  });

  test('when the popup is visible, the input has aria-controls set to a value that refers to popup element ', () => {
    const { input, popup } = renderCombobox({
      initialIsOpen: true,
      items: SampleItems
    });
    expect(input).toHaveAttribute('aria-controls');

    const inputAriaControlsId = input.getAttribute('aria-controls');
    const popupId = popup.getAttribute('id');
    expect(inputAriaControlsId).toBe(popupId);
  });

  test('the input has aria-multline of false', () => {
    const { input } = renderCombobox({ initialIsOpen: true, items: SampleItems });
    expect(input.getAttribute('aria-multline')).toBeFalsy();
  });

  test('when the popup is not visible, the combobox has aria-expanded == false', () => {
    const { combobox } = renderCombobox({ initialIsOpen: false, items: SampleItems });
    expect(combobox.getAttribute('aria-expanded')).toBeDefined();
    expect(combobox.getAttribute('aria-expanded')).toBe('false');
  });

  test('when the popup is visible, the combobox has aria-expanded == true', () => {
    const { combobox } = renderCombobox({ initialIsOpen: true, items: SampleItems });
    expect(combobox.getAttribute('aria-expanded')).toBeDefined();
    expect(combobox.getAttribute('aria-expanded')).toBe('true');
  });

  test('when the combobox recieves focus, the input is the default element with focus', () => {
    const { combobox, input } = renderCombobox({
      initialIsOpen: false,
      items: SampleItems
    });
    fireEvent.click(combobox);
    expect(input).toHaveFocus();
  });

  test('when a descendant (gridcell in our case) is highlighted, the input continues to have focus ', () => {
    const { input } = renderCombobox({ initialIsOpen: true, items: SampleItems });
    fireEvent.keyDown(input, { key: 'ArrowDown', code: 'ArrowDown', charCode: 40 });
    const item = screen.getByRole('gridcell', { selected: true });
    expect(item).toBeDefined();
    expect(input).toHaveFocus();
  });

  /* Implicitly, this test also tests the following condition:
       when the popup is open, the item (aka descendant or gridcell) with highlightedIndex has aria-selected to true */
  test('when a descendant (gridcell in our case) is highlighted, the aria-activedescendant value assigned to textbox refers to element of the highlightedIndex within the grid', () => {
    const { input } = renderCombobox({ initialIsOpen: true, items: SampleItems });
    fireEvent.keyDown(input, { key: 'ArrowDown', code: 'ArrowDown', charCode: 40 });
    const item = screen.getByRole('gridcell', { selected: true });
    const activeDescendant = input.getAttribute('aria-activedescendant');
    const highlightedDescendantId = item.getAttribute('id');
    expect(activeDescendant).toEqual(highlightedDescendantId);
  });

  test('if the combobox has a label, the element with combobox has aria-labelledby set to a value that refers to the labelling element', () => {
    const { label, combobox } = renderCombobox({
      initialIsOpen: true,
      items: SampleItems
    });
    const comboboxLabelId = combobox.getAttribute('aria-labelledby');
    expect(combobox).toHaveAttribute('aria-labelledby');
    expect(label).toHaveAttribute('for');
    expect(comboboxLabelId).toBe(label.getAttribute('id'));
  });

  test('the input has aria-autocomplete set to list', () => {
    const { input } = renderCombobox({ initialIsOpen: true, items: SampleItems });
    expect(input.getAttribute('aria-autocomplete')).toBe('list');
  });
});
