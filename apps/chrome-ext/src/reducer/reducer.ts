import type { GlobalState } from '../schema/reducer'

export function getDefaultGlobalState(): GlobalState {
  return {}
}

export function globalReducer<T extends keyof GlobalState>(
  state: GlobalState,
  actions: { type: T; value: GlobalState[T] }[],
) {
  const ret = { ...state }
  for (const action of actions) {
    ret[action.type] = action.value
  }
  return ret
}
