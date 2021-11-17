// const abortController = React.useRef();
// const signal = abortController.signal;
// will delay calling a function
// the function to delay is the fetch request
// fetch(endpoint, { signal })
export function fetchData(endpoint: string) {
  return window
    .fetch(endpoint, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    })
    .then((res) => res.json())
    .catch((error) => Promise.reject(error));
}
