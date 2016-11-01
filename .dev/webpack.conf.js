
const path = require('path')

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  entry: {
    index: './index.js'
  },
  devtool : isProd ? 'source-map' : 'eval',
  output  : {
    path          : path.resolve('es5'),
    filename      : '[name].js',
    publicPath    : '/es5/',
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
  plugins: isProd ? [] : [
    new (require('webpack-notifier'))()
  ]
}
