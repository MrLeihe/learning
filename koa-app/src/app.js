const Koa = require('koa');
const bodyParser = require('koa-bodyParser');
const session = require('koa-session-minimal')
const MysqlSession = require('koa-mysql-session')

/**
 * koa init
 */
const app = new Koa();
app.use(bodyParser())

// mysql
const store = new MysqlSession({
    user: 'root',
    password: '010625hlabc',
    database: 'node',
    host: 'localhost'
})

// 使用 session 中间件
app.use(session({
    key: 'SESSION_ID',
    store: store
}))

app.use(async ctx => {

    if (ctx.path === '/set') {
        console.log('session', ctx.session)
        ctx.session = {
            user_id: Math.random().toString(36).substring(2),
            count: 0
        }
        ctx.body = ctx.session
    } else if (ctx.path === '/') {
        ctx.session.count = ctx.session.count + 1
        ctx.body = ctx.session
    }
})

// 监听 8081 端口
app.listen(8081, () => {
    console.log('server start in 8081 port...')
})