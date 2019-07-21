const fs = require('fs')
// 引入 event 事件模块
const events = require('events')

const emitter = new events.EventEmitter()

fs.readFile('./ext.json', (err, data) => {
    emitter.emit('result', data.toString())
})

emitter.on('result', (data) => {
    console.log(data)
})