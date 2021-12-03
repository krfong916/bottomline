import * as React from 'react';
import { useCombobox } from '../useCombobox';
import { ComboboxProps } from '../types';
import { render, screen, getAllByRole } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';

const dataTestIds = {
  input: 'input-testid',
  popup: 'popup-testid',
  label: 'label-testid',
  outside: 'outside-testid'
};

export function renderCombobox(props?: ComboboxProps) {
  const container = render(<ComboboxGrid {...props} />);
  const input = screen.getByTestId(dataTestIds.input);
  const popup = screen.getByTestId(dataTestIds.popup);
  const label = screen.getByTestId(dataTestIds.label);
  const outside = screen.getByTestId(dataTestIds.outside);
  const combobox = screen.queryByRole('combobox');

  return {
    input,
    popup,
    combobox,
    label,
    outside
  };
}

function ComboboxGrid(props: ComboboxProps) {
  const {
    isOpen,
    getLabelProps,
    getComboboxProps,
    getInputProps,
    getPopupProps,
    getItemProps,
    highlightedIndex,
    inputValue
  } = useCombobox({
    itemToString: (item) => item.name,
    ...props
  });
  return (
    <div>
      <label data-testid={dataTestIds.label} {...getLabelProps()}></label>
      <div {...getComboboxProps()}>
        <input
          data-testid={dataTestIds.input}
          {...getInputProps()}
          value={inputValue}
        ></input>
      </div>
      <div data-testid={dataTestIds.popup} {...getPopupProps()}>
        <ul>
          {isOpen
            ? SampleItems.map((item, index) => {
                const url = `thebottomlineapp.com/item/${item.name}/info`;
                const itemKey = `item-${index}`;
                return (
                  <li
                    key={itemKey}
                    tabIndex={0}
                    {...getItemProps(index)}
                    className={
                      highlightedIndex === index ? 'current-item-highlight' : ''
                    }
                  >
                    <div>
                      <span>{item.name}</span>
                      <span>{item.count}</span>
                    </div>
                    <span>{item.contents}</span>
                  </li>
                );
              })
            : null}
        </ul>
      </div>
      <button data-testid={dataTestIds.outside}></button>
    </div>
  );
}

export function renderUseCombobox() {
  return renderHook(() => useCombobox({ items: SampleItems }));
}

export const SampleItems = [
  { name: 'material-analysis', count: 5, contents: '' },
  { name: 'class-analysis', count: 33, contents: '' },
  { name: 'materialism', count: 12, contents: '' },
  { name: 'dialectical-materialism', count: 9, contents: '' },
  { name: 'historical-materialism', count: 5, contents: '' },
  { name: 'materialist-theory', count: 2, contents: '' }
];
