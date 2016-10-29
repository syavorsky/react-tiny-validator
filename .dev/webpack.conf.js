
const path = require('path')

const prod = process.env.NODE_ENV === 'production'

module.exports = {
  entry: prod ? {
    index: './index.js'
  } : {
    index : './index.js',
    demo  : './.dev/demo.js'
  },
  devtool : prod ? 'source-map' : 'eval',
  output  : {
    path          : path.resolve('es5'),
    filename      : '[name].js',
    publicPath    : '/',
    library       : process.env.npm_package_name,
    libraryTarget : 'umd'
  },
  externals : ['react'],
  module    : {
    loaders: [{
      test    : /\.js$/,
      loaders : ['babel'],
      exclude : /node_modules/
    }]
  },
  plugins: prod ? [] : [
    new (require('html-webpack-plugin'))({
      filename : 'index.html',
      template : '.dev/demo.html'
    }),
    new (require('webpack-notifier'))()
  ]
}
