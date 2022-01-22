import React from 'react';
export function useAbortController() {
  const abortControllerRef = React.useRef<AbortController>();

  // our abort controller is declared once on initial render
  const getAbortController = React.useCallback(() => {
    if (!abortControllerRef.current) {
      abortControllerRef.current = new AbortController();
    }
    return abortControllerRef.current;
  }, []);

  // callback ran when we need to create a new abort controller
  const createNewAbortController = React.useCallback(() => {
    abortControllerRef.current = new AbortController();
  }, []);

  const forceAbort = React.useCallback(() => {
    if (getAbortController()) {
      // abort the previous request
      getAbortController().abort();
    }
  }, []);

  // when the component unmounts/re-renders, abort any existing requests
  // to prevent memory leaks
  React.useEffect(() => {
    return () => getAbortController().abort();
  }, [getAbortController]);

  // when we call getSignal, we cancel any outstanding requests
  // and create a new instance of an abort controller
  // then return the signal for the requesting code
  const getSignal = React.useCallback(() => {
    if (getAbortController()) {
      // abort the previous request
      getAbortController().abort();
      createNewAbortController();
    }

    return getAbortController().signal;
  }, [getAbortController, createNewAbortController]);

  return { getSignal, forceAbort };
}
