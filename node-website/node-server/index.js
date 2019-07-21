const http = require("http")
const mysql = require('mysql')

http.createServer((req, res) => {
    // 设置允许跨域的域名， *表示任何域名
    res.setHeader('Access-Control-Allow-Origin', '*')
    // 设置 header 类型
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    // 允许跨域的请求方式
    res.setHeader('Content-Type', 'application/json')
    console.log('method', req.method)
    switch (req.method) {
        case 'OPTIONS':
            res.statusCode = 200
            res.end()
            break;
        case 'GET':
            res.write(JSON.stringify({
                data: []
            }))
            res.end()
            break;
        case 'POST':
            let content = ''
            // 读取数据
            req.on('data', (chunk) => {
                content += chunk
            })
            // 数据发送完成
            req.on('end', () => {
                res.write(JSON.stringify({
                    code: 1,
                    data: {}
                }))
                res.end()
            })
            break;
        default:
            break;
    }
}).listen(4000)

console.log('http server is start...')


// 连接 mysql 数据库
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '010625hlabc',
    database: 'node'
})

connection.connect()

connection.query('SELECT * FROM user', (error, results, fields) => {
    if (error) {
        console.log(error)
    }
    console.log(results)
})

connection.end()