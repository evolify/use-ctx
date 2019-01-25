import React from 'react'
import Ctx from 'ctx-react '
import Act from './Act'
import Store from '../Store';
const {Provider,Consumer} = Ctx

@Provider(new Store(), new Act())
@Consumer
export default class Comp extends React.Component {
  render() {
    const { a, b, c, d, temp, setA, setC,setTemp, setFavCount, fav: {count} } = this.props
    return (
      <code>
        <div style={{ fontSize: 40 }} onClick={setA}>a: {a}</div >
        <div style={{ fontSize: 40 }} onClick={setFavCount}>favcount: {count}</div >
        <div style={{ fontSize: 40 }} onClick={setTemp}>temp: {temp}</div >
        <div>{count}</div>
        {
          JSON.stringify(this.props)
        }
      </code>
    )
  }
}