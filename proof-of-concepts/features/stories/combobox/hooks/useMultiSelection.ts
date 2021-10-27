interface Item {}

type MultiSelectionState = {
  selectedItems: Map<string, Item>;
};

const multiSelectionState = {
  selectedItems: new Map<string, Item>()
} as MultiSelectionState;

function useMultiSelection() {}
