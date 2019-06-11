
const router = require('koa-router')()


router.get('/', async (ctx, next) => {
  ctx.body = '<h1>测试</h1>'
})
router.get('/index', async (ctx, next) => {
    await ctx.render('test/index', {
        title: '首页'
    })
})


module.exports = router