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
