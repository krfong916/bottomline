export interface ComponentProps<State, ActionAndChanges> {
  stateReducer?: (state: State, actionAndChanges: ActionAndChanges) => State;
}

export type ItemsList = Record<string, any>;
