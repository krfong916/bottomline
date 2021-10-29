import { useRef } from 'react';
import { ComboboxProps } from '../useCombobox';
let count = 0;

export function useElementId({
  id = `bottomline-${generateId()}`,
  labelId,
  inputId
}: Partial<ComboboxProps>) {
  const elementIds = useRef({
    id,
    labelId: labelId || `${id}-label`,
    inputId: inputId || `${id}-input`
  });
  return elementIds.current;
}

export function generateId() {
  return count++;
}
