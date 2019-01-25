import {exclude} from 'ctx-react'
export default class {
  name = 'zz'
  age = 0
  fav = {
    count: 1
  }
  @exclude temp = 'temp'

  say(){
    this.age = false
  }
  setFavCount(){
    this.fav.count++
  }
  setTemp(){
    this.temp+='z'
  }
  addData(){
    this.d = 'aaaaaaa'
  }
}