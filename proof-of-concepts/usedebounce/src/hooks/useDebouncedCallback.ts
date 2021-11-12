import React, { useRef } from 'react';

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
  const fnRef = useRef();
  const delayRef = useRef(delay);

  if (typeof fn !== 'function') {
    throw new TypeError(
      `Must define a function as callback to use this hook. Expected function, received ${typeof fn}`
    );
  }

  /**
   * Re-computes the memoized value when one of the dependencies have changed
   */
  const debounce = React.useMemo(() => {
    // run the fn the user specified
    // based on the arguments
    const func: DebouncedReturnFunction<T> = (
      ...args: Parameters<T>
    ): ReturnType<T> => {};
    return func;
  }, []);

  // debounce is a function that encapsulates the memo call it will accepts a variable amount of arguments
  return debounce;
}
