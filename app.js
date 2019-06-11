const Koa = require('koa')
const path = require('path')
const render = require('./modules/koaejs')
const reg_route = require('./modules/reg_route')
const koaBody = require('koa-body')
const app = new Koa();

// app.use(upload);

//静态资源配置 
app.use(require('koa-static')(__dirname + '/public'))

app.use(koaBody({ multipart: true }))

app.use(async (ctx, next) => {
    ctx.set('LocalDate', (new Date()).toLocaleString())
    ctx.set('ServerNum', process.env.SERVERNUM)
    await next()
})

render(app, {
    root: path.join(__dirname, 'views'),
    layout: 'shared/layout',
    viewExt: 'ejs',
    cache: false,
    debug: false
});

reg_route(app);

app.use(async (ctx, next) => {
    ctx.status = 404
    // if (ctx.header.referer || ctx.header.cookie) {
    //   logger.error({message: '404', stack: '', url: ctx.href, header: ctx.header})
    // }
    if (process.env.NODE_ENV == 'development') {
        ctx.body = '<h1>404</h1>'
    }
    else {
        await ctx.render('shared/404', { title: '404', layout: false })
    }
})

app.listen(3000)
console.log('[demo] start-quick is starting at port 3000')