import {exclude} from 'use-ctx'
export default class {
  a = 'zz'
  b = 0
  c = {
    d: 1
  }
  @exclude temp = 'temp'

  setA() {
    this.a = false
  }
  setC() {
    this.c.d++
  }
  setTemp() {
    this.temp += 'z'
  }
  addData() {
    this.e = 'aaaaaaa'
  }
}