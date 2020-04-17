const tar = new Map([['name', 'stone'], ['age', 18]])

// // for of 迭代
// for (let item of tar) {
//     console.log('item', item)
// }

// // forEach 迭代
// tar.forEach((key, value) => {
//     console.log('key', key, value)
// })

const myMap = new Map()
myMap.set(NaN, 'stone')
console.log([...tar])

