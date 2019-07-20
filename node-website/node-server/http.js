const http = require('http')
const url = require('url')
const logUtil = require('log')

logUtil.log('hello')

const server = http.createServer((req, res) => {
    parseUrl(req)
    // 设置响应头
    res.writeHead(200, {
        'Content-Type': 'text/html;chartset=utf-8'
    })

    // 往页面打印值
    res.write('<h1 style="text-align:center">hello nodejs</h1>')

    // 结束响应
    res.end()
})
server.listen(3000)

function parseUrl(request) {
    if (request.url !== '/favicon.ico') {
        const result = url.parse(request.url, true)
        console.log(result)
        console.log(result.query.name)
        console.log(result.query.school)
    }
}