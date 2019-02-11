import React from 'react'
import { Provider, Consumer } from '../../src/index'
import Store from './Store'
// import Comp from './comp/Comp'
import Act from './comp/Act'

@Provider(new Store())
@Consumer
export default class App extends React.Component {
  render() {
    console.log(this.props)
    const { list, age, fav: {count},temp, say, setFavCount, setTemp, addData } = this.props
    return (
      <div>
        {JSON.stringify(list)}
      <div style={{fontSize: 40}} onClick={say}>age: { age }</div >
      <div style={{fontSize: 40}} onClick={setFavCount}>favcount: { count }</div >
      <div style={{fontSize: 40}} onClick={setTemp}>temp: { temp }</div >
      {
        list.map((t,i)=>(
          <span key={i}>{t}--</span>
        ))
      }
      <button onClick={addData}>add data</button>
      {/* <Comp/> */}
      </div>
    )
  }
}