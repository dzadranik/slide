const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')

const devWebpackConfig = merge(baseWebpackConfig, {
    mode: 'development',

    watchOptions: {
        aggregateTimeout: 100,
    },

    devServer: {
        // historyApiFallback: true,
        noInfo: true,
        overlay: {
            warnings: true,
            errors: true,
        },
        contentBase: './src', // source of static assets
        compress: true,
        port: 8081, // port to run dev-server
    },
})

// export devWebpackConfig
module.exports = new Promise(resolve => {
    resolve(devWebpackConfig)
})
