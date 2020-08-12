# use-ctx
Simple、reactive state management based on React Context Api and hooks. 

With es6 Proxy and React Context Api, you can manage you state with simple js class.

### Usage：

1. install use-ctx:

   ```shell
   yarn add use-ctx
   ```

2. For a better development experience, you can add `decorators` and `class-properties` to your babel plugins:

   ```shell
   yarn add -D @babel/plugin-proposal-decorators @babel/plugin-proposal-class-properties
   ```

   add add them to your .babelrc

   ```json
   {
     "plugins": [
       ["@babel/proposal-decorators",{
         "legacy": true
         }],
       ["@babel/proposal-class-properties",{
         "loose": true
       }]
     ]
   }
   ```

3. Now write your store class, just a simple es6 class:

   ```js
   import axios from 'axios'
   class Store {
     userId = 00001
     userName = zz
     addr = {
       province: 'Zhejiang',
       city: 'Hangzhou'
     }
   
     login() {
       axios.post('/login', {
         // login data
       }).then(({ userId, userName, prov, city }) => {
         this.userId = userId
         this.userName = userName
         this.addr.province = prov
         this.addr.city = city
       })
     }
   }
   export default new Store()
   ```

4. Connect the Store to your root component: 

   * for class component, use`provider` decorator

   ```jsx
   import React from 'react'
   import { provider } from 'use-ctx'
   import store from './Store'
   import Page from './Page'
   
   @provider(store)
   export default class App extends React.Component {
     render(){
       return(
         <Page />
       )
     }
   }
   ```

   * for functional component, use `withProvider`:

   ```jsx
   import React from 'react'
   import { withProvider } from 'use-ctx'
   import store from './Store'
   import Page from './Page'
   
   function App(){
     return(
       <Page />
     )
   }
   
   export default withProvider(App)
   ```

   

5. Map data and function in your store to any Component:

   * for class component, use `consumer` decorator:

   ```jsx
   import React from 'react'
   import { consumer } from 'use-ctx'
   
   @consumer
   export default class Page extends React.Component {
     render(){
       const {userId, userName, addr:{province,city}, login} = this.props
       return(
         <div>
           <div className="user-id">{userId}</div>
           <div className="user-name">{userName}</div>
           <div className="addr-prov">{province}</div>
           <div className="addr-city">{city}</div>
           {/* form */}
           <button onClick={login}>Login</button>
         </div>
       )
     }
   }
   ```

   * for functional component, use `useCtx` hook:

   ```jsx
   import React from 'react'
   import { useCtx } from 'use-ctx'
   
   export default function Page(){
     const {userId, userName, addr:{province,city}, login} = useCtx()
     return(
       <div>
         <div className="user-id">{userId}</div>
         <div className="user-name">{userName}</div>
         <div className="addr-prov">{province}</div>
         <div className="addr-city">{city}</div>
         {/* form */}
         <button onClick={login}>Login</button>
       </div>
     )
   }
   ```

   

That`s all, all you need to do is write a simple store class, and connect to the app with provider, anywhere you need to use the data and function, just use consumer.

Of course，there are some Additional usage:

```js
import axios from 'axios'
import { exclude } from 'use-ctx'
// If you don`t want to connect some data to your app, you can use exclude.
class Store {
  userId = 00001
  userName = zz
  addr = {
    province: 'Zhejiang',
    city: 'Hangzhou'
  }
  @exclude temp = 'the data will not be proxied, and not be mapped to your props'

  login() {
    axios.post('/login', {
      // login data
    }).then(({ userId, userName, prov, city }) => {
      this.userId = userId
      this.userName = userName
      this.addr.province = prov
      this.addr.city = city
    })
  }
}
export default new Store()
```

By default, the `use-ctx` will export a provider and consumer from a default Context, if you wan't to use multi Context, just import the Context, and use provider and consumer from it:

```jsx
c// App.jsx
import React from 'react'
import Context, {provider} from 'use-ctx'
import store from './Store'
import store1 from './Store1'
import Page from './Page'
import Page1 from './Page1'

const {provider: provider1, consumer: consumer1} = Context

@provider(store)
@provider1(store1)
export default class App extends React.Component {
  render(){
    return(
      <Page />
      <Page1 />
    )
  }
}

export consumer1
```

```jsx
// Page1.jsx
import {consumer1} from './App.jsx'

@consumer1
// ...
```



You want to connect more than store to your app ?  Just add more store to Provider as you want:

```jsx
import { provider } from 'use-ctx'
import store1 from './Store1'
import store2 from './Store2'
import store3 from './Store3'

@provider({store1, store2, store3})
// other code ...
```

But you don`t want to map all data and function to the props ? just add keys you want to the consumer:

```jsx
import { Consumer } from 'use-ctx'

@consumer('userId', 'userName', 'login')
// other code ...
```

Or you can add a function to map the data:

```jsx
import { consumer } from 'use-ctx'

@consumer(data => ({
  prov: data.addr.provvince,
  city: data.addr.city
}))
// other code ...
```

What about this ?

```jsx
import { consumer } from 'use-ctx'

@Consumer('userId',data => ({
  prov: data.addr.provvince,
  city: data.addr.city
}),'userName')
// other code ...
```

Yes, just do what you want.
