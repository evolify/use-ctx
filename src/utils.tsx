import React from 'react'
import ProviderWrapper from './ProviderWrapper'

const renderConsumer = (Consumer: React.Consumer<any>, Comp: React.ComponentType, mapToProps?: Function) => (props: any) => (
  <Consumer>
    {
      val => {
        let p = {
          ...(mapToProps && mapToProps instanceof Function ? mapToProps(val) : val),
          ...props
        }
        return <Comp {...p} />
      }
    }
  </Consumer>
)

export function isReactComponent(C: any) {
  return typeof C === 'function' && (
    C.prototype.isReactComponent ||
    /return.*\.createElement\(/.test(String(C))
  )
}

export const provider = (ctx: React.Context<any>) => (stores: any) => (Comp: React.ComponentType) => (props: any = {}) => {

  return (
    <ProviderWrapper ctx={ctx} stores={stores}>
      <Comp {...props} />
    </ProviderWrapper>
  )
}

export const consumer = (ctx: React.Context<any>) => (...keys: Array<any>) => {
  if (keys.length && isReactComponent(keys[0])) {
    return renderConsumer(ctx.Consumer, keys[0])
  }
  const mapToProps = !keys.length ? null : (val: any) => {
    let p: {
      [index: string]: any
    } = {}
    keys.forEach(key => {
      if (typeof key === 'string') {
        p[key] = val[key]
      } else if (key instanceof Function) {
        p = {
          ...p,
          ...key(val)
        }
      }
    })
    return p
  }
  return (Comp: React.ComponentType) => renderConsumer(ctx.Consumer, Comp, mapToProps)
}