import './index.less'
//这是新加的内容

if(module && module.hot) {
  module.hot.accept()
}
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
  console.log('123445')
}

const arr1 = [
  [1,'a', '1'],
  [2,'b', '2'],
  [3,'c', '3'],
  [4,'d', '4'],
  [5,'e', '5']
]

let newArr1 = Array.from(Array(3), (_, index) => arr1.map(v => v[index]))

console.log(JSON.parse(JSON.stringify(arr1)))
