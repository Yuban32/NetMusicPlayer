// vue.config.js
module.exports = {
    runtimeCompiler: true,
    publicPath: './',
    pwa: {
        iconPaths: {
            favicon32: 'favicon.ico',
            favicon16: 'favicon.ico',
            appleTouchIcon: 'favicon.ico',
            maskIcon: 'favicon.ico',
            msTileImage: 'favicon.ico'
        }
    },devServer:{
        proxy:{
            '/':{
                target:'https://api.wick32.cn',
                ws:true,
                changeOrigin:true,
            }
        }
    }
}