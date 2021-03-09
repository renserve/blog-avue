/**
 * 配置参考:
 * https://cli.vuejs.org/zh/config/
 */
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');
function resolve(dir) {
    return path.join(__dirname, dir);
}
const CompressionPlugin = require("compression-webpack-plugin")

module.exports = {
    publicPath: '/',
    outputDir:'admin',
    lintOnSave: true,
    productionSourceMap: false,
    chainWebpack: config => {
        // 忽略的打包文件
        config.optimization.minimizer([
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        warnings: false,
                        drop_console: true, // console
                        pure_funcs: ['console.log'] // 绉婚櫎console
                    }
                }
            })
        ])
        config.resolve.alias.set("@", resolve("src"))
        if (process.env.use_analyzer) {     // 分析
            config
                .plugin('webpack-bundle-analyzer')
                .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
            
        }
        config.plugin('compressionPlugin').use(new CompressionPlugin({
            test: /\.js$|\.html$|\.css/, // 匹配文件名
            threshold: 10240, // 对超过10k的数据压缩
            deleteOriginalAssets: false // 不删除源文件
        }))
        config.externals({
            'highlight.js':'hljs',
            'vue-router': 'VueRouter',
            'avue-plugin-formdesign':'AvueFormDesign',
            'mavon-editor':'MavonEditor',
            'vue': 'Vue',
            'vuex':'Vuex',
            'element-ui': 'ELEMENT',
            'axios': 'axios'
        })
        const entry = config.entry('app')
        entry
            .add('babel-polyfill')
            .end()
        entry
            .add('classlist-polyfill')
            .end()
    },
    // 配置转发代理
    devServer: {
        proxy: 'http://127.0.0.1:5000',
    }
}
