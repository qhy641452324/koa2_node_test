var nodemon = require('nodemon');
const chalk = require('chalk');
const fs = require('fs-extra')
const path = require('path')

//nodemon
nodemon({
  script: 'app.js',
  ext: 'js json'
});

nodemon.on('start', function () {
  console.log(chalk.green('nodemon启动成功'));
}).on('quit', function () {
  console.log(chalk.blue('nodemon退出'));
  process.exit();
}).on('restart', function (files) {
  console.log('应用重启，nodemon检测到文件变动: ', files);
});


//webpack
const webpack = require("webpack");
var webpack_config = require("../webpack.config");

console.info(chalk.green('webpack开始监听'))
const compiler = webpack(webpack_config);
const watching = compiler.watch({
  /* watchOptions */
}, (err, stats) => {
  if (err) { 
    console.error(err)
  }
  else{
    let result_json = stats.toJson({
      assets: true,
      hash: false,
      modules: false,
      chunks: false
    })
    //console.info(result_json);
    if (result_json.errors.length > 0) {
      result_json.errors.forEach(v=>{
        console.info(chalk.red('ERROR in ' + v))
      })
    }
    else{
      console.info( '[' + (new Date()).toLocaleTimeString() + '] ' + chalk.blue('webpack编译成功') + ' 耗时:' + result_json.time + 'ms');
    }
    
  }
});


//less

const less = require('less')
/**
 * 生成less
 * 
 * @param {any} lesspath 
 */
async function makeLess(lesspath) {
  let lessfile = await fs.readFile(lesspath, 'utf-8')
  less.render(lessfile, {
      paths: ['./public/css/']
    }, function (e, output) {
      if (e) {
        console.error(e);
      }
      else{
        
        if (output.css.length == 0) {
          makeLess(lesspath)

        }
        else{
          fs.writeFile(path.join(
            path.dirname(lesspath),
            path.basename(lesspath, '.less') + '.css'
          ), output.css, 'utf-8').then(function(){
            console.info(lesspath + ' 编译成功')
          })
                       
        }
   
      }
    });
}

const chokidar = require('chokidar');
var less_watcher = chokidar.watch('./public/css/*.less');
console.info(chalk.green('开始监听./public/css/*.less'));
less_watcher.on('change', lesspath => {
  // console.log(lesspath)
  makeLess("public\\css\\main.less")
  makeLess(lesspath)
})