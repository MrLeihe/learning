const fs = require('fs')

// 文件上传
fs.stat('upload', (err, stats) => {
    // 判断有没有 upload 目录
    if (err) {
        // 如果没有
        fs.mkdir('upload', (error) => {
            if (error) {
                onsole.log(error)
            } else {
                console.log('创建 upload 目录成功')
            }
        })
    } else {
        // 如果存在， 判断是文件还是目录
        console.log(stats.isDirectory())
        if (stats.isDirectory()) {
            console.log('upload 目录存在')
        } else {
            console.log('upload 是一个文件')
        }
    }
})

// 流操作
const fileReadStream = fs.createReadStream('./tool.js')
let count = 0
let content = ''
// 开始读取
fileReadStream.on('data', (chunk) => {
    count++
    content += chunk
})

// 读取结束
fileReadStream.on('end', () => {
    console.log('读取结束')
    console.log('count------>', count)
    console.log('content:', content.length)
})

// 读取失败
fileReadStream.on('error', (err) => {
    console.error(err)
})

// --------------写入----------------
const fileWriteStream = fs.createWriteStream('./test/temp.js')
const data = '是我入戏太深，结局却一个人，爱一个人很同，我知道你不知道'
fileWriteStream.write(data, 'utf-8')
// 写入完成
fileWriteStream.end()
fileWriteStream.on('finish', () => {
    console.log('写入完成')
})
