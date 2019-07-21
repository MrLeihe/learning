const mysql = require('mysql')

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '010625hlabc',
    database: 'node'
})

connection.connect()

// sql语句
const updateSql = 'UPDATE user SET username = ?, age = ? where id = ?'
const updateParams = ['stonehe', 24, 1]

connection.query(updateSql, updateParams, (err, res) => {
    if (err) {
        console.log('修改成功', err)
    } else {
        console.log('修改成功', res)
    }
})

connection.end()