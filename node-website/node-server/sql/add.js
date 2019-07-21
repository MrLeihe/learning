const mysql = require('mysql')

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '010625hlabc',
    database: 'node'
})

connection.connect()

const addSql = 'INSERT INTO user(id, username, age) VALUES(0, ?, ?)'
const addData = ['wang', 1]

connection.query(addSql, addData, (err, res) => {
    if (err) {
        console.log('新增失败', err)
    } else {
        console.log('新增成功', res)
    }
})

// 连接结束
connection.end()