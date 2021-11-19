export interface UseAsyncProps {
  initialState: UseAsyncState;
}

export enum UseAsyncStatus {
  IDLE = '[idle]',
  RESOLVED = '[resolved]',
  REJECTED = '[rejected]',
  PENDING = '[pending]'
}

export type UseAsyncAction = {
  type: UseAsyncStatus;
  data?: any;
  error?: any;
};

export type UseAsyncState = {
  status: UseAsyncStatus;
  data?: any;
  error?: any;
};

export type UseAsyncResponse = {
  status: UseAsyncStatus;
  data: any;
  error: any;
  run: (promise: any) => any;
};
