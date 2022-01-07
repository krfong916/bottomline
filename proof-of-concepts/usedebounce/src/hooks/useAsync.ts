import React from 'react';
import {
  UseAsyncStatus,
  UseAsyncResponse,
  UseAsyncState,
  UseAsyncAction
} from '../types';

function asyncReducer(state: UseAsyncState, action: UseAsyncAction) {
  const newState = { ...state };
  switch (action.type) {
    case UseAsyncStatus.IDLE: {
      console.log('[IDLE]');
      console.log('action:', action);
      console.log('state:', newState);
      newState.status = action.type;
      return newState;
    }
    case UseAsyncStatus.PENDING: {
      console.log('[PENDING]');
      console.log('action:', action);
      console.log('state:', newState);
      newState.status = action.type;
      return newState;
    }
    case UseAsyncStatus.RESOLVED: {
      console.log('[RESOLVED]');
      console.log('action:', action);
      console.log('state:', newState);
      newState.status = action.type;
      newState.data = action.data;
      return newState;
    }
    case UseAsyncStatus.REJECTED: {
      console.log('[REJECTED]');
      console.log('action:', action);
      console.log('state:', newState);
      newState.status = action.type;
      return newState;
    }
    default: {
      throw new TypeError(`Unhandled Action Type. Received ${action.type}`);
    }
  }
}

export default function useAsync<
  T extends (...args: any[]) => Promise<any> | undefined
>(
  asyncCallback: T,
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
