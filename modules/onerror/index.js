/**
 * 处理错误中间件
 */
//const chalk = require('chalk');
//const logger = require('../logger')

module.exports = function () {
  return async function(ctx, next) {
    try {
      await next();
    } catch (err) {


      let is_show_message = false //是否是需要暴露给前端的错误状态
      if (err.message.indexOf('showerror') == 0) {
        is_show_message = true
      }

      if (!is_show_message) {
        let errorobj = {message: err.message, stack: err.stack, url: ctx.href, header: ctx.header}
        if (err.apilog) {
          errorobj.apilog = err.apilog
        }        
        //logger.error(errorobj)
      }

      
      
      ctx.status = 500   
      
      if(ctx.url.indexOf('/api/') == 0){
        ctx.status = 200
        if (process.env.NODE_ENV == "development") {
            console.error(err)
            if (is_show_message) {
              err.message = err.message.substring(9)           
            }

            ctx.body = {
                re: false,
                message: err.message,
                result: err.stack
            }          
        }
        else{
          if (is_show_message) {
            ctx.body = {
                re: false,
                message: err.message.substring(9)
            }             
          }
          else{
            ctx.body = {
                re: false,
                message: 'system error'
            }             
          }
        } 
      }
      else{
        if (process.env.NODE_ENV == "development") {
          console.error(err)
          ctx.body = `<textarea style="width: 800px; height: 400px; margin:0 auto;display:block;font-family: consolas; font-size:14px; line-height:175%; overflow:auto; border:0;background-color:#f3f3f3; padding:20px;">ERROR\n${err.stack}</textarea>`
        }
        else{
            
            //logger.error({message: err.message, stack: err.stack, url: ctx.href})
            //console.error(chalk.red.bold(err)) //err.name + err.message + err.stack
            //console.info(chalk.red(err.stack)); //err.name + ':' + err.message + 
            await ctx.render('shared/error', {
              title: '500',
              layout: false
            })            
        }          
      }
      

      //throw err;
    }
  }
}