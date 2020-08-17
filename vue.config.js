module.exports = {
    devServer: {
        proxy: {
            '^/bus|^/map': {
                target: 'https://bus.mattschlosser.me/'
            }
        }
    },
    chainWebpack: config => {
        config
        .plugin('html')
        .tap(args => {
          args[0].title = 'Bus App'
          return args
        })
    }
}