var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var env = process.env.WEBPACK_ENV;

module.exports = {
  entry: './src/index.js',
  output: {
    filename: env === 'dist' ? 'ionimage.min.js' : 'ionimage.js',
    path: './dist'
  },
  module: {
    loaders: [{
      test: /\.jade$/,
      loader: 'jade'
    }, {
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader')
    }]
  },
  externals: {
    angular: 'angular'
  },
  plugins: [
    new ExtractTextPlugin('ionimage.css')
  ].concat(env === 'dist' ? [
    new webpack.optimize.UglifyJsPlugin({minimize: true})
  ] : [])
};
