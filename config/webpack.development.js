const path = require('path');
const Autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: {
    app: ['@babel/polyfill', path.resolve(__dirname, '../examples/app.js')]
  },
  devServer: {
    contentBase: path.resolve(__dirname, '../examples'),
    hot: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      title: `${process.env.NODE_ENV}`,
      template: path.resolve(__dirname, '../examples/index.html')
    })
  ],
  module: {
    rules: [
      {
        test: /\.(c|sa|sc)ss$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          {
            loader: 'postcss-loader',
            ident: 'postcss',
            options: {
              plugins: [Autoprefixer()]
            }
          },
          'sass-loader'
        ]
      }
    ]
  }
};
