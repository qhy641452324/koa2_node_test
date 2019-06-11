/**
 * 注册路由
 */

const glob = require('glob')

module.exports = function(app){
  var rlist = glob.sync('./routes/*.js')
  rlist.forEach(v=>{
    let route = require('../.' + v)
    app.use(route.routes(), route.allowedMethods())
  })
}