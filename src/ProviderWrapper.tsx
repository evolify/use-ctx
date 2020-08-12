import * as React from 'react'
import { IStore } from './types'

interface IProps {
  stores: any
  ctx: React.Context<any>
}

export default class ProviderWrapper extends React.Component<IProps, { val: object }> {
  state = {
    val: {}
  }
  constructor(props: IProps) {
    super(props)
    let { stores } = props
    stores = this.observe(stores, () => this.update(stores))
    console.log("store", stores)
    this.state = {
      val: this.valueOf(stores)
    }
  }
  update(stores: Array<any>) {
    this.setState({
      val: this.valueOf(stores)
    })
  }
  observe(data: IStore, update: Function): any {
    if (!data || !(data instanceof Object)) {
      return data
    }
    const res = new Proxy(data, {
      set: (target: IStore, key: string, value, proxy) => {
        if (value === target[key]) {
          return true
        }
        Reflect.set(target, key, value, proxy)
        if (!(target.__excludeKeys && target.__excludeKeys.includes(key))) {
          update(target)
        }
        return true
      },
      get: (target, key, proxy) => {
        let val = Reflect.get(target, key, proxy)
        if (key in target.__proto__) {
          return val
        }
        return this.observe(val, update)
      }
    })
    return res
  }
  valueOf(stores: any) {
    const val: any = {}
    const keys = [...Reflect.ownKeys(stores), ...Reflect.ownKeys(stores.__proto__)]
    keys.filter(k => typeof k === "string" && !(stores.__excludeKeys && stores.__excludeKeys.includes(k))).forEach((k: string) => {
      let t = stores[k]
      val[k] = t instanceof Function ? t.bind(stores) : t
    })
    return val
  }
  render() {
    const { ctx } = this.props
    return (
      <ctx.Provider value={this.state.val}>
        {this.props.children}
      </ctx.Provider>
    )
  }
}