import {
  renderTagEditor,
  getSelectedItem,
  getAllSelectedItems,
  getPopup,
  getPopupItem,
  getPopupItems
} from './utils';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { server, rest } from '../../../test/server';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import { tags } from '../../../test/bottomline-data';

describe('Tag Editor', () => {
  // test('When the input is focused and the input has text, the enter keydown event creates the selected tag ', () => {
  //   const { container, input } = renderTagEditor();
  //   input.focus();
  //   userEvent.type(input, 'material');
  //   expect(input).toHaveValue('material');
  //   userEvent.type(input, '{enter}');
  //   const createdSelectedItem = getSelectedItem(0);
  //   expect(createdSelectedItem).toBeDefined();
  //   expect(input).toHaveValue('');
  // });
  test('When a tag is created, the input is cleared', async () => {
    const { container, input } = renderTagEditor();
    input.focus();
    userEvent.type(input, 'material');
    expect(input).toHaveValue('material');
    userEvent.type(input, '{enter}');
    await waitFor(() => expect(input).toHaveValue(''));

    input.focus();
    await userEvent.type(input, 'material', { delay: 300 });
    const item = getPopupItem(0);
    expect(item).toBeDefined();
    userEvent.click(item);
    await waitFor(() => expect(input).toHaveValue(''));
  });
  // test('When a tag is created, any onTagCreated callbacks are called', () => {});
  // test('When the user pastes text, whitespace is treated as an enter', () => {});
  // test('Input that has multiple white space is not allowed', () => {});
  // test('Clicking a suggested tag creates the tag and closes the popup, clears the input, and the input continues to be focused', () => {});
  // test('A user is able to delete a created tag', () => {});
  // test('Duplicate created tags are not allowed', () => {});
});
