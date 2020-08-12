import * as React from 'react'
import { getProvider, getConsumer } from './utils'

const { createContext, useContext } = React

export const Context = createContext(null)

export const provider = getProvider(Context)

export const withProvider = getProvider(Context)

export const consumer = getConsumer(Context)

export const useCtx = () => useContext(Context)

export default (function (initialState?: any) {
  const ctx = React.createContext(initialState)
  return {
    Context: ctx,
    provider: getProvider(ctx),
    consumer: getConsumer(ctx),
    withProvider: getProvider(ctx),
    useCtx: () => useContext(ctx)
  }
})()

export function exclude(target: any, key: string) {
  target.__excludeKeys = [key].concat(target.__excludeKeys || ['__excludeKeys'])
}
