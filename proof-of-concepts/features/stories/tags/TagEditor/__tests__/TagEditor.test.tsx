import {
  renderTagEditor,
  getSelectedItem,
  getAllSelectedItems,
  getPopup,
  getPopupItem,
  getPopupItems
} from './utils';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';

describe('Tag Editor', () => {
  test('When the input is focused and the input has text, the enter keydown event creates the selected tag ', () => {
    const { container, input } = renderTagEditor();
    input.focus();
    userEvent.type(input, 'material');
    expect(input).toHaveValue('material');
    userEvent.type(input, '{enter}');
    const createdSelectedItem = getSelectedItem(0);
    expect(createdSelectedItem).toBeDefined();
    expect(input).toHaveValue('');
  });
  // test('When a tag is created, the input is cleared', () => {});
  // test('When a tag is created, any onTagCreated callbacks are called', () => {});
  // test('When the user pastes text, we fetch tags that are a near match to the input', () => {});
  // test('Input that has multiple white space is not allowed', () => {});
  // test('Clicking a suggested tag creates the tag and closes the popup, clears the input, and the input continues to be focused', () => {});
  // test('A user is able to delete a created tag', () => {});
  // test('Duplicate created tags are not allowed', () => {});
});
