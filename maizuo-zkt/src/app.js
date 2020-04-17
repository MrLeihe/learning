const express = require('express')
const router = require('./router/router.js')
const app = express()

app.use('/', router)

app.listen(3000, () => {
    console.log('server is listening on port 3000')
})