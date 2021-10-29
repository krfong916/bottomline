import * as React from 'react';
import { useCombobox, ComboboxProps } from '../useCombobox';
import { render, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { SampleItems } from './testingUtils';

const dataTestIds = {
  input: 'input-testid',
  popup: 'popup-testid'
};

export function renderCombobox(props: ComboboxProps) {
  const container = render(<ComboboxGrid {...props} />);
  const input = screen.getByTestId(dataTestIds.input);
  const popup = screen.getByTestId(dataTestIds.popup);
  return {
    input,
    popup
  };
}

function ComboboxGrid(props: ComboboxProps) {
  const {
    isOpen,
    getLabelProps,
    getPopupProps,
    getInputProps,
    getItemProps,
    getGridPopupItemProps
  } = useCombobox(props);
  return (
    <div>
      <div>
        <label {...getLabelProps()}></label>
        <input data-testid={dataTestIds.input} {...getInputProps()}></input>
        {isOpen ? (
          <div data-testid={dataTestIds.popup} {...getPopupProps()}>
            <ul>
              {SampleItems.map((item, index) => {
                const url = `thebottomlineapp.com/item/${item.name}/info`;
                const itemKey = `item-${index}`;
                return (
                  <li
                    key={itemKey}
                    tabIndex={0}
                    {...getItemProps(index)}
                    {...getGridPopupItemProps()}
                  >
                    <div>
                      <span>{item.name}</span>
                      <span>{item.count}</span>
                    </div>
                    <span>{item.text}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function renderUseCombobox() {
  return renderHook(() => useCombobox({ items: SampleItems }));
}
