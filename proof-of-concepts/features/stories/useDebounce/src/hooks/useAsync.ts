import React from 'react';
import {
  UseAsyncStatus,
  UseAsyncResponse,
  UseAsyncState,
  UseAsyncAction,
  UseAsyncProps
} from '../types';

function asyncReducer(state: UseAsyncState, action: UseAsyncAction) {
  const newState = { ...state };
  switch (action.type) {
    case UseAsyncStatus.PENDING: {
      console.log('[USE_ASYNC_STATUS_PENDING]');
      console.log('action:', action);
      console.log('state:', newState);
      return { status: UseAsyncStatus.PENDING, data: null, error: null };
    }
    case UseAsyncStatus.RESOLVED: {
      console.log('[USE_ASYNC_STATUS_RESOLVED]');
      console.log('action:', action);
      console.log('state:', newState);
      return { status: UseAsyncStatus.RESOLVED, data: action.data, error: null };
    }
    case UseAsyncStatus.REJECTED: {
      console.log('[USE_ASYNC_STATUS_REJECTED]');
      console.log('action:', action);
      console.log('state:', newState);
      return { status: UseAsyncStatus.REJECTED, data: null, error: action.error };
    }
    default: {
      throw new TypeError(`Unhandled Action Type. Received ${action.type}`);
    }
  }
}

export default function useAsync<
  T extends (...args: any[]) => Promise<any> | undefined
>(props: UseAsyncProps): UseAsyncResponse {
  const [state, dispatch] = React.useReducer(asyncReducer, {
    status: UseAsyncStatus.PENDING,
    data: null,
    error: null,
    ...props.initialState
  });

  const { status, data, error } = state;

  const run = React.useCallback((promise) => {
    dispatch({ type: UseAsyncStatus.PENDING });
    promise.then(
      (onFulfilled: any) => {
        dispatch({ type: UseAsyncStatus.RESOLVED, data: onFulfilled });
      },
      (onRejected: any) => {
        dispatch({ type: UseAsyncStatus.REJECTED, error: onRejected });
      }
    );
  }, []);

  return {
    data,
    status,
    error,
    run
  };
}
