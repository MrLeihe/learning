const mysql = require('mysql')

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '010625hlabc',
    database: 'node'
})

connection.connect()

const delSql = 'DELETE FROM user where id = 0'

connection.query(delSql, (err, res) => {
    if (err) {
        console.log('删除失败', err)
    } else {
        console.log('删除成功', res)
    }
})

connection.end()