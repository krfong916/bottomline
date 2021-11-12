import React from 'react';
import useDebounce from './hooks/useDebouncedCallback';
import useAsync from './hooks/useAsync';
import { UseAsyncStatus, UseAsyncProps, UseAsyncResponse } from './types';
import { fetchData } from './fetchData';
const endpointAPI = 'http://localhost:3001/results';

export default function App() {
  const [value, setValue] = React.useState('');
  const debounce = useDebouncedCallback(
    (userValue: string) => {
      setValue(userValue);
    },
    3000,
    { trailing: true }
  );

  const fetchResults: UseAsyncResponse = useAsync(
    () => {
      if (value) {
        return fetchData(endpointAPI);
      }
    },
    { status: UseAsyncStatus.IDLE },
    [value]
  );

  const { data: items, error, status } = fetchResults;
  if (status === UseAsyncStatus.IDLE) {
  } else if (status === UseAsyncStatus.PENDING) {
  } else if (status === UseAsyncStatus.RESOLVED) {
  }

  return (
    <div className="App">
      <input
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          debounce(e.currentTarget.value)
        }
      ></input>
    </div>
  );
}
