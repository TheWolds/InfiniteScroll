const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    entry: {
        app: ['@babel/polyfill', path.resolve(__dirname, '../src/index.js')]
    },
    devServer: {
        contentBase: path.resolve(__dirname, '../examples'),
        hot: true,
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            title: `TODO ${process.env.NODE_ENV}`,
            template: path.resolve(__dirname, '../public/index.html')
        })
    ],
    module: {
        rules: [
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader",
                ]
            },
            {
                test: /\.(png|jpg|gif|svg|ico)$/,
                use: 'file-loader'
            },
            {
                test: /\.(eot|woff|woff2|ttf)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: './font/',
                            publicPath: './font/'
                        }
                    }
                ]
            }
        ]
    }
}