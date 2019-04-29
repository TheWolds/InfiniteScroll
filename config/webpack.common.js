const path = require('path');

module.exports = () => ({
    output: {
        path: path.resolve(__dirname, '../examples'),
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    }
});