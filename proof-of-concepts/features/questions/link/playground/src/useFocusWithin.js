import { useRef } from 'react';

export function useFocusWithin(props) {
  let state = useRef({ isFocusWithin: false }).current;

  if (props.isDisabled) {
    return { focusWithinProps: {} };
  }

  let onFocus = (e) => {
    console.log('event:', e);
    if (e.current) console.log('current: ', e.current);
    console.log('FOCUS MOTHERFUCKER:', e);
    if (!state.isFocusWithin) {
      if (props.onFocusWithin) {
        props.onFocusWithin(e);
      }

      if (props.onFocusWithinChange) {
        props.onFocusWithinChange(true);
      }

      state.isFocusWithin = true;
    }
  };

  let onBlur = (e) => {
    if (state.isFocusWithin && !e.currentTarget.contains(e.relatedTarget)) {
      if (props.onBlurWithin) {
        props.onBlurWithin(e);
      }

      if (props.onFocusWithinChange) {
        props.onFocusWithinChange(false);
      }

      state.isFocusWithin = false;
    }
  };

  return {
    focusWithinProps: {
      onFocus: onFocus,
      onBlur: onBlur
    }
  };
}
