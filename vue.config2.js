const path = require('path')
const webpack = require('webpack')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
// GZIP压缩
// const CompressionWebpackPlugin = require('compression-webpack-plugin')
// 自定义配置文件
const config = require('./src/config')
// 分割文件列表用于注入
const { dll } = require('./dev/config')

const isProduction = process.env.NODE_ENV === 'production'
// 项目路径前缀
const publicPath = config.publicPath + '/'

const systemTitle = config.systemTitle

function resolve (dir) {
  return path.join(__dirname, dir)
}

// vue.config.js
module.exports = {
  // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
  productionSourceMap: false,

  //打包app时放开该配置
  publicPath: publicPath,

  configureWebpack: config => {

    config.plugins.push(
      ...Object.keys(dll.entry).map(name => {
        return new webpack.DllReferencePlugin({
          context: process.cwd(),
          manifest: require(path.join(dll.path, `/${name}.manifest.json`))
        })
      }),
      // 将 dll 注入到 生成的 html 模板中
      new AddAssetHtmlPlugin({
        // dll文件位置
        filepath: path.resolve(dll.path, '*.js'),
        // dll 引用路径
        publicPath: path.join(publicPath, '/dll'),
        // dll最终输出的目录
        outputPath: './dll'
      }))

    if (isProduction) {
      // GZIP压缩
      /* config.plugins.push(
         new CompressionWebpackPlugin({
           filename: '[path].gz[query]',
           algorithm: 'gzip',
           test: /\.js$|\.css/,
           threshold: 10240,
           // deleteOriginalAssets:true, //删除源文件，不建议
           minRatio: 0.8
         })
       )*/
      //生产环境取消 console.log
      //   config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
      // 图片压缩
      config.module.rules.push({
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [{
          loader: 'image-webpack-loader',
          options: {
            bypassOnDebug: true,
            disable: true
          }
        }]
      })
    }
  },
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@$', resolve('src'))
      .set('@api', resolve('src/api'))
      .set('@assets', resolve('src/assets'))
      .set('@comp', resolve('src/components'))
      .set('@views', resolve('src/views'))
      .set('@layout', resolve('src/layout'))
      .set('@static', resolve('src/static'))
      .set('@mobile', resolve('src/modules/mobile'))
    if (isProduction) {
      // 移除 preload 插件
      config.plugins.delete('preload')
      // 压缩html
      config.plugin('html')
        .tap(args => {
          args[0] = Object.assign(args[0], {
            publicPath: publicPath,
            minify: {
              removeComments: true,//清除注释
              collapseWhitespace: true, //清理空格
              //是否压缩html里的css（使用clean-css进行的压缩） 默认值false；
              minifyCSS: true,
              //是否压缩html里的js（使用uglify-js进行的压缩）
              minifyJS: true
            },
          })
          return args
        })
      // 添加pwa需要插件
      config.plugin('workbox')

    }
    config.plugin('html').tap(args => {
      args[0].title= systemTitle
      return args
    })
  },

  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          /* less 变量覆盖，用于自定义 ant design 主题 */

          /*
          'primary-color': '#F5222D',
          'link-color': '#F5222D',
          'border-radius-base': '4px',
          */
        },
        javascriptEnabled: true
      }
    },
    extract: false
  },

  devServer: {
    port: 9090,
    proxy: {
      //生产
      //   '/suncare_v3': {
      //     target: 'https://ybjg.lingwww.com/', //请求本地 需要jeecg-boot后台项目https://test.lingwww.com
      //     ws: true,
      //     changeOrigin: true,
      //     pathRewrite: {
      //         '/suncare_v3': '/suncare_v4'  //默认所有请求都加了jeecg-boot前缀，需要去掉
      //       }
      //   },
      //准生产
      '/suncare_v3': {
        // target: 'https://prepro.lingwww.com/', //请求本地 需要jeecg-boot后台项目https://prepro.lingwww.com/
        target: config.localAddress, //请求本地 需要jeecg-boot后台项目
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '/suncare_v3': '/suncare_v3'  //默认所有请求都加了jeecg-boot前缀，需要去掉
        }
      },
      '/prod_suncare_v3': {
        target: config.prodAddress, //请求本地 需要jeecg-boot后台项目
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '/prod_suncare_v3': '/suncare_v3'  //默认所有请求都加了jeecg-boot前缀，需要去掉
        }
      },
      '/riskportal_v3': {
        target: config.prodAddress, //请求本地 需要jeecg-boot后台项目
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '/riskportal_v3': '/riskportal_v3'  //默认所有请求都加了jeecg-boot前缀，需要去掉
        }
      },


      //   '/riskportal_v3-test':{
      //     target: 'https://prepro.lingwww.com/', //请求本地 需要jeecg-boot后台项目
      //     ws: true,
      //     changeOrigin: true,
      //     pathRewrite: {
      //       '/riskportal_v3-test': '/rpv4-admin-pro'  //默认所有请求都加了jeecg-boot前缀，需要去掉
      //     }
      //   },
      //   '/rpv4-solr-admin-pro':{
      //     target: 'https://prepro.lingwww.com/', //请求本地 需要jeecg-boot后台项目
      //     ws: true,
      //     changeOrigin: true,
      //     pathRewrite: {
      //       '/rpv4-solr-admin-pro': '/rpv4-solr-admin-pro'  //默认所有请求都加了jeecg-boot前缀，需要去掉
      //     }
      //   },

      //生产
      // '/rpv4-admin':{
      //     target: 'https://ybjg.lingwww.com/', //请求本地 需要jeecg-boot后台项目
      //     ws: true,
      //     changeOrigin: true,
      //     pathRewrite: {
      //       '/rpv4-admin': '/rpv4-admin'  //默认所有请求都加了jeecg-boot前缀，需要去掉
      //     }
      //   },

      //   '/riskportal_solr-test':{
      //     target: 'https://ybjg.lingwww.com/', //请求本地 需要jeecg-boot后台项目
      //     ws: true,
      //     changeOrigin: true,
      //     pathRewrite: {
      //       '/riskportal_solr-test': '/rpv4-solr-admin'  //默认所有请求都加了jeecg-boot前缀，需要去掉
      //     }
      //   },
      //准生产

      '/rpv4-admin': {
        target: 'https://prepro.lingwww.com/', //请求本地 需要jeecg-boot后台项目

        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '/rpv4-admin': '/rpv4-admin-pro'  //默认所有请求都加了jeecg-boot前缀，需要去掉
        }
      },

      '/riskportal_solr-test': {
        target: 'https://prepro.lingwww.com/', //请求本地 需要jeecg-boot后台项目
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '/riskportal_solr-test': '/rpv4-solr-admin-pro'  //默认所有请求都加了jeecg-boot前缀，需要去掉
        }
      },
      '/suncare_v3test': {
        target: 'https://prepro.lingwww.com/', //请求本地 需要jeecg-boot后台项目
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '/suncare_v3test': '/suncare_v3test'  //默认所有请求都加了jeecg-boot前缀，需要去掉
        }
      }
      // '/rpv4-admin': {
      //   target: 'https://test.lingwww.com/', //请求本地 需要jeecg-boot后台项目
      //   ws: true,
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '/riskportal_v3-test': '/riskportal_v3-test'  //默认所有请求都加了jeecg-boot前缀，需要去掉
      //   }
      // },
      // '/riskportal_solr-test': {
      //   target: 'https://test.lingwww.com/', //请求本地 需要jeecg-boot后台项目https://prepro.lingwww.com/ 测试https://test.lingwww.com/
      //   ws: true,
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '/riskportal_solr-test': '/riskportal_solr-test'  //默认所有请求都加了jeecg-boot前缀，需要去掉
      //   }
      // },
    }
  },

  lintOnSave: undefined,
  pwa: isProduction ? {
    name: '医保风控系统',
    themeColor: '#001529',
    msTileColor: '#1890ff',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    manifestOptions: {
      'icons': [
        { 'src': './logo.png', 'sizes': '32x32', 'type': 'image/png' },
        { 'src': './logo-256.png', 'sizes': '256X256', 'type': 'image/png' }
      ],
      'orientation': 'landscape',
      'display': 'fullscreen'
    },
    // 配置 workbox 插件
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      // InjectManifest 模式下 swSrc 是必填的。
      swSrc: './public/sw.js', // 本地sw.js相对路径
      importWorkboxFrom: 'disabled', // 决定是否引入workbox
      exclude: [/\.html$/, /sw.js$/] // 缓存列表排除的文件，可以是文件名或正则
    }
  } : {}
}