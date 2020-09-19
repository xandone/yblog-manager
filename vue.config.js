module.exports = {
    lintOnSave: false,

    pwa: {
        iconPaths: {
            favicon32: 'favicon.ico',
            favicon16: 'favicon.ico',
            appleTouchIcon: 'favicon.ico',
            maskIcon: 'favicon.ico',
            msTileImage: 'favicon.ico'
        }
    },
    
    publicPath: process.env.NODE_ENV === 'production' ?
        '/yblogmanager/' : '/yblogmanager/'
}