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
                target:'http://api.music.yuban32.com/',
                ws:true,
                changeOrigin:true,
            }
        }
    }
}