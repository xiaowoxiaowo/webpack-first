if(module && module.hot) {
  module.hot.accept()
}

import './index.less'
class Animal {
  constructor(name) {
    this.name = name
  }
  getName() {
    return this.name
  }
}

const dog = new Animal('dogg')

let arr = ['1', '2', '3']
let newArr = arr.forEach(res => {
  res = '2'
})
console.log(arr)

document.getElementById('btn').onclick = function() {
  /*import('./handle').then(fn => {
    fn.default()
  })*/
  console.log('22')
}
