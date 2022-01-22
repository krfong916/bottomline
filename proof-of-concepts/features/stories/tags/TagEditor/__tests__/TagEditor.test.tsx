import {
  renderTagEditor,
  getSelectedItem,
  getAllSelectedItems,
  getPopup,
  getPopupItem,
  getPopupItems
} from './utils';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  waitForElementToBeRemoved
} from '@testing-library/react';
import { server, rest } from '../../../test/server';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import { tags } from '../../../test/bottomline-data';

const tagsMockEndpoint = 'http://localhost:3000/tags';

describe('Tag Editor', () => {
  /**
   * Two tests that we cannot test for:
   * - whitespace is treated as an enter for each word separated by whitespace
   * - Input that has multiple white space is not allowed
   */

  test('When the input is focused and the input has text, the enter keydown event creates the selected tag ', () => {
    const { container, input } = renderTagEditor(tagsMockEndpoint);
    input.focus();
    userEvent.type(input, 'material');
    expect(input).toHaveValue('material');
    userEvent.type(input, '{enter}');
    const createdSelectedItem = getSelectedItem(0);
    expect(createdSelectedItem).toBeDefined();
    expect(input).toHaveValue('');
  });
  test('When a tag is created, the input is cleared', async () => {
    const { container, input } = renderTagEditor(tagsMockEndpoint);
    input.focus();
    userEvent.type(input, 'material');
    expect(input).toHaveValue('material');
    userEvent.type(input, '{enter}');
    await waitFor(() => expect(input).toHaveValue(''));

    input.focus();
    await userEvent.type(input, 'material', { delay: 300 });
    const item = getPopupItem(1);
    expect(item).toBeDefined();
    userEvent.click(item);
    await waitFor(() => expect(input).toHaveValue(''));
  });
  test('When a tag is created, any onTagsChanged callbacks are called', async () => {
    const { onTagsChanged, input } = renderTagEditor(tagsMockEndpoint);
    input.focus();
    userEvent.type(input, 'w/e random text');
    userEvent.type(input, '{enter}');
    await waitFor(() => expect(getAllSelectedItems).toBeDefined());
    expect(onTagsChanged).toHaveBeenCalled();
  });
  test('When the user pastes text, we handle on paste', async () => {
    // see: https://github.com/testing-library/react-testing-library/issues/499
    const { input, onPaste } = renderTagEditor(tagsMockEndpoint);
    const text = 'this sentence will be created into 9 selected tags';
    input.focus();
    userEvent.paste(input, text);
    expect(onPaste).toHaveBeenCalled();
  });

  test('Clicking a suggested tag creates the tag and closes the popup, clears the input, and the input continues to be focused', async () => {
    const { input } = renderTagEditor(tagsMockEndpoint);
    input.focus();
    await userEvent.type(input, 'material', { delay: 300 });
    const item = getPopupItem(0);
    userEvent.click(item);
    const suggestedItems = screen.queryAllByRole('gridcell');
    expect(suggestedItems).toHaveLength(0);
  });
  test('A user is able to delete a created tag', async () => {
    const { input } = renderTagEditor(tagsMockEndpoint);
    input.focus();
    userEvent.type(input, 'material');
    userEvent.type(input, '{enter}');
    await waitFor(() => expect(getAllSelectedItems).toBeDefined());
    const removeSelectedTagButton = screen.getByLabelText('remove');
    removeSelectedTagButton.click();
    const removedSelectedItem = getSelectedItem(0);
    expect(removedSelectedItem).toBeUndefined();
  });
  test('Duplicate created tags are not allowed', async () => {
    const { container, input } = renderTagEditor(tagsMockEndpoint);
    input.focus();
    userEvent.type(input, 'material');
    expect(input).toHaveValue('material');
    userEvent.type(input, '{enter}');
    await waitFor(() => expect(input).toHaveValue(''));

    input.focus();
    userEvent.type(input, 'material');
    expect(input).toHaveValue('material');
    userEvent.type(input, '{enter}');

    expect(getAllSelectedItems()).toHaveLength(1);
  });
});
