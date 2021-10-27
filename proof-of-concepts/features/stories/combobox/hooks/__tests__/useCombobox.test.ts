import * as React from 'react';
import { act, renderHook } from '@testing-library/react-hooks';
/**
 *
 * Rendering
 *
 */

// we want to render a combobox with the initial state of open
// and the focus is on the first element
describe('useCombobox hook', () => {});
// we want to make sure the current index in state corresponds to the currently highlighted element

/**
 *
 * Opening the popup
 *
 */

/**
 *
 * Closing the popup
 *
 */

/**
 *
 * Navigating with arrow keys
 *
 */

// up arrow when on the first element places focus back on the input but does not clsoe the popup

// a down arrow keydown event selects the next element in grid order

// a left arrow keydown event selects the previous element in grid order

// a left arrow keydown event does nothing if the current element and index is the left-most element and index. It maintains focus on the correct element

// a right arrow keydown event selects the next element in grid order

// a right arrow keydown event on the right-most element places selection on the first element in the next row in grid order

// a right arrow keydown event on the right-most element in the last row does nothing

/**
 *
 * On Change while popup
 *
 */

// a user should be able to type characters in the input while the dropdown is open and item is focused

// deleting all characters closes the popup

/**
 *
 * Accessibility
 *
 */

// we want to make sure accessibility props are placed correctly

/**
 *
 * Testing ways to select an item
 *
 */

// when an item is focused, a click event selects the item

// when an item is focused and the user issues an enter keydown event, the current element is selected and the popup closes

// when a user issues an escape keydown event while the popup is open, the popup closes and the
