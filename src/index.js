import './index.less'
class Animal {
  constructor(name) {
    this.name = name
  }
  getName() {
    return this.name
  }
}

const dog = new Animal('dog')

let arr = ['1', '2', '3']
let newArr = arr.forEach(res => {
  res = '2'
})
console.log(arr)