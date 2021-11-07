import React from 'react';
import { BL, ComponentProps } from './types';

export const initialState: BL.ComboboxState = {
  selectedItem: null,
  isOpen: false,
  highlightedIndex: -1,
  inputValue: ''
};

export function computeInitialState(props: BL.ComboboxProps): BL.ComboboxState {
  const isOpen = getInitialValue(props, 'isOpen');
  const inputValue = getInitialValue(props, 'inputValue');
  const highlightedIndex = getInitialValue(props, 'highlightedIndex');
  const selectedItem = getInitialValue(props, 'selectedItem');

  return {
    isOpen,
    inputValue,
    highlightedIndex: isOpen ? (highlightedIndex !== -1 ? highlightedIndex : 0) : -1,
    selectedItem
  } as BL.ComboboxState;
}

/**
 * Use the keys of state to get the initial values of properties defined in props
 * Props and State share the same keys.
 */
export function getInitialValue(
  props: BL.ComboboxProps,
  propKey: keyof BL.ComboboxState
): Partial<BL.ComboboxState> {
  if (propKey in props) {
    return props[propKey as keyof BL.ComboboxProps] as Partial<BL.ComboboxState>;
  }

  // get the user-provided initial prop state, it is a piece of state
  const initialPropKey = `initial${capitalizeString(
    propKey
  )}` as keyof BL.ComboboxProps;
  if (props[initialPropKey]) {
    return props[initialPropKey] as Partial<BL.ComboboxState>;
  }

  // return values from statically defined initial state object
  return initialState[propKey] as Partial<BL.ComboboxState>;
}

/**
 * Generates unique ids for the combobox component to avoid naming conflicts w/ other ids
 */
export function useElementId({
  id = `bottomline-${generateId()}`,
  labelId,
  inputId,
  menuId
}: Partial<BL.ComboboxProps>) {
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
    ({ type }: { type: StateChangeType }) => {
      dispatch({ type, ...props });
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
  const prop = capitalizeString(pieceOfState as string);
  const stateChangeCallback = `on${prop}Change`;
  if (stateChangeCallback in props) {
    props[stateChangeCallback]({ changes: newState });
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
