Hooks keeps reference of a state object for the component, as well as the component lifecycle metadata

- number of calls etc.
- mount and unmount (put into virtual and actual DOM tree, remove from virtual DOM and acutal DOM)

useState

- the initial render, variables are placed into a memoized state object
- on subsequent calls,
- if a state value did not update, useState does not re-render that specific state slice
- useState takes the newValue updates the memoized defaultValue
- memoizing state to prevent unnecessary re-renders

Hooks Composition

- useEffect
