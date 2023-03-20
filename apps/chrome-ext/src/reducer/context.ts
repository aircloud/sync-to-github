import React from 'react'
import type { GlobalServiceContextType } from '../schema/reducer'

export const GlobalContext =
  // @ts-expect-error ignore null
  React.createContext<GlobalServiceContextType>(null)
