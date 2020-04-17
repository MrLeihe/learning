#!/usr/bin/env node
const util = require('util')
const EventEmitter = require('events')

const Myemitter = function () { }
util.inherits(Myemitter, EventEmitter)
const myemitter = new Myemitter()

myemitter.on('load', a => {
    console.log('a', a)
})

myemitter.emit('load', 100)
