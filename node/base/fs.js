const fs = require('fs')
// const data = fs.readFileSync('./data.js')
// console.log(data.toString())
fs.readFile('./data.js', (err, data) => {
    console.log(data.toString())
})

const read = fs.createReadStream('./data.js')
const write = fs.createWriteStream('./data2.js')
read.pipe(write)