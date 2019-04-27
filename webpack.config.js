const merge = require('webpack-merge');
const webpackCommonConfig = require('./config/webpack.common');

module.exports = () => {
    const mode = process.env.NODE_ENV || 'development';
    const isDev = mode === 'development';
    const devtool = isDev ? 'inline-source-map' : 'source-map';

    const config = {
        mode,
        devtool
    };

    console.log(config);

    return merge.smart(
        webpackCommonConfig(),
        config,
        require(`./config/webpack.${mode}`)
    );
};