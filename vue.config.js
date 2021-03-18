// vue.config.js
module.exports = {
    runtimeCompiler: true,

    publicPath: process.env.NODE_ENV === 'production' ?
        '/production-sub-path/' //真实开发的话,如果你的项目存放在公司域名二级路径下 只需要将 /production-sub-path/改为 /公司二级路径/就可以了
        :
        './'
}