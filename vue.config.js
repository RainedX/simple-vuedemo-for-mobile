const path = require('path')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css']

function resolve(dir) {
    return path.join(__dirname, './', dir)
}

const externals = {
    'vue': 'Vue',
    'vue-router': 'VueRouter',
    'vuex': 'Vuex',
    'vant': 'VANT'
}

const cdn = {
    dev: {
        css: [
            'https://cdn.jsdelivr.net/npm/vant@2.0/lib/index.css'
        ],
        js: []
    },
    build: {
        css: [
            'https://cdn.jsdelivr.net/npm/vant@2.0/lib/index.css'
        ],
        js: [
            'https://cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.min.js',
            'https://cdn.jsdelivr.net/npm/vue-router@3.0.3/dist/vue-router.min.js',
            'https://cdn.jsdelivr.net/npm/vuex@3.0.1/dist/vuex.min.js',
            'https://cdn.jsdelivr.net/npm/vant@2.0/lib/vant.min.js'
        ]
    }
}

module.exports = {
    publicPath: './',
    productionSourceMap: false,
    /**
    * 添加CDN参数到htmlWebpackPlugin配置中， 详见public/index.html 修改
    */
    chainWebpack: config => {
        config.plugin('html').tap(args => {
            if (process.env.NODE_ENV === 'production') {
                args[0].cdn = cdn.build
            }
            if (process.env.NODE_ENV === 'development') {
                args[0].cdn = cdn.dev
            }
            return args
        })
    },
    // 修改webpack config, 使其不打包externals下的资源
    configureWebpack: config => {
        if (process.env.NODE_ENV === 'production') {
            // 1. 生产环境npm包转CDN
            config.externals = externals
            // 生产环境
            config.plugins.push(
                new CompressionWebpackPlugin({
                    filename: '[path].gz[query]',
                    algorithm: 'gzip',
                    test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
                    threshold: 10240,
                    minRatio: 0.8
                })
            );
        }
    }
}