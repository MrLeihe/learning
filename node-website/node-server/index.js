const http = require("http")
const mysql = require('mysql')
const url = require('url')
const qs = require('querystring')

// 连接 mysql 数据库
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '010625hlabc',
    database: 'node'
})

connection.connect()

/** 
 * 注册 register
 * 登录 login
 * 提交留言 sendMessage
 * 获取留言 getMessage
 */

/** 处理请求 */
http.createServer((req, res) => {
    // 设置允许跨域的域名， *表示任何域名
    res.setHeader('Access-Control-Allow-Origin', '*')
    // 设置 header 类型
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    // 允许跨域的请求方式
    res.setHeader('Content-Type', 'application/json')
    console.log('url', req.url)
    switch (req.method) {
        case 'OPTIONS':
            res.statusCode = 200
            res.end()
            break;
        case 'GET':
            if (req.url === '/getMessage') {
                getMessage(res)
            }
            break;
        case 'POST':
            let content = ''
            // 读取数据
            req.on('data', (chunk) => {
                content += chunk
            })

            // 数据发送完成
            req.on('end', () => {
                const params = qs.parse(content)
                const pathName = url.parse(req.url).pathname
                if (pathName === '/register') {
                    console.log('register')
                    insertUser(params, res)
                } else if (pathName === '/login') {
                    console.log('login')
                    login(params, res)
                } else if (pathName === '/sendMessage') {
                    console.log('sendMessage')
                    sendMessage(params, res)
                }
            })
            break;
        default:
            break;
    }
}).listen(8888)

function login(params, response) {
    const querySql = `SELECT * FROM user where user_name = '${params.username}'`
    connection.query(querySql, (err, result) => {
        if (err) {
            reject(err)
            console.log('注册失败--query', err)
            failCallback(response, '系统错误')
        } else {
            // 用户不存在
            if (!result || !result.length) {
                failCallback(response, '用户不存在')
            } else {
                const userInfo = JSON.parse(JSON.stringify(result[0]))
                if (userInfo.user_password === params.password) {
                    successCallback(response, '登录成功', {
                        id: userInfo.id,
                        userName: userInfo.user_name
                    })
                } else {
                    failCallback(response, '密码错误')
                }
            }
        }
    })
}

function insertUser(params, response) {
    const userName = params.username
    const password = params.password
    const createTime = getNowFormatDate()
    if (!userName) {
        return failCallback(response, '用户名不能为空')
    }
    new Promise((resolve, reject) => {
        const querySql = `SELECT * FROM user where user_name = '${userName}'`
        connection.query(querySql, (err, result) => {
            console.log(result)
            if (err) {
                reject(err)
                console.log('注册失败--query', err)
                failCallback(response, '系统错误')
            } else if (result && result.length) {
                failCallback(response, '用户名已存在')
            } else {
                resolve()
            }
        })
    }).then(result => {
        const insertSql = `INSERT INTO user(user_name, user_password, time) VALUES(?, ?, ?)`
        const insertParams = [userName, password, createTime]
        connection.query(insertSql, insertParams, (err, insertRes) => {
            if (err) {
                reject(err)
                console.log('注册失败', err)
                failCallback(response, '系统错误')
            } else {
                console.log('注册成功')
                // 返回数据给客户端
                successCallback(response, '注册成功', null)
            }
        })
    })
}

function sendMessage(params, response) {
    const insertSql = `INSERT INTO message(user_name, user_message, time) VALUES(?, ?, ?)`
    const insertParams = [params.username, params.message, getNowFormatDate()]
    connection.query(insertSql, insertParams, (err, insertRes) => {
        if (err) {
            console.log('留言失败', err)
            failCallback(response, '系统错误')
        } else {
            console.log('留言成功')
            // 返回数据给客户端
            successCallback(response, '留言成功', null)
        }
    })
}

function getMessage(response) {
    const querySql = `SELECT * FROM message`
    connection.query(querySql, (err, result) => {
        console.log(result)
        if (err) {
            console.log('获取留言失败', err)
            failCallback(response, '系统错误')
        } else {
            successCallback(response, '获取留言成功', result)
        }
    })
}

function successCallback(res, message, data) {
    res.write(JSON.stringify({
        code: 0,
        message: message,
        data: data
    }))
    // 结束响应
    res.end()
}

function failCallback(res, message) {
    res.write(JSON.stringify({
        code: -1,
        message: message,
        data: null
    }))
    // 结束响应
    res.end()
}

console.log('http server is start...')


// 获取当前时间
function getNowFormatDate() {
    var date = new Date();
    var year = date.getFullYear(); // 年
    var month = date.getMonth() + 1; // 月
    var strDate = date.getDate(); // 日
    var hour = date.getHours(); // 时
    var minute = date.getMinutes(); // 分
    var second = date.getMinutes(); // 秒
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    // 返回 yyyy-mm-dd hh:mm:ss 形式
    var currentdate = year + "-" + month + "-" + strDate + " " + hour + ":" + minute + ":" + second;
    return currentdate;
}
