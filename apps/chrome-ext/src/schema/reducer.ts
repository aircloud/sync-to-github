export interface UserConfig {
  owner?: string
  repo?: string
  accessToken?: string
  pathPrefix?: string
  branch?: string
}

export interface GlobalState {
  userConfig?: UserConfig
}

export type IGlobalDispatchArgs<T extends keyof GlobalState> = {
  type: T
  value: GlobalState[T]
}

export type IGlobalDispatch = <T extends keyof GlobalState>(arg: IGlobalDispatchArgs<T>) => void

export type IGlobalBatchDispatchArgs<T extends keyof GlobalState> = {
  type: T
  value: GlobalState[T]
}[]

export type IGlobalBatchDispatch = <T extends keyof GlobalState>(
  arg: IGlobalBatchDispatchArgs<T>,
) => void

export interface GlobalServiceContextType {
  state: GlobalState
  dispatch: IGlobalDispatch
  batchDispatch: IGlobalBatchDispatch
}
