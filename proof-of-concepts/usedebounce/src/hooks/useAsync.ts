import React from 'react';
import useDebounce from './useDebounce';
import {
  UseAsyncStatus,
  UseAsyncProps,
  UseAsyncResponse,
  UseAsyncState,
  UseAsyncAction
} from '../types';

function asyncReducer(state: UseAsyncState, action: UseAsyncAction) {
  const newState = { ...state };
  switch (action.type) {
    case UseAsyncStatus.IDLE: {
      return newState;
    }
    case UseAsyncStatus.PENDING: {
      return newState;
    }
    case UseAsyncStatus.RESOLVED: {
      return newState;
    }
    case UseAsyncStatus.REJECTED: {
      return newState;
    }
    default: {
      throw new TypeError(`Unhandled Action Type. Received ${action.type}`);
    }
  }
}

export default function useAsync(
  asyncCallback: () => Promise<any>,
  initialState: UseAsyncState,
  dependencies: any[]
): UseAsyncResponse {
  const [state, dispatch] = React.useReducer(asyncReducer, initialState);

  React.useEffect(() => {
    const promise = asyncCallback();
    if (!promise) {
      return;
    }
    dispatch({ type: UseAsyncStatus.PENDING });
    promise.then(
      (onFulfilled: any) => {
        console.log(onFulfilled);
        dispatch({ type: UseAsyncStatus.RESOLVED, data: onFulfilled });
      },
      (onRejected: any) => {
        dispatch({ type: UseAsyncStatus.REJECTED, data: onRejected });
      }
    );
  }, dependencies);

  return {
    data: state.data,
    status: state.status,
    error: state.error
  };
}
/**
debounce making a fetch request

if there is a pending request when a new request is made
  cancel the pending request
*/
