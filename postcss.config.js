const pxtoremorem = require('postcss-pxtoremorem')
const autoprefixer = require('autoprefixer')
const mqpacker = require('mqpacker')
const cssnano = require('cssnano')

module.exports = {
    plugins: [
        autoprefixer(),
        pxtoremorem({
            replace: true,
            exclude: /node_modules/i,
        }),
        mqpacker(),
        cssnano({
            preset: [
                'default',
                {
                    discardComments: {
                        removeAll: true,
                    },
                },
            ],
        }),
    ],
}
