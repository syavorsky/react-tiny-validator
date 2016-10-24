
const path = require('path')

module.exports = {
  entry: {
    index : './index.js',
    demo  : './.dev/demo.js'
  },
  devtool : 'eval',
  output  : {
    path       : path.resolve('./.tmp'),
    filename   : '[name].es5.js',
    publicPath : '/'
  },
  module: {
    loaders: [{
      test    : /\.js$/,
      loaders : ['babel'],
      exclude : /node_modules/
    }]
  },
  plugins: [
    new (require('html-webpack-plugin'))({
      filename : 'index.html',
      template : '.dev/demo.html'
    }),
    new (require('webpack-notifier'))()
  ]
}
