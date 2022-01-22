import React from 'react';
import useDebouncedCallback from './hooks/useDebouncedCallback';
import useAsync from './hooks/useAsync';
import { UseAsyncStatus, UseAsyncResponse } from './types';
import { fetchData } from './fetchData';
const endpointAPI = 'http://localhost:3001/results';

export default function App() {
  const [value, setValue] = React.useState('');
  const debounce = useDebouncedCallback(
    (value: string) => {
      setValue(value);
    },
    4000,
    { trailing: true }
  );
  React.useEffect(() => {
    console.log('useEffect');
  });

  const fetchResults: UseAsyncResponse = useAsync(
    () => {
      if (value && value !== '') {
        return fetchData(endpointAPI);
      }
    },
    { status: UseAsyncStatus.IDLE },
    [value]
  );

  const { data: items, error, status } = fetchResults;
  if (status === UseAsyncStatus.IDLE) {
    console.log('we are idle');
  } else if (status === UseAsyncStatus.PENDING) {
    console.log('we are pending');
  } else if (status === UseAsyncStatus.RESOLVED) {
    console.log('we are resolved');
  } else {
    console.log('we are rejected');
  }

  return (
    <div className="App">
      <input
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          debounce(e.currentTarget.value)
        }
      ></input>
    </div>
  );
}
