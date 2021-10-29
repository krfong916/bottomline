import { useRef } from 'react';
import { ComboboxProps } from '../useCombobox';
let count = 0;

export function useElementId({
  id = `bottomline-${generateId()}`,
  labelId,
  inputId,
  menuId
}: Partial<ComboboxProps>) {
  const elementIds = useRef({
    id,
    labelId: labelId || `${id}-label`,
    inputId: inputId || `${id}-input`,
    menuId: menuId || `${id}-menu`,
    getItemId: (index: number) => `${id}-item-${index}`
  });
  return elementIds.current;
}

export function generateId() {
  return Math.floor(Math.random() * 1000) + count;
}
