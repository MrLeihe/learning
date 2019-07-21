const http = require('http')
const fs = require('fs')
const path = require('path')
const url = require('url')

// 创建服务
http.createServer((req, res) => {
    console.log(req.url)
    let pathName = url.parse(req.url).pathname
    if (pathName === '/') {
        pathName = 'index.html'
    }

    if (pathName === '/favicon.ico') {
        return false
    }

    fs.readFile('../webServer/' + pathName, (err, data) => {
        console.log('err-------->', err)
        if (err) {
            fs.readFile('../webServer/404.html', (error404, data404) => {
                if (error404) {
                    console.log(error404)
                } else {
                    // 将读取的内容返回
                    // 设置响应头
                    res.writeHead(200, {
                        'Content-Type': 'text/html,charset=utf-8'
                    })
                    // 写入数据
                    res.write(data)
                    // 结束响应
                    res.end()
                }
            })
        } else {
            const ext = getExt(path.extname(pathName))
            // 将读取的内容返回
            // 设置响应头
            res.writeHead(200, {
                'Content-Type': `${ext},charset=utf-8`
            })
            // 写入数据
            res.write(data)
            // 结束响应
            res.end()
        }
    })
}).listen(3000)

function getExt(extName) {
    const extJson = fs.readFileSync('./ext.json')
    const ext = JSON.parse(extJson)
    return ext[extName] ? ext[extName] : 'text/html'
}