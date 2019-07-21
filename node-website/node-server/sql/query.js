const mysql = require('mysql')

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '010625hlabc',
    database: 'node'
})

connection.connect()

const querySql = 'SELECT * FROM user where age = 24 || id = 2'

connection.query(querySql, (err, res) => {
    if (err) {
        console.log('查询失败', err)
    } else {
        console.log('查询成功', res)
    }
})

connection.end()