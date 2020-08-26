const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const SassLintPlugin = require('sass-lint-webpack')

const buildWebpackConfig = merge(baseWebpackConfig, {
    mode: 'production',

    plugins: [new SassLintPlugin()],
})

// export buildWebpackConfig
module.exports = new Promise(resolve => {
    resolve(buildWebpackConfig)
})
