import React from 'react'

class ProviderClass extends React.Component {
  state = {
    val: {}
  }
  constructor(props) {
    super(props)
    let { stores } = props
    stores = stores.map(store => this.observe(store, () => this.update(stores)))
    this.state = {
      val: this.valueOf(stores)
    }
  }
  update(stores) {
    this.setState({
      val: this.valueOf(stores)
    })
  }
  observe(data, update) {
    if (!data || !(data instanceof Object)) {
      return data
    }
    return new Proxy(data, {
      set: (target, key, value, proxy) => {
        if (value === target[key]) {
          return true
        }
        Reflect.set(target, key, value, proxy)
        if (!this.__excludeKeys || this.__excludeKeys.every(k => k !== key)) {
          update(proxy)
        }
        return true
      },
      get: (target, key, proxy) => {
        if(key in target.__proto__){
          return Reflect.get(target, key, proxy)
        }
        return this.observe(Reflect.get(target,key,proxy), update)
      }
    })
  }
  valueOf(stores) {
    const val = {}
    stores.forEach(store => {
      const keys = [...Reflect.ownKeys(store), ...Reflect.ownKeys(store.__proto__)]
      keys.filter(k => !(store.__excludeKeys && store.__excludeKeys.some(_k => _k === k))).forEach(k => {
        let t = store[k]
        val[k] = t instanceof Function ? t.bind(store) : t
      })
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
const provider = ctx => (...stores) => Comp => props => {

  return (
    <ProviderClass ctx={ctx} stores={stores}>
      <Comp {...props} />
    </ProviderClass>
  )
}

const renderConsumer = (Consumer, Comp, mapToProps) => props => (
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

const isReactComponent = c => {
  return c && Reflect.ownKeys(React.Component.prototype).every(k => Reflect.ownKeys(c.prototype.__proto__).some(t => t === k))
}

const consumer = ctx => (...keys) => {
  if (keys.length && isReactComponent(keys[0])) {
    return renderConsumer(ctx.Consumer, keys[0])
  }
  const mapToProps = !keys.length ? null : val => {
    let p = {}
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
  return Comp => renderConsumer(ctx.Consumer, Comp, mapToProps)
}

export const Context = React.createContext()

export const Provider = provider(Context)

export const Consumer = consumer(Context)

export default (function (initialState) {
  const ctx = React.createContext(initialState)
  return {
    Context: ctx,
    Provider: provider(ctx),
    Consumer: consumer(ctx)
  }
})()

export function exclude(target, key) {
  target.__excludeKeys = [key].concat(target.__excludeKeys || ['__excludeKeys'])
}
