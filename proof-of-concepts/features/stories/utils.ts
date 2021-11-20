import React from 'react';
export function mergeRefs(...refs: React.MutableRefObject<any>[]) {
  return function(node: React.ReactElement) {
    // iterate over every ref
    // assign the node to the current ref
    refs.forEach((ref) => {
      ref.current = node;
    });
  };
}

export function callAllEventHandlers(...fns: ((...args: any[]) => any)[]) {
  return function(...args: any[]) {
    fns.forEach((fn) => {
      if (typeof fn === 'function') {
        fn(...args);
      }
    });
  };
}

export const noop = () => {};
// the ref property refers to?

// ref is a property on a JSX element
// react is a UI runtime that creates predictable UI
// so how is a ref actually assigned?
// well, we wait until all the elements are rendered on the page
// then the ref is assigned that node
// ref={fn()}
