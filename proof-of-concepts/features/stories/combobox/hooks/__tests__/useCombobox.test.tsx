import * as React from 'react';
import { act, renderHook } from '@testing-library/react-hooks';
import { renderCombobox, renderUseCombobox } from './utils';
import { screen, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe('useCombobox hook', () => {
  /**
   * ****************
   *
   * Props
   *
   * ****************
   */
  test('the popup is open when initial isOpen is true', () => {
    const { input } = renderCombobox({ initialIsOpen: true });
    expect(input).toHaveFocus();
  });

  test('when initial isOpen is true and no highlightedIndex is specified, then the highlightedIndex has an index of 0', () => {
    const { input } = renderCombobox({ initialIsOpen: true });
    expect(input).toHaveFocus();
  });

  /**
   * ****************
   *
   * Focusing
   *
   * ****************
   */
  test('it focuses the input when the popup is open', () => {
    const { input } = renderCombobox({ initialIsOpen: true });
    expect(input).toHaveFocus();
  });

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
   * Navigating with arrow keys
   *
   * ****************
   */

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
  test('the combobox has the role of combobox', () => {});

  test('the element with combobox contains an element with role: textbox', () => {});

  // our implementation of combobox defaults to grid rather than listbox
  test('when the popup is visible the combobox contains an element with role that defaults to grid', () => {});

  test('the combobox has value aria-haspopup === grid', () => {});

  test('when the popup is visible, the input has aria-controls set to a value that refers to popup element ', () => {});

  test('the input has aria-multline of false', () => {});
  test('when the popup is not visible, the combobox has aria-expanded == false', () => {});
  test('when the popup is visible, the combobox has aria-expanded == true', () => {});
  test('when the combobox recieves focus, the input is the default element with focus', () => {});
  test('when a descendant (gridcell in our case) is highlighted, the input continues to have focus ', () => {});
  test('when a descendant (gridcell in our case) is highlighted, aria-activedescendant value refers to element of the highlightedIndex within the grid', () => {});
  test('the combobox has value aria-haspopup that corresponds to grid', () => {});
  test('the combobox has value aria-haspopup that corresponds to grid', () => {});
  test('the combobox has value aria-haspopup that corresponds to grid', () => {});
  test('the combobox has value aria-haspopup that corresponds to grid', () => {});
  test('the combobox has value aria-haspopup that corresponds to grid', () => {});
  test('the combobox has value aria-haspopup that corresponds to grid', () => {});

  /**
   * ****************
   *
   * Testing ways to select an item
   *
   * ****************
   */

  // when an item is focused, a click event selects the item

  // when an item is focused and the user issues an enter keydown event, the current element is selected and the popup closes

  // when a user issues an escape keydown event while the popup is open, the popup closes and the
});
