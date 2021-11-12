export enum UseAsyncStatus {
  IDLE = '[idle]',
  RESOLVED = '[resolved]',
  REJECTED = '[rejected]',
  PENDING = '[pending]'
}

export type UseAsyncAction = {
  type: UseAsyncStatus;
  data?: any;
};

export interface UseAsyncProps {
  asyncCallback: (...args: any) => Promise<any>;
  initialState: any;
  endpoint: string;
  dependencies: any[];
}

export type UseAsyncState = {
  status: UseAsyncStatus;
  data?: any;
  error?: any;
};

export type UseAsyncResponse = {
  status: UseAsyncStatus;
  data: any;
  error: any;
};
