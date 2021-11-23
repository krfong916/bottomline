import React from 'react';
import { BL, ComponentProps } from './types';

export const initialState = {
  selectedItem: null,
  isOpen: false,
  highlightedIndex: -1,
  inputValue: ''
};

export function computeInitialState<Item>(
  props: BL.ComboboxProps<Item>
): BL.ComboboxState<Item> {
  const isOpen = getInitialValue(props, 'isOpen');
  const inputValue = getInitialValue(props, 'inputValue');
  const selectedItem = getInitialValue(props, 'selectedItem');
  let highlightedIndex = getInitialValue(props, 'highlightedIndex');
  // console.log('[COMPUTE_INITIAL_STATE]:highlightedIndex', highlightedIndex);
  // console.log('items length:', props.items.length - 1);
  if (props.items && highlightedIndex > props.items.length - 1) {
    highlightedIndex = -1 as Partial<BL.ComboboxState<Item>>;
  }
  return {
    isOpen,
    inputValue,
    highlightedIndex,
    selectedItem
  } as BL.ComboboxState<Item>;
}

/**
 * Use the keys of state to get the initial values of properties defined in props
 * Props and State share the same keys.
 */
export function getInitialValue<Item>(
  props: BL.ComboboxProps<Item>,
  propKey: keyof BL.ComboboxState<Item>
): Partial<BL.ComboboxState<Item>> {
  if (propKey in props) {
    return props[propKey as keyof BL.ComboboxProps<Item>] as Partial<
      BL.ComboboxState<Item>
    >;
  }

  // get the user-provided initial prop state, it is a piece of state
  const initialPropKey = `initial${capitalizeString(
    propKey
  )}` as keyof BL.ComboboxProps<Item>;
  if (initialPropKey in props) {
    // console.log('initialPropKey', initialPropKey);
    // console.log('initialPropKey', props[initialPropKey]);
    return props[initialPropKey] as Partial<BL.ComboboxState<Item>>;
  }

  // return values from statically defined initial state object
  return initialState[propKey] as Partial<BL.ComboboxState<Item>>;
}

/**
 * Generates unique ids for the combobox component to avoid naming conflicts w/ other ids
 */
export function useElementId<Item>({
  id = `bottomline-${generateId()}`,
  labelId,
  inputId,
  menuId
}: Partial<BL.ComboboxProps<Item>>) {
  const elementIds = React.useRef({
    id,
    labelId: labelId || `${id}-label`,
    inputId: inputId || `${id}-input`,
    menuId: menuId || `${id}-menu`,
    // computes id relative to other indices of items
    getItemId: (index: number) => `${id}-item-${index}`
  });
  return elementIds.current;
}

export function useControlledReducer<
  ComponentReducer extends React.Reducer<any, any>,
  ComponentState extends React.ReducerState<ComponentReducer>,
  Props extends ComponentProps<ComponentState, any>,
  StateChangeType,
  ActionAndChanges
>(
  reducer: ComponentReducer,
  initialState: ComponentState,
  props: Props
): [
  React.ReducerState<ComponentReducer>,
  React.Dispatch<React.ReducerAction<ComponentReducer>>
] {
  // store and track dispatched actions
  const actionRef = React.useRef<StateChangeType>();

  // store and track the "previous" state, as a ref. updating as a side-effect
  // allows us to choose when to update this ref
  const prevStateRef = React.useRef<ComponentState>();

  // const propsRef = React.useRef<Props>(props);

  // return either the internal changes based on our state reducer,
  // or the internal changes based on the user's recommendations
  const controlledReducer = React.useCallback(
    (state: ComponentState, action) => {
      actionRef.current = action;
      const internalChanges = reducer(state, action);
      if (props && props.stateReducer) {
        const userRecommendedChanges = props.stateReducer(state, ({
          action,
          changes: internalChanges
        } as unknown) as ActionAndChanges);
        console.log('[USER_RECOMMENDED_CHANGES]:', userRecommendedChanges);
        return userRecommendedChanges;
      }
      return internalChanges;
    },
    [props, reducer]
  );

  const [state, dispatch] = React.useReducer(controlledReducer, initialState);

  // our component calls this dispatch function with props added as a convenience
  // this function saves us from having to declare props on every dispatch,
  // if we declared useReducer within the component itself
  const dispatchWithProps = React.useCallback(
    ({ type, ...rest }: { type: StateChangeType }) => {
      // dispatch({ type, props: propsRef.current });
      dispatch({ type, props, ...rest });
    },
    [props]
  );

  // recall: useEffect runs after the render phase, therefore
  // the reference of state is the most up-to-date state
  // and prevStateRef references the state from the previous render
  React.useEffect(() => {
    if (actionRef.current && prevStateRef.current && prevStateRef.current !== state) {
      onStateChange(props, prevStateRef.current, state);
    }
    prevStateRef.current = state;
  }, [props, state]);

  return [state, dispatchWithProps];
}

// Calls any callback the users' of our component have registered when a piece of state
// has changed
export function onStateChange<ComponentProps, ComponentState>(
  props: ComponentProps,
  state: ComponentState,
  newState: ComponentState
) {
  for (let pieceOfState in state) {
    const stateValue = state[pieceOfState];
    const newStateValue = newState[pieceOfState];
    if (stateValue !== newStateValue) {
      invokeOnStateChange(pieceOfState, props, state, newState);
    }
  }
}

export function invokeOnStateChange<
  ComponentProps extends Record<string, any>,
  ComponentState
>(
  pieceOfState: keyof ComponentState,
  props: ComponentProps,
  state: ComponentState,
  newState: ComponentState
) {
  const statePiece = capitalizeString(pieceOfState as string);
  const stateChangeCallback = `on${statePiece}Change`;
  if (stateChangeCallback in props) {
    const test = props[stateChangeCallback](newState[pieceOfState]);
  }
}

export function capitalizeString(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function generateId() {
  return Math.floor(Math.random() * 1000);
}

export function normalizeKey(e: React.KeyboardEvent) {
  return {
    name: e.key,
    code: e.charCode
  };
}

export function getNewIndex(
  currentIndex: number,
  length: number,
  action: BL.ComboboxActions
): number {
  switch (action) {
    case BL.ComboboxActions.INPUT_KEYDOWN_ARROW_DOWN: {
      if (currentIndex === length - 1) return currentIndex;
      return currentIndex + 1;
    }
    case BL.ComboboxActions.INPUT_KEYDOWN_ARROW_UP: {
      if (currentIndex === -1) return currentIndex;
      return currentIndex - 1;
    }
    case BL.ComboboxActions.INPUT_KEYDOWN_ARROW_LEFT: {
      if (currentIndex === -1 || currentIndex === 0) return currentIndex;
      return currentIndex - 1;
    }
    case BL.ComboboxActions.INPUT_KEYDOWN_ARROW_RIGHT: {
      if (currentIndex === length - 1 || currentIndex === -1) return currentIndex;
      return currentIndex + 1;
    }
    default:
      return 0;
  }
}
