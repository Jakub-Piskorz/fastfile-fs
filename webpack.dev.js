const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const { basename } = require('./src/config.js')

module.exports = merge(common, {
  mode: 'development',
  devServer: {
    port: 8081,
    open: basename,
    historyApiFallback: {
      index: basename
    }
  },
  output: {
    publicPath: basename
  }
})
