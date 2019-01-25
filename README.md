# ctx-react
Simple、reactive state management based on React Context Api. 

With es6 Proxy and React Context Api, you can manage you state with simple js class.

### Usage：

1. install ctx-react:

   ```shell
   yaran add ctx-react
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
     userId: 00001
     userName: zz
     addr: {
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

4. Connect the Store to React class with Provider:

   ```jsx
   import React from 'react'
   import {Provider} from 'ctx-react'
   import store from './Store'
   import Page from './Page'
   
   @Provider(store)
   export default class App extends React.Component {
     render(){
       return(
         <Page />
       )
     }
   }
   ```

5. Map data and function in your store to any Component with Consumer:

   ```jsx
   import React from 'react'
   import {Consumer} from 'ctx-react'
   
   @Consumer
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



That`s all, all you need to do is write a simple store class, and connect to the app with Provider, anywhere you need to use the data and function, just use consumer.

Of course，there are some Additional usage:

```js
import axios from 'axios'
import {exclude} from 'ctx-react'
// If you don`t want to connect some data to your app, you can use exclude.
class Store {
  userId: 00001
  userName: zz
  addr: {
    province: 'Zhejiang',
    city: 'Hangzhou'
  }
  @exclude temp: 'the data will not be proxied, and not be mapped to your props'

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

By default, the `ctx-react` will export a Provider and Consumer from a default Context, if you wan't to use multi Context, just import the Context, and use Provider and Consumer from it:

```jsx
// App.jsx
import React from 'react'
import Context, {Provider} from 'ctx-react'
import store from './Store'
import store1 from './Store1'
import Page from './Page'
import Page1 from './Page1'

const {Provider1,Consumer1} = Context

@Provider(store)
@Provider1(store)
export default class App extends React.Component {
  render(){
    return(
      <Page />
      <Page1 />
    )
  }
}

export Consumer1
```

```jsx
// Page1.jsx
import {Consumer1} from './App.jsx'

@Consumer1
// ...
```



You want to connect more than store to your app ?  Just add more store to Provider as you want:

```jsx
import { Provider } from 'ctx-react'
import store1 from './Store1'
import store2 from './Store2'
import store3 from './Store3'

@Provider(store1, store2, store3)
// other code ...
```

But you don`t want to map all data and function to the props ? just add keys you want to the Consumer:

```jsx
import { Consumer } from 'ctx-react'

@Consumer('userId', 'userName', 'login')
// other code ...
```

Or you can add a function to map the data:

```jsx
import { Consumer } from 'ctx-react'

@Consumer(data => ({
  prov: data.addr.provvince,
  city: data.addr.city
}))
// other code ...
```

What about this ?

```jsx
import { Consumer } from 'ctx-react'

@Consumer('userId',data => ({
  prov: data.addr.provvince,
  city: data.addr.city
}),'userName')
// other code ...
```

Yes, just do what you want.

### Future Feature:

* Add scoop to the data.
* ...