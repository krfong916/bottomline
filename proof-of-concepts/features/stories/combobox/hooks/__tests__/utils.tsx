import * as React from 'react';
import { useCombobox, ComboboxProps } from '../useCombobox';
import { render, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { SampleItems } from './testingUtils';

const dataTestIds = {
  input: 'input-testid',
  popup: 'popup-testid',
  label: 'label-testid'
};

export function renderCombobox(props?: ComboboxProps) {
  const container = render(<ComboboxGrid {...props} />);
  const input = screen.getByTestId(dataTestIds.input);
  const popup = screen.getByTestId(dataTestIds.popup);
  const label = screen.getByTestId(dataTestIds.label);
  const combobox = screen.getByRole('combobox');
  return {
    input,
    popup,
    combobox,
    label
  };
}

function ComboboxGrid(props: ComboboxProps) {
  const {
    isOpen,
    getLabelProps,
    getComboboxProps,
    getInputProps,
    getPopupProps,
    getItemProps
  } = useCombobox(props);
  return (
    <div>
      <label data-testid={dataTestIds.label} {...getLabelProps()}></label>
      <div {...getComboboxProps()}>
        <input data-testid={dataTestIds.input} {...getInputProps()}></input>
      </div>
      <div data-testid={dataTestIds.popup} {...getPopupProps()}>
        <ul>
          {isOpen
            ? SampleItems.map((item, index) => {
                const url = `thebottomlineapp.com/item/${item.name}/info`;
                const itemKey = `item-${index}`;
                return (
                  <li key={itemKey} tabIndex={0} {...getItemProps(index)}>
                    <div>
                      <span>{item.name}</span>
                      <span>{item.count}</span>
                    </div>
                    <span>{item.text}</span>
                  </li>
                );
              })
            : null}
        </ul>
      </div>
    </div>
  );
}

export function renderUseCombobox() {
  return renderHook(() => useCombobox({ items: SampleItems }));
}
