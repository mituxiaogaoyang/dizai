module.exports = {
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html'
    },
    monitorscreen: 'src/views/bigScreen/main.js',
    login: 'src/views/login/main.js'
  },
	css: {
    loaderOptions: { // 向 CSS 相关的 loader 传递选项
      less: {
        javascriptEnabled: true
      }
    }
  },
  devServer: {
    proxy: {
      // 注意：代理名'/apiPath'必须和pathRewrite的'^/apiPath'匹配，即'/'不能少，否则不能匹配成功
      // '/apiPath': {
      //   target: 'http://10.30.0.99:8090',
      //   changeOrigin: true,
      //   ws: true,
      //   pathRewrite:{'^/apiPath' : ''}
      // },
      '/apiPath': {
        target: 'http://10.10.254.67:8090',
        changeOrigin: true,
        ws: true,
        pathRewrite:{'^/apiPath' : ''}
      }
    },
		host: '10.10.254.39', // can be overwritten by process.env.HOST
		port: 8080
  }
}