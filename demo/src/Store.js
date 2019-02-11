import {exclude} from 'ctx-react'
export default class {
  name = 'zz'
  age = 0
  list = []
  fav = {
    count: 1
  }

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
    this.list.push(1)
  }
}