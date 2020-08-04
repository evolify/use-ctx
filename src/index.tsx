import React, { createContext, useContext } from 'react'
import { provider, consumer } from './utils'


export const Context = createContext(null)

export const Provider = provider(Context)

export const Consumer = consumer(Context)

export const useCtx = () => useContext(Context)

export default (function (initialState?: any) {
  const ctx = React.createContext(initialState)
  return {
    Context: ctx,
    Provider: provider(ctx),
    Consumer: consumer(ctx),
    useCtx: () => useContext(ctx)
  }
})()

export function exclude(target: any, key: string) {
  target.__excludeKeys = [key].concat(target.__excludeKeys || ['__excludeKeys'])
}
