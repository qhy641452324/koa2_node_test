var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: {
    main: './jssrc/main.js'
  },
  output: {
    path: path.resolve(__dirname, './public/js/'),
    filename: '[name].js'
  },

  module: //加载器配置
  {
    rules: [{
      test: /\.(html|ejs)$/,
      use: 'raw-loader'
    }]
  },
  devtool: 'source-map',
  mode: 'development'
};