import React, { useRef } from 'react';

const noop = () => {};

export type UseDebounceOptions = {
  leading?: boolean;
  trailing?: boolean;
};

/**
 * Debounce function callback that invokes your function that you passed in as argument to `useDebouncedCallback`
 *
 * More details: the function callback uses a TypeVariable `T` to capture the type of function you provide
 * and the return type of your function callback
 * The function callback also uses the utility type Parameters to capture the types of parameters that your function callback expects
 */
export interface DebouncedReturnFunction<
  T extends (...args: any[]) => ReturnType<T>
> {
  (...args: Parameters<T>): ReturnType<T> | undefined;
}

export default function useDebouncedCallback<
  T extends (...args: any[]) => ReturnType<T>
>(fn: T, delay: number, options: UseDebounceOptions) {
  const { leading = false, trailing = true } = options;
  const fnRef = useRef(fn);
  const delayRef = useRef(delay);
  const resultRef = useRef<ReturnType<T>>();
  const startTimeRef = useRef();
  const timerIDRef = useRef<NodeJS.Timeout>();
  const isLeading = useRef(leading);
  const isTrailing = useRef(trailing);

  if (typeof fn !== 'function') {
    throw new TypeError(
      `Must define a function as callback to use this hook. Expected function, received ${typeof fn}`
    );
  }

  /**
   * Re-computes the memoized value when one of the dependencies have changed
   */
  const debounce = React.useMemo(() => {
    const timersDontExist = () => !timerIDRef.current && !startTimeRef.current;

    const clearTimer = () => {
      startTimeRef.current = undefined;
      timerIDRef.current = undefined;
    };

    const resetTimer = () => {
      if (timerIDRef.current) {
        clearTimeout(timerIDRef.current);
        setTimeout(() => {}, delayRef.current);
      }
    };

    const shouldInvoke = (currentTime: number) => {
      if (timersDontExist()) {
        return true;
      } else if (startTimeRef.current) {
        const elapsed = currentTime - startTimeRef.current;
        if (elapsed >= delayRef.current) return true;
      }
      return false;
    };

    // run the fn the user specified
    // based on the arguments
    const func: DebouncedReturnFunction<T> = (
      ...args: Parameters<T>
    ): ReturnType<T> | undefined => {
      const currentTime = Date.now();
      const invocable = shouldInvoke(currentTime);
      let scheduledFn = noop;

      if (invocable) {
        if (isLeading) fnRef.current(...args);

        if (isTrailing) scheduledFn = () => fnRef.current(...args);

        timerIDRef.current = setTimeout(() => {
          scheduledFn();
          clearTimer();
        }, delayRef.current);
      } else {
        resetTimer();
      }
      return resultRef.current;
    };
    return func;
  }, []);

  // debounce is a function that encapsulates the memo call it will accepts a variable amount of arguments
  return debounce;
}

// invocable means
// either time has passed and we can invoke
// invoke, then reset and start timer
// or the option is leading
// invoke, then set and start the timer
// trailing
// set and start the timer, invoke after
// if it's not invocable does that mean that we run the timer
// what happens if it is not invocable?
// do we have a timeout currently running?
// if so, reset the timeout
// if not, then start the timeout
// and assign the id
// this sounds the same
