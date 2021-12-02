import React from 'react';
import { ComponentProps } from './types';

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

// the ref property refers to?
// ref is a property on a JSX element
// react is a UI runtime that creates predictable UI
// so how is a ref actually assigned?
// well, we wait until all the elements are rendered on the page
// then the ref is assigned that node
// ref={fn()}
export function mergeRefs(...refs: (React.MutableRefObject<any> | undefined)[]) {
  return function(node: React.ReactElement<any>) {
    // iterate over every ref
    // assign the node to the current ref
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    });
  };
}

export function callAllEventHandlers(...fns: ((...args: any[]) => any)[]) {
  return function(...args: any[]) {
    fns.forEach((fn) => {
      if (typeof fn === 'function') {
        fn(...args);
      }
    });
  };
}

/**
 * Credits to Downshift
 * https://github.com/downshift-js/downshift/blob/26c93a539dad09e41adba69ddc3a7d7ecccfc8bb/src/hooks/utils.js#L316
 */
export function useMouseAndTracker(
  isOpen: boolean,
  refs: React.MutableRefObject[],
  handleBlur: (...args: any) => any
) {
  const mouseAndTrackerRef = React.useRef({
    isMouseDown: false,
    isTouchMove: false
  });

  React.useEffect(() => {
    const onMouseDown = () => {
      mouseAndTrackerRef.current.isMouseDown = true;
    };
    const onMouseUp = (e: React.SyntheticEvent) => {
      mouseAndTrackerRef.current.isMouseDown = false;
      if (isOpen && !isWithinBottomline(refs, e)) {
        console.log('[USE_MOUSE_TRACKER_BLUR]');
        handleBlur();
      }
    };
    const onTouchStart = () => {
      mouseAndTrackerRef.current.isTouchMove = true;
    };

    const onTouchMove = () => {
      mouseAndTrackerRef.current.isTouchMove = true;
    };

    const onTouchEnd = (e: React.SyntheticEvent) => {
      mouseAndTrackerRef.current.isTouchMove = false;
      if (isOpen && !isWithinBottomline(refs, e)) {
        handleBlur();
      }
    };

    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);

    return function() {
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [isOpen]);
  return mouseAndTrackerRef;
}

export function isWithinBottomline(
  refs: React.MutableRefObject[],
  event: React.SyntheticEvent<any>
) {
  return refs.some((ref) => {
    if (ref.current && event.target) {
      return ref.current.contains(event.target);
    } else {
      return false;
    }
  });
}

export const noop = () => {};

// chooses a random delay time before sending a request
export function delayRandomly() {
  const timeout = sample([1000, 2000, 5000, 7000, 10000]);
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}

export function throwRandomly() {
  const shouldThrow = sample([true, false, false, false]);
  if (shouldThrow) {
    throw new Error('simulated async failure');
  }
}

export function delayControlled() {
  const timeout = sample([5000, 10000]);
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}

function sample(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
