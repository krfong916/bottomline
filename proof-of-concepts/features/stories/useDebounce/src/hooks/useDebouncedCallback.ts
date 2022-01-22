import React, { useRef } from 'react';

const noop = () => {};

export type UseDebounceOptions = {
  leading?: boolean;
  trailing?: boolean;
};

export interface DebouncedReturnFunction<
  T extends (...args: any[]) => ReturnType<T>
> {
  (...args: Parameters<T>): ReturnType<T> | void;
}
/**
 * Debounce function callback that invokes your function that you passed in as argument to `useDebouncedCallback`
 *
 * More details: the function callback uses a TypeVariable `T` to capture the type of function you provide
 * and the return type of your function callback
 * The function callback also uses the utility type Parameters to capture the types of parameters that your function callback expects
 */

export default function useDebouncedCallback<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
  options: UseDebounceOptions
) {
  const { leading = false, trailing = true } = options;
  const fnRef = useRef(fn);
  const delayRef = useRef(delay);
  const timerIDRef = useRef<NodeJS.Timeout | null>(null);
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
    const func: DebouncedReturnFunction<T> = (...args: Parameters<T>) => {
      if (isLeading.current) {
        fnRef.current(...args);
      }

      if (timerIDRef.current) {
        clearTimeout(timerIDRef.current);
      }

      timerIDRef.current = setTimeout(() => {
        if (isTrailing) {
          fnRef.current(...args);
        }
      }, delayRef.current);
    };

    return func;
  }, []);

  // debounce is a function that encapsulates the memo call it will accepts a variable amount of arguments
  return debounce;
}
