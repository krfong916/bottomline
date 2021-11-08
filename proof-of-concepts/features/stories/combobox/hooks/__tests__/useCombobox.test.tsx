import * as React from 'react';
import { act, renderHook } from '@testing-library/react-hooks';
import { renderCombobox, renderUseCombobox } from './utils';
import { screen, render, fireEvent, getAllByRole } from '@testing-library/react';
import { SampleItems } from './testingUtils';
import '@testing-library/jest-dom/extend-expect';

describe('useCombobox hook', () => {
  /**
   * ****************
   *
   * Props
   *
   * ****************
   */
  // test('the popup is open when initial isOpen is true', () => {
  //   const { input } = renderCombobox({ initialIsOpen: true });
  //   expect(input).toHaveFocus();
  // });

  // test('when initial isOpen is true and no highlightedIndex is specified, then the highlightedIndex has an index of 0', () => {
  //   const { input } = renderCombobox({ initialIsOpen: true });
  //   expect(input).toHaveFocus();
  // });

  /**
   * ****************
   *
   * Focusing
   *
   * ****************
   */
  // test('it focuses the input when the popup is open', () => {
  //   const { input } = renderCombobox({ initialIsOpen: true });
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
  // test('popup is open when isOpen prop is true', () => {});

  /**
   * ****************
   *
   * Testing ways to select an item and custom click handlers
   *
   * ****************
   */

  // when an item is focused, a click event selects the item

  // when an item is focused and the user issues an enter keydown event, the current element is selected and the popup closes

  // when a user issues an escape keydown event while the popup is open, the popup closes and the

  /**
   * ****************
   *
   * Popup keyboard interaction
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

  // up arrow when on the first element places focus back on the input but does not clsoe the popup

  // a down arrow keydown event selects the next element in grid order

  // a left arrow keydown event selects the previous element in grid order

  // a left arrow keydown event does nothing if the current element and index is the left-most element and index. It maintains focus on the correct element

  // a right arrow keydown event selects the next element in grid order

  // a right arrow keydown event on the right-most element places selection on the first element in the next row in grid order

  // a right arrow keydown event on the right-most element in the last row does nothing

  /**
   * ****************
   *
   * On Change while popup
   *
   * ****************
   */

  // a user should be able to type characters in the input while the dropdown is open and item is focused

  // deleting all characters closes the popup
});

/**
 * ****************
 *
 * Accessibility
 *
 * ****************
 *
 * We want to make sure accessibility props are placed correctly
 * Our implementation follows the ARIA 1.1 pattern for a Combobox
 * https://www.w3.org/TR/wai-aria-practices/#wai-aria-roles-states-and-properties-6
 */
// describe('combobox accessibility', () => {
//   test('the combobox has the role of combobox', () => {
//     renderCombobox({ initialIsOpen: true });
//     expect(screen.getByRole('combobox')).toBeDefined();
//   });

//   test('the element with combobox contains an element with role: textbox', () => {
//     renderCombobox({ initialIsOpen: true });
//     expect(screen.getByRole('textbox')).toBeDefined();
//   });

//   // our implementation of combobox defaults to grid rather than listbox
//   test('when the popup is visible the combobox contains an element with role that defaults to grid', () => {
//     renderCombobox({ initialIsOpen: true });
//     expect(screen.getByRole('grid')).toBeDefined();
//   });

//   test('the combobox has value aria-haspopup === grid', () => {
//     const { combobox } = renderCombobox({ initialIsOpen: true });
//     expect(combobox).toHaveAttribute('aria-haspopup', 'grid');
//   });

//   test('when the popup is visible, the input has aria-controls set to a value that refers to popup element ', () => {
//     const { input, popup } = renderCombobox({ initialIsOpen: true });
//     expect(input).toHaveAttribute('aria-controls');

//     const inputAriaControlsId = input.getAttribute('aria-controls');
//     const popupId = popup.getAttribute('id');
//     expect(inputAriaControlsId).toBe(popupId);
//   });

//   test('the input has aria-multline of false', () => {
//     const { input } = renderCombobox({ initialIsOpen: true });
//     expect(input.getAttribute('aria-multline')).toBeFalsy();
//   });

//   test('when the popup is not visible, the combobox has aria-expanded == false', () => {
//     const { combobox } = renderCombobox();
//     expect(combobox.getAttribute('aria-expanded')).toBeDefined();
//     expect(combobox.getAttribute('aria-expanded')).toBe('false');
//   });

//   test('when the popup is visible, the combobox has aria-expanded == true', () => {
//     const { combobox } = renderCombobox({ initialIsOpen: true });
//     expect(combobox.getAttribute('aria-expanded')).toBeDefined();
//     expect(combobox.getAttribute('aria-expanded')).toBe('true');
//   });

//   test('when the combobox recieves focus, the input is the default element with focus', () => {
//     const { combobox, input } = renderCombobox();
//     fireEvent.click(combobox);
//     expect(input).toHaveFocus();
//   });

//   test('when a descendant (gridcell in our case) is highlighted, the input continues to have focus ', () => {
//     const { input } = renderCombobox({ initialIsOpen: true });
//     const item = screen.getByRole('gridcell', { selected: true });
//     expect(item).toBeDefined();
//     expect(input).toHaveFocus();
//   });

//   /* Implicitly, this test also tests the following condition:
//      - when the popup is open, the item (aka descendant or gridcell) with highlightedIndex has aria-selected to true */
//   test('when a descendant (gridcell in our case) is highlighted, the aria-activedescendant value assigned to textbox refers to element of the highlightedIndex within the grid', () => {
//     const { input } = renderCombobox({ initialIsOpen: true });
//     const item = screen.getByRole('gridcell', { selected: true });
//     const activeDescendant = input.getAttribute('aria-activedescendant');
//     const highlightedDescendantId = item.getAttribute('id');
//     expect(activeDescendant).toEqual(highlightedDescendantId);
//   });

//   test('if the combobox has a label, the element with combobox has aria-labelledby set to a value that refers to the labelling element', () => {
//     const { label, combobox } = renderCombobox();
//     const comboboxLabelId = combobox.getAttribute('aria-labelledby');
//     expect(combobox).toHaveAttribute('aria-labelledby');
//     expect(label).toHaveAttribute('for');
//     expect(comboboxLabelId).toBe(label.getAttribute('id'));
//   });

//   test('the input has aria-autocomplete set to list', () => {
//     const { input } = renderCombobox();
//     expect(input.getAttribute('aria-autocomplete')).toBe('list');
//   });
// });
