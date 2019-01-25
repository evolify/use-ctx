import React from 'react'
import { Provider, Consumer } from 'ctx-react'
import Store from './Store'
import Comp from './comp/Comp'
import Act from './comp/Act'

@Provider(new Store())
@Consumer
export default class App extends React.Component {
  render() {
    console.log(this.props)
    const { age, fav: {count},temp, say, setFavCount, setTemp, addData } = this.props
    return (
      <div>
      <div style={{fontSize: 40}} onClick={say}>age: { age }</div >
      <div style={{fontSize: 40}} onClick={setFavCount}>favcount: { count }</div >
      <div style={{fontSize: 40}} onClick={setTemp}>temp: { temp }</div >
      <button onClick={addData}>add data</button>
      <Comp/>
      </div>
    )
  }
}